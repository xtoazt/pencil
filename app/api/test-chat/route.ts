import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    console.log("Testing chat API with message:", message)

    const response = await fetch(`${request.nextUrl.origin}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: message
          }
        ],
        mode: "chat",
        model: "gpt-4.1-nano",
        saveToHistory: false
      }),
    })

    console.log("Chat API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Chat API error:", errorText)
      return NextResponse.json({
        error: "Chat API error",
        status: response.status,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    console.log("Chat API response data:", data)

    return NextResponse.json({
      success: true,
      response: data.response || data.content || data.message || "No response content",
      fullResponse: data,
      status: response.status
    })

  } catch (error: any) {
    console.error('Chat test error:', error)
    return NextResponse.json({
      error: 'Chat test failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
