import { NextResponse } from "next/server"

export const runtime = "nodejs"

type LeadPayload = {
  name?: string
  email?: string
  notes?: string
}

const sanitize = (value: unknown) =>
  typeof value === "string" ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "-"

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as LeadPayload
    const name = body?.name?.trim() || ""
    const email = body?.email?.trim() || ""
    const notes = body?.notes?.trim() || ""

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json({ ok: false, error: "Missing envs" }, { status: 500 })
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

    if (!telegramResponse.ok || responseBody?.ok !== true) {
      return NextResponse.json(
        { ok: false, error: "Telegram failed", detail: responseBody },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

