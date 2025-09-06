import { NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Deployment {
  id: string
  userId: string
  name: string
  description: string
  framework: string
  modelType: string
  status: 'building' | 'deployed' | 'failed' | 'stopped'
  subdomain: string
  url: string
  createdAt: Date
  updatedAt: Date
  buildLogs: string[]
  deploymentConfig: {
    environment: string
    buildCommand: string
    startCommand: string
    port: number
  }
}

const MAX_DEPLOYMENTS_PER_USER = 3

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
    const deployments = await sql`
      SELECT * FROM deployments 
      WHERE user_id = ${user.id} 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      deployments: deployments.map(deployment => ({
        ...deployment,
        created_at: new Date(deployment.created_at),
        updated_at: new Date(deployment.updated_at)
      }))
    })

  } catch (error: any) {
    console.error("Error fetching deployments:", error)
    return NextResponse.json({
      error: "Failed to fetch deployments",
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

    const sql = getSql()
    
    // Check deployment limit
    const existingDeployments = await sql`
      SELECT COUNT(*) as count FROM deployments 
      WHERE user_id = ${user.id} AND status != 'stopped'
    `
    
    if (existingDeployments[0].count >= MAX_DEPLOYMENTS_PER_USER) {
      return NextResponse.json({
        error: `Maximum deployment limit reached (${MAX_DEPLOYMENTS_PER_USER})`,
        limit: MAX_DEPLOYMENTS_PER_USER
      }, { status: 400 })
    }

    const {
      name,
      description,
      framework,
      modelType,
      deploymentConfig
    } = await request.json()

    if (!name || !framework || !modelType) {
      return NextResponse.json({
        error: "Name, framework, and model type are required"
      }, { status: 400 })
    }

    // Generate unique subdomain
    const baseSubdomain = name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    let subdomain = baseSubdomain
    let counter = 1

    while (true) {
      const existing = await sql`
        SELECT id FROM deployments WHERE subdomain = ${subdomain}
      `
      if (existing.length === 0) break
      subdomain = `${baseSubdomain}-${counter}`
      counter++
    }

    const deploymentId = `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const url = `https://pencilx.vercel.app/${subdomain}`

    const newDeployment = {
      id: deploymentId,
      user_id: user.id,
      name,
      description: description || '',
      framework,
      model_type: modelType,
      status: 'building',
      subdomain,
      url,
      deployment_config: deploymentConfig || {
        environment: 'production',
        buildCommand: 'npm run build',
        startCommand: 'npm start',
        port: 3000
      },
      build_logs: [],
      created_at: new Date(),
      updated_at: new Date()
    }

    await sql`
      INSERT INTO deployments (
        id, user_id, name, description, framework, model_type, 
        status, subdomain, url, deployment_config, build_logs, 
        created_at, updated_at
      ) VALUES (
        ${newDeployment.id}, ${newDeployment.user_id}, ${newDeployment.name}, 
        ${newDeployment.description}, ${newDeployment.framework}, ${newDeployment.model_type},
        ${newDeployment.status}, ${newDeployment.subdomain}, ${newDeployment.url},
        ${JSON.stringify(newDeployment.deployment_config)}, ${JSON.stringify(newDeployment.build_logs)},
        ${newDeployment.created_at}, ${newDeployment.updated_at}
      )
    `

    // Start deployment process in background
    startDeploymentProcess(newDeployment)

    return NextResponse.json({
      success: true,
      deployment: {
        ...newDeployment,
        created_at: newDeployment.created_at,
        updated_at: newDeployment.updated_at
      }
    })

  } catch (error: any) {
    console.error("Error creating deployment:", error)
    return NextResponse.json({
      error: "Failed to create deployment",
      details: error.message
    }, { status: 500 })
  }
}

async function startDeploymentProcess(deployment: any) {
  try {
    const sql = getSql()
    
    // Simulate deployment process
    const steps = [
      "Initializing deployment...",
      "Setting up environment...",
      "Installing dependencies...",
      "Building application...",
      "Deploying to Vercel...",
      "Configuring subdomain...",
      "Deployment completed successfully!"
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay between steps
      
      const logs = steps.slice(0, i + 1)
      const status = i === steps.length - 1 ? 'deployed' : 'building'
      
      await sql`
        UPDATE deployments 
        SET build_logs = ${JSON.stringify(logs)}, 
            status = ${status},
            updated_at = ${new Date()}
        WHERE id = ${deployment.id}
      `
    }

  } catch (error) {
    console.error("Deployment process error:", error)
    
    // Update deployment status to failed
    const sql = getSql()
    await sql`
      UPDATE deployments 
      SET status = 'failed',
          build_logs = ${JSON.stringify([...deployment.build_logs, `Deployment failed: ${error.message}`])},
          updated_at = ${new Date()}
      WHERE id = ${deployment.id}
    `
  }
}
