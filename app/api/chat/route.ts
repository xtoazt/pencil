import { type NextRequest, NextResponse } from "next/server"
import { chatCompletion, generateCode, generateImage, superModeCompletion } from "@/lib/llm7"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let decoded: { userId: string; email: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { messages, mode, language, model, width, height } = await request.json()

    if (!messages || !mode) {
      return NextResponse.json({ error: "Messages and mode required" }, { status: 400 })
    }

    // Extract the last user message
    const lastMessage = messages[messages.length - 1]
    const message = lastMessage?.content || ""

    let response: any

    switch (mode) {
      case "chat":
        // Standard chat mode
        response = await chatCompletion(messages, model)
        break

      case "code":
        // Code generation mode with language specification
        const codePrompt = language ? `Generate ${language} code for: ${message}` : message
        response = await generateCode(codePrompt, language)
        break

      case "image":
        // Image generation mode with fallback
        try {
          const { generateImageWithFallback } = await import("@/lib/fal-ai")
          response = await generateImageWithFallback(message, width, height)
          if (response.url) {
            return NextResponse.json({
              response: response,
              type: "image",
            })
          }
        } catch (error) {
          console.error("Image generation failed:", error)
          // Fallback to original method
          response = await generateImage(message, width, height)
          if (response.url) {
            return NextResponse.json({
              response: response,
              type: "image",
            })
          }
        }
        break

      case "super":
        // Super mode - enhanced multi-AI response with detailed analytics
        const superResult = await superModeCompletion(message)
        return NextResponse.json({
          content: superResult.content,
          type: superResult.type,
          reasoning: superResult.reasoning,
          processingSteps: superResult.processingSteps,
          modelUsage: superResult.modelUsage,
          confidence: superResult.confidence,
          alternatives: superResult.alternatives,
          imageUrl: superResult.type === "image" ? superResult.content : undefined,
        })

      default:
        return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
    }

    // Handle standard chat and code responses
    if (response.choices && response.choices[0]) {
      return NextResponse.json({
        response: response.choices[0].message.content,
        type: mode,
        tokens: response.usage?.total_tokens || 0,
        model: response.model || model
      })
    }

    return NextResponse.json({ error: "No response generated" }, { status: 500 })
  } catch (error) {
    console.error("Chat API error:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json({ 
      error: "AI service temporarily unavailable", 
      details: error.message,
      code: error.code || "UNKNOWN"
    }, { status: 500 })
  }
}
