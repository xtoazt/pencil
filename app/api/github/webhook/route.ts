import { NextRequest, NextResponse } from 'next/server'
import { GitHubWebhookHandler } from '@/lib/github'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-hub-signature-256')
    const event = request.headers.get('x-github-event')
    
    if (!signature || !event) {
      return NextResponse.json(
        { error: 'Missing signature or event' },
        { status: 400 }
      )
    }

    const payload = await request.text()
    
    // Verify webhook signature
    if (!GitHubWebhookHandler.verifySignature(payload, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const data = JSON.parse(payload)
    await GitHubWebhookHandler.handleWebhook(data, event)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('GitHub webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
