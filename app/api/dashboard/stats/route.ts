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

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const userId = decoded.userId

    const sql = getSql()
    
    // Get conversation stats
    const conversationStats = await sql`
      SELECT COUNT(*) as total_chats
      FROM conversations 
      WHERE user_id = ${userId}
    `

    // Get project stats
    const projectStats = await sql`
      SELECT COUNT(*) as total_projects
      FROM projects 
      WHERE user_id = ${userId}
    `

    // Get super mode usage (conversations with mode = 'super')
    const superModeStats = await sql`
      SELECT COUNT(*) as super_mode_usage
      FROM conversations 
      WHERE user_id = ${userId} AND mode = 'super'
    `

    // Get recent activity (last 10 conversations)
    const recentActivity = await sql`
      SELECT title, mode, created_at
      FROM conversations 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Mock token usage for now (in a real app, you'd track this)
    const tokensUsed = Math.floor(Math.random() * 50000) + 10000

    const stats = {
      totalChats: Number(conversationStats[0]?.total_chats || 0),
      totalProjects: Number(projectStats[0]?.total_projects || 0),
      superModeUsage: Number(superModeStats[0]?.super_mode_usage || 0),
      tokensUsed,
    }

    const formattedActivity = recentActivity.map((activity) => ({
      title: activity.title,
      description: `${activity.mode.charAt(0).toUpperCase() + activity.mode.slice(1)} conversation`,
      time: new Date(activity.created_at).toLocaleDateString(),
    }))

    return NextResponse.json({
      stats,
      recentActivity: formattedActivity,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
