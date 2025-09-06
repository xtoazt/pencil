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
      SELECT * FROM deployments 
      WHERE id = ${params.id} AND user_id = ${user.id}
    `

    if (deployment.length === 0) {
      return NextResponse.json({ error: "Deployment not found" }, { status: 404 })
    }

    return NextResponse.json({
      deployment: {
        ...deployment[0],
        created_at: new Date(deployment[0].created_at),
        updated_at: new Date(deployment[0].updated_at)
      }
    })

  } catch (error: any) {
    console.error("Error fetching deployment:", error)
    return NextResponse.json({
      error: "Failed to fetch deployment",
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

    const sql = getSql()
    const { name, description, status } = await request.json()

    const deployment = await sql`
      SELECT * FROM deployments 
      WHERE id = ${params.id} AND user_id = ${user.id}
    `

    if (deployment.length === 0) {
      return NextResponse.json({ error: "Deployment not found" }, { status: 404 })
    }

    const updateData: any = { updated_at: new Date() }
    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status) updateData.status = status

    await sql`
      UPDATE deployments 
      SET ${sql(updateData)}
      WHERE id = ${params.id} AND user_id = ${user.id}
    `

    const updatedDeployment = await sql`
      SELECT * FROM deployments 
      WHERE id = ${params.id} AND user_id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      deployment: {
        ...updatedDeployment[0],
        created_at: new Date(updatedDeployment[0].created_at),
        updated_at: new Date(updatedDeployment[0].updated_at)
      }
    })

  } catch (error: any) {
    console.error("Error updating deployment:", error)
    return NextResponse.json({
      error: "Failed to update deployment",
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
    
    const deployment = await sql`
      SELECT * FROM deployments 
      WHERE id = ${params.id} AND user_id = ${user.id}
    `

    if (deployment.length === 0) {
      return NextResponse.json({ error: "Deployment not found" }, { status: 404 })
    }

    // Stop deployment instead of deleting
    await sql`
      UPDATE deployments 
      SET status = 'stopped', updated_at = ${new Date()}
      WHERE id = ${params.id} AND user_id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Deployment stopped successfully"
    })

  } catch (error: any) {
    console.error("Error stopping deployment:", error)
    return NextResponse.json({
      error: "Failed to stop deployment",
      details: error.message
    }, { status: 500 })
  }
}
