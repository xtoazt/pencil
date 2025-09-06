import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/database"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    const sql = getSql()

    // Get user stats (mock data for now since we don't have activity tracking tables)
    const stats = {
      totalMessages: Math.floor(Math.random() * 1000) + 100,
      totalCodeGenerations: Math.floor(Math.random() * 200) + 50,
      totalImages: Math.floor(Math.random() * 100) + 20,
      totalSuperMode: Math.floor(Math.random() * 50) + 10,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date().toISOString(),
      favoriteModel: "gpt-4.1-nano",
      totalTokens: Math.floor(Math.random() * 100000) + 10000
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Profile stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
