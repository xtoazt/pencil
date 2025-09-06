import { NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Get conversation
    const conversation = await sql`
      SELECT * FROM conversations 
      WHERE id = ${params.id} AND user_id = ${user.id}
    `

    if (conversation.length === 0) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Get messages
    const messages = await sql`
      SELECT * FROM messages 
      WHERE conversation_id = ${params.id}
      ORDER BY created_at ASC
    `

    return NextResponse.json({
      conversation: {
        ...conversation[0],
        created_at: new Date(conversation[0].created_at),
        updated_at: new Date(conversation[0].updated_at)
      },
      messages: messages.map(msg => ({
        ...msg,
        created_at: new Date(msg.created_at),
        metadata: msg.metadata ? JSON.parse(msg.metadata) : {}
      }))
    })

  } catch (error: any) {
    console.error("Error fetching conversation:", error)
    return NextResponse.json({
      error: "Failed to fetch conversation",
      details: error.message
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { title } = await request.json()

    const sql = getSql()
    const result = await sql`
      UPDATE conversations 
      SET title = ${title}, updated_at = NOW()
      WHERE id = ${params.id} AND user_id = ${user.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    return NextResponse.json({
      conversation: {
        ...result[0],
        created_at: new Date(result[0].created_at),
        updated_at: new Date(result[0].updated_at)
      }
    })

  } catch (error: any) {
    console.error("Error updating conversation:", error)
    return NextResponse.json({
      error: "Failed to update conversation",
      details: error.message
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    await sql`
      DELETE FROM conversations 
      WHERE id = ${params.id} AND user_id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully"
    })

  } catch (error: any) {
    console.error("Error deleting conversation:", error)
    return NextResponse.json({
      error: "Failed to delete conversation",
      details: error.message
    }, { status: 500 })
  }
}
