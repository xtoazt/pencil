import { NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(
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

    const { role, content, metadata = {} } = await request.json()

    if (!role || !content) {
      return NextResponse.json({
        error: "Role and content are required"
      }, { status: 400 })
    }

    const sql = getSql()
    
    // Verify conversation belongs to user
    const conversation = await sql`
      SELECT id FROM conversations 
      WHERE id = ${params.id} AND user_id = ${user.id}
    `

    if (conversation.length === 0) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Add message
    const result = await sql`
      INSERT INTO messages (conversation_id, role, content, metadata)
      VALUES (${params.id}, ${role}, ${content}, ${JSON.stringify(metadata)})
      RETURNING *
    `

    // Update conversation timestamp
    await sql`
      UPDATE conversations 
      SET updated_at = NOW() 
      WHERE id = ${params.id}
    `

    return NextResponse.json({
      message: {
        ...result[0],
        created_at: new Date(result[0].created_at),
        metadata: JSON.parse(result[0].metadata)
      }
    })

  } catch (error: any) {
    console.error("Error adding message:", error)
    return NextResponse.json({
      error: "Failed to add message",
      details: error.message
    }, { status: 500 })
  }
}
