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
    const deployment = await sql`
      SELECT build_logs FROM deployments 
      WHERE id = ${params.id} AND user_id = ${user.id}
    `

    if (deployment.length === 0) {
      return NextResponse.json({ error: "Deployment not found" }, { status: 404 })
    }

    return NextResponse.json({
      logs: deployment[0].build_logs || []
    })

  } catch (error: any) {
    console.error("Error fetching deployment logs:", error)
    return NextResponse.json({
      error: "Failed to fetch deployment logs",
      details: error.message
    }, { status: 500 })
  }
}
