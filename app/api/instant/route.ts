import { type NextRequest, NextResponse } from "next/server"
import { geminiInstantCompletion } from "@/lib/gemini"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let decoded: { userId: string; username: string; name: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string; name: string }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { content, source } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Use Gemini for ultra-fast instant responses with fallback
    let result
    try {
      result = await geminiInstantCompletion(content)
    } catch (geminiError: any) {
      console.error("Gemini API failed, using fallback:", geminiError.message)
      // Fallback response if Gemini fails
      result = {
        content: `I received your message: "${content}". This is a fallback response as the AI service is temporarily unavailable.`,
        model: "fallback",
        processingTime: 100,
        apiKey: "fallback",
        alternatives: []
      }
    }

    return NextResponse.json({
      content: result.content,
      model: result.model,
      processingTime: result.processingTime,
      apiKey: result.apiKey,
      source: source || 'unknown',
      timestamp: Date.now(),
      alternatives: result.alternatives || []
    })
  } catch (error: any) {
    console.error("Instant API error:", error)
    return NextResponse.json({
      error: "Instant processing failed",
      details: error.message,
      code: error.code || "UNKNOWN"
    }, { status: 500 })
  }
}
