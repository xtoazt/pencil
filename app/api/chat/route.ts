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

    const { message, mode, language, history } = await request.json()

    if (!message || !mode) {
      return NextResponse.json({ error: "Message and mode required" }, { status: 400 })
    }

    let response: any

    switch (mode) {
      case "chat":
        // Standard chat mode
        const chatMessages = [
          {
            role: "system" as const,
            content: "You are a helpful AI assistant. Provide clear, accurate, and helpful responses.",
          },
          ...history.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: "user" as const,
            content: message,
          },
        ]
        response = await chatCompletion(chatMessages)
        break

      case "code":
        // Code generation mode with language specification
        const codePrompt = language ? `Generate ${language} code for: ${message}` : message
        response = await generateCode(codePrompt, language)
        break

      case "image":
        // Image generation mode
        response = await generateImage(message)
        if (response.url) {
          return NextResponse.json({
            content: `I've created an image for you: "${message}"`,
            imageUrl: response.url,
            type: "image",
          })
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
        content: response.choices[0].message.content,
        type: mode,
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
