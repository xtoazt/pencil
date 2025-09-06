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
    
    // Get user's training data
    const trainingData = await sql`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(DISTINCT conversation_id) as total_conversations,
        MIN(created_at) as first_message,
        MAX(created_at) as last_message
      FROM messages m
      JOIN conversations c ON m.conversation_id = c.id
      WHERE c.user_id = ${user.id} AND m.role = 'user'
    `

    const stats = trainingData[0] || { total_messages: 0, total_conversations: 0, first_message: null, last_message: null }
    const messageCount = Number(stats.total_messages)
    const isReadyForDeployment = messageCount >= 20

    return NextResponse.json({
      messageCount,
      conversationCount: Number(stats.total_conversations),
      isReadyForDeployment,
      progress: Math.min((messageCount / 20) * 100, 100),
      firstMessage: stats.first_message,
      lastMessage: stats.last_message,
      remainingMessages: Math.max(20 - messageCount, 0)
    })

  } catch (error: any) {
    console.error("Error fetching training data:", error)
    return NextResponse.json({
      error: "Failed to fetch training data",
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

    const { action, modelName, trainingData } = await request.json()

    if (action === 'validate_training') {
      const sql = getSql()
      
      // Check if user has enough training data
      const trainingData = await sql`
        SELECT COUNT(*) as total_messages
        FROM messages m
        JOIN conversations c ON m.conversation_id = c.id
        WHERE c.user_id = ${user.id} AND m.role = 'user'
      `

      const messageCount = Number(trainingData[0]?.total_messages || 0)
      
      if (messageCount < 20) {
        return NextResponse.json({
          valid: false,
          messageCount,
          required: 20,
          remaining: 20 - messageCount
        })
      }

      return NextResponse.json({
        valid: true,
        messageCount,
        required: 20
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })

  } catch (error: any) {
    console.error("Error processing training request:", error)
    return NextResponse.json({
      error: "Failed to process training request",
      details: error.message
    }, { status: 500 })
  }
}
