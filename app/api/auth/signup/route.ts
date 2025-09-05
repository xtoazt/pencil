import { type NextRequest, NextResponse } from "next/server"
import { sql, createUserPreferences } from "@/lib/database"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    const { username, password, name } = await request.json()

    if (!username || !password || !name) {
      return NextResponse.json({ error: "Username, password, and name are required" }, { status: 400 })
    }

    const fakeEmail = `${username}@pencil.internal`

    // Check if username already exists
    const existingUsers = await sql`
      SELECT id FROM neon_auth.users_sync WHERE name = ${username} AND deleted_at IS NULL
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const users = await sql`
      INSERT INTO neon_auth.users_sync (email, name, raw_json)
      VALUES (${fakeEmail}, ${name}, ${JSON.stringify({ password: hashedPassword, username: username })})
      RETURNING id, email, name
    `

    const user = users[0]

    // Create user preferences
    await createUserPreferences(user.id)

    const token = jwt.sign({ userId: user.id, username: username, name: user.name }, JWT_SECRET, { expiresIn: "7d" })

    // Create response with user data
    const response = NextResponse.json({
      id: user.id,
      username: username,
      name: user.name,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
