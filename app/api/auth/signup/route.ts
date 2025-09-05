import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Signup request received")
    const { username, password, name } = await request.json()
    console.log("[v0] Parsed request data:", { username, name })

    if (!username || !password || !name) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Username, password, and name are required" }, { status: 400 })
    }

    const fakeEmail = `${username}@pencil.internal`
    console.log("[v0] Generated fake email:", fakeEmail)

    // Check if username already exists
    console.log("[v0] Checking for existing username")
    const existingUsers = await sql`
      SELECT id FROM neon_auth.users_sync WHERE name = ${username} AND deleted_at IS NULL
    `
    console.log("[v0] Existing users found:", existingUsers.length)

    if (existingUsers.length > 0) {
      console.log("[v0] Username already taken")
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    // Hash password
    console.log("[v0] Hashing password")
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log("[v0] Creating user in database")
    const users = await sql`
      INSERT INTO neon_auth.users_sync (email, name, raw_json)
      VALUES (${fakeEmail}, ${name}, ${JSON.stringify({ password: hashedPassword, username: username })})
      RETURNING id, email, name
    `
    console.log("[v0] User created:", users[0])

    const user = users[0]

    console.log("[v0] Skipping user preferences creation for now")

    console.log("[v0] Generating JWT token")
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

    console.log("[v0] Signup completed successfully")
    return response
  } catch (error) {
    console.error("[v0] Signup error details:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
