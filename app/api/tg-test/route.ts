import { NextResponse } from "next/server"

export const runtime = "nodejs"

const handler = async () => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json({ ok: false, error: "Missing envs" }, { status: 500 })
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
      return NextResponse.json({ ok: false, detail }, { status: 502 })
    }

    return NextResponse.json({ ok: true, detail })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export { handler as GET }

