import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Test with a simple API key first
    const apiKey = "s5Mrm8q/+LNSSZSsf1I0sL3bbs3zSiAdPlflRRw3tDOb/5siSOo+/I9O/F7yiWA5M7VARTBR01JynN8CweEM5mpJvwXySRr5n8vdwsZQp14YqZ2lpLC81XmUBS59C2FEH/Y6l+4VKvSee6tHsq0="
    
    console.log("Testing LLM7 API with message:", message)
    console.log("Using API key:", apiKey.substring(0, 20) + "...")

    const response = await fetch("https://api.llm7.io/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "user",
            content: message
          }
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("LLM7 API error:", errorText)
      return NextResponse.json({
        error: "LLM7 API error",
        status: response.status,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    console.log("LLM7 response data:", data)

    return NextResponse.json({
      success: true,
      response: data.choices?.[0]?.message?.content || "No content in response",
      fullResponse: data,
      status: response.status
    })

  } catch (error: any) {
    console.error('LLM7 debug error:', error)
    return NextResponse.json({
      error: 'LLM7 debug failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
