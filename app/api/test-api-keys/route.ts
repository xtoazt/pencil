import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const apiKeys = [
      "ZaJ9R/8kJvNBebSNCBLOuE3Z2PzgFQHtngi+nKTJioErxAJvk7atA677L/7QUb+OZPwRzQkqglBTSYvBXL207hrUum8EEI1XW0BmCzX7IfQ1avVWSFH8xB3bon21XDLyGTLFPu7umEJwVS5lTto=",
      "MW2gDrKdBNwifnictuPXAswvJPKYNDM5b9ZoOoz8OmJkdzUeChHNGc14fTxr65/pEvcufXyTttSpbtWJR76594mWJ3HySiM8FHgTe6MxX2cIJ7J1IT5Tzf+3g+hQ",
      "+q5EuaM7myjUFYpKesilJVm2guShRURPFzvSEnuYMcDYVaZh8TPQhK20Q0q0Bb1/01qiQ04XVpm4S629SLYJ+rEa/opR8FNiENG5NSu8ZPOcACMGfQv+s3bOcG8f",
      "s5Mrm8q/+LNSSZSsf1I0sL3bbs3zSiAdPlflRRw3tDOb/5siSOo+/I9O/F7yiWA5M7VARTBR01JynN8CweEM5mpJvwXySRr5n8vdwsZQp14YqZ2lpLC81XmUBS59C2FEH/Y6l+4VKvSee6tHsq0="
    ]

    const results = []

    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i]
      const keyId = i + 1
      
      try {
        console.log(`Testing API key ${keyId}...`)
        
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
                content: "Hello, respond with 'API key working'"
              }
            ],
            stream: false,
            temperature: 0.7,
            max_tokens: 50,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          results.push({
            keyId,
            status: "working",
            response: data.choices?.[0]?.message?.content || "No content",
            statusCode: response.status
          })
        } else {
          const errorText = await response.text()
          results.push({
            keyId,
            status: "error",
            error: errorText,
            statusCode: response.status
          })
        }
      } catch (error: any) {
        results.push({
          keyId,
          status: "error",
          error: error.message,
          statusCode: "network_error"
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      totalKeys: apiKeys.length,
      workingKeys: results.filter(r => r.status === "working").length
    })

  } catch (error: any) {
    console.error('API key test error:', error)
    return NextResponse.json({
      error: 'API key test failed',
      details: error.message
    }, { status: 500 })
  }
}
