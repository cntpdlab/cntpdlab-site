import { NextResponse } from "next/server"
import { z } from "zod"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST,OPTIONS",
  "access-control-allow-headers": "Content-Type",
} as const

const baseHeaders = {
  "content-type": "application/json",
  "cache-control": "no-store",
}

const headers = { ...baseHeaders, ...corsHeaders } as const

const rateLimitWindowMs = 8_000
const rateLimiter = new Map<string, number>()

const LeadSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z
    .string()
    .trim()
    .max(120)
    .optional()
    .refine((value) => !value || /^[^@\s]+@[^@\s]+$/.test(value), "Invalid email"),
  notes: z.string().trim().max(2000).optional(),
  extra_field: z.string().optional(),
})

const sanitize = (value: unknown) =>
  typeof value === "string" ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "-"

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers })

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const method = req.method
  console.log("[lead] request", { method, ip })

  try {
    const rawBody = await req.json().catch(() => ({}))
    const parsed = LeadSchema.safeParse(rawBody)
    console.log("[lead] validation", { success: parsed.success, ip })

    if (!parsed.success) {
      return jsonResponse(
        { ok: false, error: "validation", issues: parsed.error.flatten() },
        400
      )
    }

    const { name, email, notes, extra_field } = parsed.data

    const isHoneypot = Boolean(extra_field && extra_field.trim().length > 0)
    if (isHoneypot) {
      console.log("[lead] honeypot", { ip })
      return jsonResponse({ ok: true, skip: "honeypot" })
    }

    const now = Date.now()
    const lastRequestAt = rateLimiter.get(ip) ?? 0
    if (now - lastRequestAt < rateLimitWindowMs) {
      console.log("[lead] rate_limited", { ip })
      return jsonResponse({ ok: false, error: "rate_limited" }, 429)
    }
    rateLimiter.set(ip, now)

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.log("[lead] missing envs", { ip })
      return jsonResponse({ ok: false, error: "server_error", detail: "Missing envs" }, 500)
    }

    const message = [
      "🆕 New lead",
      "",
      `👤 Name: ${name ? sanitize(name) : "-"}`,
      `✉️ Email: ${email ? sanitize(email) : "-"}`,
      "",
      `📝 Notes: ${notes ? sanitize(notes) : "-"}`,
    ].join("\n")

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })

    const responseBody = (await telegramResponse.json().catch(() => ({}))) as { ok?: boolean; [key: string]: unknown }
    console.log("[lead] telegram", { status: telegramResponse.status, ok: responseBody?.ok, ip })

    if (!telegramResponse.ok || responseBody?.ok !== true) {
      return jsonResponse(
        { ok: false, error: "telegram_failed", detail: responseBody },
        502
      )
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error"
    console.log("[lead] error", { ip, message })
    return jsonResponse({ ok: false, error: "server_error", detail: message }, 500)
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}



