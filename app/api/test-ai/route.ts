import { NextRequest, NextResponse } from 'next/server'
import { aiCompletion } from '@/lib/ai-fallback'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const messages = [
      {
        role: 'user' as const,
        content: message
      }
    ]

    const response = await aiCompletion(messages, 'gpt-4.1-nano')
    
    return NextResponse.json({
      success: true,
      response: response.content,
      model: response.model,
      provider: response.provider,
      processingTime: response.processingTime
    })
  } catch (error: any) {
    console.error('AI test error:', error)
    return NextResponse.json({
      error: 'AI test failed',
      details: error.message
    }, { status: 500 })
  }
}
