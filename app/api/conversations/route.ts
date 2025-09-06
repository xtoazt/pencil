import { NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const sql = getSql()
    const conversations = await sql`
      SELECT id, title, mode, created_at, updated_at
      FROM conversations 
      WHERE user_id = ${user.id}
      ORDER BY updated_at DESC
    `

    return NextResponse.json({
      conversations: conversations.map(conv => ({
        ...conv,
        created_at: new Date(conv.created_at),
        updated_at: new Date(conv.updated_at)
      }))
    })

  } catch (error: any) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({
      error: "Failed to fetch conversations",
      details: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { title, mode = "chat" } = await request.json()

    if (!title) {
      return NextResponse.json({
        error: "Title is required"
      }, { status: 400 })
    }

    const sql = getSql()
    const result = await sql`
      INSERT INTO conversations (user_id, title, mode)
      VALUES (${user.id}, ${title}, ${mode})
      RETURNING *
    `

    return NextResponse.json({
      conversation: {
        ...result[0],
        created_at: new Date(result[0].created_at),
        updated_at: new Date(result[0].updated_at)
      }
    })

  } catch (error: any) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({
      error: "Failed to create conversation",
      details: error.message
    }, { status: 500 })
  }
}
