import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
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

import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const text = searchParams.get("text") || "Ping from tg-test"
  const chatId = searchParams.get("chat_id") || process.env.TELEGRAM_CHAT_ID
  const token = process.env.TELEGRAM_BOT_TOKEN

  if (!token || !chatId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in env",
      },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    })

    const bodyText = await res.text()
    let parsed = {}
    if (bodyText) {
      try {
        parsed = JSON.parse(bodyText)
      } catch (error) {
        parsed = { raw: bodyText }
      }
    }

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      body: parsed,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: String(err),
      },
      { status: 500 }
    )
  }
}

