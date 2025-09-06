import { NextResponse } from "next/server"
import { getApiStatus } from "@/lib/llm7"

export async function GET() {
  try {
    const apiStatus = getApiStatus()
    
    return NextResponse.json({
      apiStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  } catch (error) {
    console.error("Status API error:", error)
    return NextResponse.json(
      { error: "Failed to get status" },
      { status: 500 }
    )
  }
}
