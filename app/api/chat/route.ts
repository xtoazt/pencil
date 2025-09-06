import { type NextRequest, NextResponse } from "next/server"
import { chatCompletion, generateCode, generateImage, superModeCompletion } from "@/lib/llm7"
import { getSql } from "@/lib/database"
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

    const { messages, mode, language, model, width, height, conversationId, saveToHistory = true } = await request.json()

    if (!messages || !mode) {
      return NextResponse.json({ error: "Messages and mode required" }, { status: 400 })
    }

    // Extract the last user message
    const lastMessage = messages[messages.length - 1]
    const message = lastMessage?.content || ""

    let response: any
    let conversationIdToUse = conversationId

    // Create conversation if it doesn't exist and we want to save
    if (saveToHistory && !conversationIdToUse) {
      const sql = getSql()
      const title = message.length > 50 ? message.substring(0, 50) + "..." : message
      const result = await sql`
        INSERT INTO conversations (user_id, title, mode)
        VALUES (${decoded.userId}, ${title}, ${mode})
        RETURNING id
      `
      conversationIdToUse = result[0].id
    }

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
          response = await generateImageWithFallback(message, width || 512, height || 512)
          if (response && response.url) {
            return NextResponse.json({
              response: response,
              type: "image",
            })
          } else {
            throw new Error("No valid image URL returned")
          }
        } catch (error) {
          console.error("Image generation failed:", error)
          // Fallback to LLM7 image generation
          try {
            response = await generateImage(message, width || 512, height || 512)
            if (response && response.url) {
              return NextResponse.json({
                response: response,
                type: "image",
              })
            }
          } catch (fallbackError) {
            console.error("Fallback image generation failed:", fallbackError)
          }
          
          // Return error if both methods fail
          return NextResponse.json({
            error: "Image generation failed",
            details: error.message
          }, { status: 500 })
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
          conversationId: conversationIdToUse
        })

      default:
        return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
    }

    // Save messages to database if conversation exists
    if (saveToHistory && conversationIdToUse && response) {
      try {
        const sql = getSql()
        
        // Save user message
        await sql`
          INSERT INTO messages (conversation_id, role, content, metadata)
          VALUES (${conversationIdToUse}, 'user', ${message}, ${JSON.stringify({ model, mode })})
        `
        
        // Save assistant response
        let responseContent = ""
        if (response.choices && response.choices[0]) {
          responseContent = response.choices[0].message.content
        } else if (typeof response === 'string') {
          responseContent = response
        } else if (response.content) {
          responseContent = response.content
        } else if (response.response) {
          responseContent = response.response
        } else {
          responseContent = JSON.stringify(response)
        }
        
        await sql`
          INSERT INTO messages (conversation_id, role, content, metadata)
          VALUES (${conversationIdToUse}, 'assistant', ${responseContent}, ${JSON.stringify({ 
            model: response.model || model || 'default', 
            mode, 
            tokens: response.usage?.total_tokens || response.tokens || 0,
            processingTime: response.processingTime || 0
          })})
        `
        
        // Update conversation timestamp
        await sql`
          UPDATE conversations 
          SET updated_at = NOW() 
          WHERE id = ${conversationIdToUse}
        `
      } catch (error) {
        console.error("Error saving messages:", error)
        // Don't fail the request if saving fails
      }
    }

    // Handle standard chat and code responses
    if (response.choices && response.choices[0]) {
      return NextResponse.json({
        response: response.choices[0].message.content,
        type: mode,
        tokens: response.usage?.total_tokens || 0,
        model: response.model || model,
        conversationId: conversationIdToUse
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
