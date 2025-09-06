import { NextResponse } from "next/server"
import { getGeminiStatus, geminiHealthCheck } from "@/lib/gemini"

export async function GET() {
  try {
    const status = getGeminiStatus()
    const health = await geminiHealthCheck()
    
    return NextResponse.json({
      status,
      health,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Gemini status API error:", error)
    return NextResponse.json(
      { error: "Failed to get Gemini status" },
      { status: 500 }
    )
  }
}
