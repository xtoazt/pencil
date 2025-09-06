import { NextRequest, NextResponse } from 'next/server'
import { localAI, LocalAIMessage } from '@/lib/localai'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { messages, model, type = 'chat', options = {} } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Check if LocalAI is available
    const isAvailable = await localAI.isAvailable()
    if (!isAvailable) {
      return NextResponse.json(
        { 
          error: 'LocalAI service is not available',
          details: 'Please ensure LocalAI is running on your local machine or update the LOCALAI_BASE_URL environment variable'
        },
        { status: 503 }
      )
    }

    let response: any

    switch (type) {
      case 'chat':
        response = await localAI.chatCompletion(messages as LocalAIMessage[], model, options)
        break

      case 'image':
        const { prompt, size = '1024x1024' } = options
        if (!prompt) {
          return NextResponse.json(
            { error: 'Prompt is required for image generation' },
            { status: 400 }
          )
        }
        response = await localAI.generateImage(prompt, { size })
        break

      case 'audio':
        const { text, voice = 'alloy' } = options
        if (!text) {
          return NextResponse.json(
            { error: 'Text is required for audio generation' },
            { status: 400 }
          )
        }
        const audioBuffer = await localAI.generateAudio(text, { voice })
        return NextResponse.json({
          audio: Buffer.from(audioBuffer).toString('base64'),
          format: 'mp3'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid type. Supported types: chat, image, audio' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: response,
      provider: 'localai',
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('LocalAI API error:', error)
    return NextResponse.json(
      { 
        error: 'LocalAI request failed',
        details: error.message,
        provider: 'localai'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'models':
        const models = await localAI.getModels()
        return NextResponse.json({
          success: true,
          models,
          count: models.length
        })

      case 'health':
        const health = await localAI.healthCheck()
        return NextResponse.json({
          success: true,
          health
        })

      case 'status':
        const isAvailable = await localAI.isAvailable()
        return NextResponse.json({
          success: true,
          available: isAvailable,
          timestamp: Date.now()
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: models, health, status' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('LocalAI GET error:', error)
    return NextResponse.json(
      { 
        error: 'LocalAI request failed',
        details: error.message
      },
      { status: 500 }
    )
  }
}
