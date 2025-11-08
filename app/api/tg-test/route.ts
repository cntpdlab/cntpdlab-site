import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const headers = {
  "content-type": "application/json",
  "cache-control": "no-store",
} as const

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers })

const handler = async (req: Request) => {
  try {
    const internalKey = process.env.INTERNAL_HEALTH_KEY
    if (internalKey) {
      const url = new URL(req.url)
      if (url.searchParams.get("key") !== internalKey) {
        return jsonResponse({ ok: false, error: "forbidden" }, 403)
      }
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return jsonResponse({ ok: false, error: "server_error", detail: "Missing envs" }, 500)
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Hello from prod 👋",
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })

    const detail = (await telegramResponse.json().catch(() => ({}))) as Record<string, unknown>

    if (!telegramResponse.ok || detail?.ok !== true) {
      return jsonResponse({ ok: false, error: "telegram_failed", detail }, 502)
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error"
    return jsonResponse({ ok: false, error: "server_error", detail: message }, 500)
  }
}

export { handler as GET }


