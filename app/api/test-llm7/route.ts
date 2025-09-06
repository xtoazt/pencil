import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/llm7'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const messages = [
      {
        role: 'user',
        content: message
      }
    ]

    const response = await chatCompletion(messages, 'gpt-4.1-nano')
    
    return NextResponse.json({
      success: true,
      response: response.choices[0]?.message?.content || 'No response received',
      model: response.model,
      tokens: response.usage?.total_tokens || 0
    })
  } catch (error: any) {
    console.error('LLM7 test error:', error)
    return NextResponse.json({
      error: 'LLM7 API test failed',
      details: error.message
    }, { status: 500 })
  }
}
