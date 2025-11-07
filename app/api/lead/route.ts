import { NextResponse } from "next/server"

const successResponse = (req: Request) => {
  const accept = req.headers.get("accept") ?? ""
  if (accept.includes("text/html")) {
    const url = new URL(req.url)
    url.searchParams.set("lead", "success")
    return NextResponse.redirect(url)
  }
  return NextResponse.json({ ok: true })
}

const errorResponse = (req: Request, message: string, status = 400) => {
  const accept = req.headers.get("accept") ?? ""
  if (accept.includes("text/html")) {
    const url = new URL(req.url)
    url.searchParams.set("lead", "error")
    return NextResponse.redirect(url)
  }
  return NextResponse.json({ ok: false, error: message }, { status })
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const honeypot = formData.get("hp")
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      return successResponse(req)
    }

    const name = typeof formData.get("name") === "string" ? formData.get("name")!.trim() : ""
    const email = typeof formData.get("email") === "string" ? formData.get("email")!.trim() : ""
    const notes = typeof formData.get("notes") === "string" ? formData.get("notes")!.trim() : ""

    if (!name || !email || !notes) {
      return errorResponse(req, "Missing required fields.")
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.warn("Telegram credentials are not configured.")
      return errorResponse(req, "Messaging service unavailable.", 503)
    }

    const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

    const message = [
      "<b>New CntpdLab lead</b>",
      "",
      `<b>Name:</b> ${escape(name)}`,
      `<b>Email:</b> ${escape(email)}`,
      "",
      `<b>Notes:</b>`,
      escape(notes),
    ].join("\n")

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    })
    const telegramJson = (await telegramResponse.json().catch(() => ({}))) as { ok?: boolean; description?: string }

    if (!telegramResponse.ok || telegramJson?.ok === false) {
      const message = telegramJson?.description || `Telegram request failed (${telegramResponse.status})`
      console.error("Telegram send error", message)
      return errorResponse(req, "Failed to deliver message.", 502)
    }

    return successResponse(req)
  } catch (error) {
    console.error("Lead handler error", error)
    return errorResponse(req, "Unable to process request.", 500)
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}

