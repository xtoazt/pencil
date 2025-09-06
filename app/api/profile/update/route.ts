import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/database"
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

    const { name } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const sql = getSql()

    // Update user name
    await sql`
      UPDATE users 
      SET name = ${name.trim()}, updated_at = NOW()
      WHERE id = ${decoded.userId}
    `

    // Generate new token with updated name
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        name: name.trim(),
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    const response = NextResponse.json({
      id: decoded.userId,
      username: decoded.username,
      name: name.trim(),
    })

    response.cookies.set("auth-token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
