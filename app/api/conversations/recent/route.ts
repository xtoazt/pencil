import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
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

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const userId = decoded.userId

    const conversations = await sql`
      SELECT id, title, mode, updated_at
      FROM conversations 
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
      LIMIT 10
    `

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Recent conversations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
