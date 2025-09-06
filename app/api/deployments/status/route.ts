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
    
    // Get deployment statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'deployed' THEN 1 END) as deployed,
        COUNT(CASE WHEN status = 'building' THEN 1 END) as building,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
        COUNT(CASE WHEN status = 'stopped' THEN 1 END) as stopped
      FROM deployments 
      WHERE user_id = ${user.id}
    `

    // Get recent deployments
    const recentDeployments = await sql`
      SELECT id, name, status, subdomain, url, updated_at
      FROM deployments 
      WHERE user_id = ${user.id}
      ORDER BY updated_at DESC
      LIMIT 5
    `

    return NextResponse.json({
      stats: stats[0],
      recentDeployments: recentDeployments.map(deployment => ({
        ...deployment,
        updated_at: new Date(deployment.updated_at)
      })),
      remainingSlots: 3 - (stats[0].deployed + stats[0].building)
    })

  } catch (error: any) {
    console.error("Error fetching deployment status:", error)
    return NextResponse.json({
      error: "Failed to fetch deployment status",
      details: error.message
    }, { status: 500 })
  }
}
