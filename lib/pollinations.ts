// Pollinations API Configuration
const POLLINATIONS_API_KEY = "G-fD2v__ugIDlQRC"
const POLLINATIONS_BASE_URL = "https://pollinations.ai/api"

// Available models on Pollinations
export const AVAILABLE_MODELS = {
  "gpt-4": "gpt-4",
  "gpt-3.5-turbo": "gpt-3.5-turbo", 
  "claude-3-opus": "claude-3-opus",
  "claude-3-sonnet": "claude-3-sonnet",
  "claude-3-haiku": "claude-3-haiku",
  "gemini-pro": "gemini-pro",
  "llama-2-70b": "llama-2-70b",
  "mixtral-8x7b": "mixtral-8x7b",
  "flux": "flux", // For image generation
}

// Get available models for UI display
export function getAvailableModels() {
  return Object.keys(AVAILABLE_MODELS).map(key => ({
    id: key,
    name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    provider: getModelProvider(key),
    category: getModelCategory(key),
  }))
}

// Get model provider for display
function getModelProvider(model: string): string {
  if (model.startsWith('gpt')) return 'OpenAI'
  if (model.startsWith('claude')) return 'Anthropic'
  if (model.startsWith('gemini')) return 'Google'
  if (model.startsWith('llama')) return 'Meta'
  if (model.startsWith('mixtral')) return 'Mistral'
  if (model === 'flux') return 'Black Forest Labs'
  return 'Unknown'
}

// Get model category for display
function getModelCategory(model: string): string {
  if (model === 'flux') return 'Image Generation'
  if (model.includes('opus') || model.includes('gpt-4')) return 'Advanced'
  if (model.includes('sonnet') || model.includes('gpt-3.5')) return 'Standard'
  if (model.includes('haiku')) return 'Fast'
  return 'General'
}

export interface PollinationsResponse {
  id: string
  status: "pending" | "completed" | "failed"
  result?: string
  error?: string
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface SuperModeResult {
  type: "code" | "image" | "text"
  content: string
  reasoning: string
  processingSteps: ProcessingStep[]
  modelUsage: ModelUsage[]
  confidence: number
  alternatives?: string[]
}

export interface ProcessingStep {
  step: number
  description: string
  model: string
  duration: number
  status: "completed" | "processing" | "failed"
}

export interface ModelUsage {
  model: string
  purpose: string
  tokens: number
  confidence: number
}

// Standard chat completion using Pollinations
export async function chatCompletion(messages: ChatMessage[], model = "gpt-4") {
  try {
    // Ensure model is available on Pollinations
    const pollinationsModel = AVAILABLE_MODELS[model as keyof typeof AVAILABLE_MODELS] || model
    
    const response = await fetch(`${POLLINATIONS_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${POLLINATIONS_API_KEY}`,
      },
      body: JSON.stringify({
        messages,
        model: pollinationsModel,
        stream: false,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Handle different response formats from Pollinations
    if (data.choices && data.choices[0]) {
      // Standard OpenAI format
      return {
        choices: [{ message: { content: data.choices[0].message.content } }],
        usage: data.usage?.total_tokens || 0,
        model: pollinationsModel,
      }
    } else if (data.response) {
      // Direct response format
      return {
        choices: [{ message: { content: data.response } }],
        usage: data.usage || 0,
        model: pollinationsModel,
      }
    } else {
      throw new Error("Unexpected response format from Pollinations")
    }
  } catch (error) {
    console.error("Chat completion error:", error)
    throw error
  }
}

// Code generation with specialized models
export async function generateCode(prompt: string, language = "javascript") {
  try {
    // Use Claude for code generation as it's often better at coding tasks
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are an expert ${language} developer. Generate clean, well-documented code based on the user's request. Include comments explaining the logic and best practices.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ]

    return await chatCompletion(messages, "claude-3-sonnet")
  } catch (error) {
    console.error("Code generation error:", error)
    // Fallback to GPT-4 if Claude fails
    try {
      return await chatCompletion(messages, "gpt-4")
    } catch (fallbackError) {
      throw fallbackError
    }
  }
}

// Image generation
export async function generateImage(prompt: string, width = 512, height = 512) {
  try {
    const response = await fetch(`${POLLINATIONS_BASE_URL}/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${POLLINATIONS_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        width,
        height,
        model: "flux",
      }),
    })

    if (!response.ok) {
      throw new Error(`Image generation error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Image generation error:", error)
    throw error
  }
}

// Enhanced Super Mode - combines multiple AI models for enhanced responses
export async function superModeCompletion(prompt: string): Promise<SuperModeResult> {
  const startTime = Date.now()
  const processingSteps: ProcessingStep[] = []
  const modelUsage: ModelUsage[] = []

  try {
    // Step 1: Analyze the prompt to determine the best approach
    const analysisStart = Date.now()
    processingSteps.push({
      step: 1,
      description: "Analyzing prompt and determining optimal approach",
      model: "Claude-3-Sonnet",
      duration: 0,
      status: "processing",
    })

    const analysisMessages: ChatMessage[] = [
      {
        role: "system",
        content: `You are an expert AI analyst. Analyze this prompt and determine the best approach.
        
        Respond with a JSON object containing:
        {
          "type": "code|image|text",
          "complexity": "simple|moderate|complex",
          "reasoning": "detailed explanation of your analysis",
          "enhanced_prompt": "improved version optimized for the determined type",
          "suggested_models": ["model1", "model2"],
          "confidence": 0.95
        }`,
      },
      {
        role: "user",
        content: prompt,
      },
    ]

    const analysis = await chatCompletion(analysisMessages, "claude-3-sonnet")
    const analysisDuration = Date.now() - analysisStart

    let analysisResult
    try {
      analysisResult = JSON.parse(analysis.choices[0].message.content)
    } catch {
      analysisResult = {
        type: "text",
        complexity: "moderate",
        reasoning: "Default analysis due to parsing error",
        enhanced_prompt: prompt,
        confidence: 0.7,
      }
    }

    processingSteps[0] = {
      ...processingSteps[0],
      duration: analysisDuration,
      status: "completed",
    }

    modelUsage.push({
      model: "Claude-3-Sonnet",
      purpose: "Prompt Analysis",
      tokens: analysis.usage || 0,
      confidence: analysisResult.confidence || 0.8,
    })

    // Step 2: Generate primary response based on analysis
    const primaryStart = Date.now()
    processingSteps.push({
      step: 2,
      description: `Generating primary ${analysisResult.type} response`,
      model: analysisResult.type === "code" ? "Claude-3-Sonnet" : "GPT-4",
      duration: 0,
      status: "processing",
    })

    let primaryResult: any
    switch (analysisResult.type) {
      case "code":
        primaryResult = await generateCode(analysisResult.enhanced_prompt)
        break
      case "image":
        primaryResult = await generateImage(analysisResult.enhanced_prompt)
        break
      default:
        const primaryMessages: ChatMessage[] = [
          {
            role: "system",
            content: "You are a helpful AI assistant. Provide a comprehensive, detailed response.",
          },
          {
            role: "user",
            content: analysisResult.enhanced_prompt,
          },
        ]
        primaryResult = await chatCompletion(primaryMessages, "gpt-4")
    }

    const primaryDuration = Date.now() - primaryStart
    processingSteps[1] = {
      ...processingSteps[1],
      duration: primaryDuration,
      status: "completed",
    }

    // Step 3: Generate alternative perspective (for text and code)
    let alternativeResult: any = null
    if (analysisResult.type !== "image") {
      const altStart = Date.now()
      processingSteps.push({
        step: 3,
        description: "Generating alternative perspective",
        model: analysisResult.type === "code" ? "GPT-4" : "Claude-3-Sonnet",
        duration: 0,
        status: "processing",
      })

      const altMessages: ChatMessage[] = [
        {
          role: "system",
          content:
            analysisResult.type === "code"
              ? "You are a senior code reviewer. Provide an alternative implementation approach and review the solution for best practices."
              : "You are a critical thinking expert. Provide an alternative perspective and additional insights on this topic.",
        },
        {
          role: "user",
          content:
            analysisResult.type === "code"
              ? `Review and provide an alternative to this code solution for: ${analysisResult.enhanced_prompt}\n\nOriginal solution: ${primaryResult.choices[0].message.content}`
              : `Provide alternative insights for: ${analysisResult.enhanced_prompt}`,
        },
      ]

      alternativeResult = await chatCompletion(altMessages, analysisResult.type === "code" ? "gpt-4" : "claude-3-sonnet")
      const altDuration = Date.now() - altStart

      processingSteps[2] = {
        ...processingSteps[2],
        duration: altDuration,
        status: "completed",
      }

      modelUsage.push({
        model: analysisResult.type === "code" ? "GPT-4" : "Claude-3-Sonnet",
        purpose: "Alternative Perspective",
        tokens: alternativeResult.usage || 0,
        confidence: 0.85,
      })
    }

    // Step 4: Synthesize final response
    const synthStart = Date.now()
    processingSteps.push({
      step: processingSteps.length + 1,
      description: "Synthesizing enhanced final response",
      model: "Claude-3-Sonnet",
      duration: 0,
      status: "processing",
    })

    if (analysisResult.type === "image") {
      const synthDuration = Date.now() - synthStart
      processingSteps[processingSteps.length - 1] = {
        ...processingSteps[processingSteps.length - 1],
        duration: synthDuration,
        status: "completed",
      }

      return {
        type: "image",
        content: `I've created an enhanced image for: "${prompt}"`,
        reasoning: analysisResult.reasoning,
        processingSteps,
        modelUsage,
        confidence: analysisResult.confidence,
      }
    }

    // Synthesize text/code responses
    const synthesisMessages: ChatMessage[] = [
      {
        role: "system",
        content: `You are an expert synthesizer. Combine these AI responses into one comprehensive, well-structured answer that incorporates the best insights from each.
        
        For code responses: Provide the best implementation with explanations.
        For text responses: Create a thorough, well-organized response that addresses all aspects.`,
      },
      {
        role: "user",
        content: `Original prompt: ${prompt}

Analysis: ${analysisResult.reasoning}

Primary response: ${primaryResult.choices[0].message.content}

${alternativeResult ? `Alternative perspective: ${alternativeResult.choices[0].message.content}` : ""}

Please synthesize these into one enhanced response.`,
      },
    ]

    const synthesis = await chatCompletion(synthesisMessages, "claude-3-sonnet")
    const synthDuration = Date.now() - synthStart

    processingSteps[processingSteps.length - 1] = {
      ...processingSteps[processingSteps.length - 1],
      duration: synthDuration,
      status: "completed",
    }

    modelUsage.push({
      model: "Claude-3-Sonnet",
      purpose: "Response Synthesis",
      tokens: synthesis.usage || 0,
      confidence: 0.9,
    })

    // Calculate overall confidence
    const overallConfidence = modelUsage.reduce((acc, usage) => acc + usage.confidence, 0) / modelUsage.length

    return {
      type: analysisResult.type,
      content: synthesis.choices[0].message.content,
      reasoning: analysisResult.reasoning,
      processingSteps,
      modelUsage,
      confidence: overallConfidence,
      alternatives: alternativeResult ? [alternativeResult.choices[0].message.content] : undefined,
    }
  } catch (error) {
    console.error("Super mode error:", error)

    // Mark any processing steps as failed
    processingSteps.forEach((step) => {
      if (step.status === "processing") {
        step.status = "failed"
        step.duration = Date.now() - startTime
      }
    })

    throw error
  }
}
