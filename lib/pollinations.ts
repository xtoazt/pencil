const POLLINATIONS_API_KEY = "G-fD2v__ugIDlQRC"
const POLLINATIONS_BASE_URL = "https://pollinations.ai/api"

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

// Standard chat completion
export async function chatCompletion(messages: ChatMessage[], model = "gpt-4") {
  try {
    const response = await fetch(`${POLLINATIONS_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${POLLINATIONS_API_KEY}`,
      },
      body: JSON.stringify({
        messages,
        model,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.statusText}`)
    }

    const data = await response.json()
    data.usage = response.headers.get("X-Usage-Tokens")
      ? Number.parseInt(response.headers.get("X-Usage-Tokens") || "0")
      : 0
    return data
  } catch (error) {
    console.error("Chat completion error:", error)
    throw error
  }
}

// Code generation
export async function generateCode(prompt: string, language = "javascript") {
  try {
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are an expert ${language} developer. Generate clean, well-documented code based on the user's request.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ]

    return await chatCompletion(messages, "gpt-4")
  } catch (error) {
    console.error("Code generation error:", error)
    throw error
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
      model: "GPT-4",
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

    const analysis = await chatCompletion(analysisMessages, "gpt-4")
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
      model: "GPT-4",
      purpose: "Prompt Analysis",
      tokens: analysis.usage || 0,
      confidence: analysisResult.confidence || 0.8,
    })

    // Step 2: Generate primary response based on analysis
    const primaryStart = Date.now()
    processingSteps.push({
      step: 2,
      description: `Generating primary ${analysisResult.type} response`,
      model: "GPT-4",
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
        model: "GPT-4",
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

      alternativeResult = await chatCompletion(altMessages, "gpt-4")
      const altDuration = Date.now() - altStart

      processingSteps[2] = {
        ...processingSteps[2],
        duration: altDuration,
        status: "completed",
      }

      modelUsage.push({
        model: "GPT-4",
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
      model: "GPT-4",
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

    const synthesis = await chatCompletion(synthesisMessages, "gpt-4")
    const synthDuration = Date.now() - synthStart

    processingSteps[processingSteps.length - 1] = {
      ...processingSteps[processingSteps.length - 1],
      duration: synthDuration,
      status: "completed",
    }

    modelUsage.push({
      model: "GPT-4",
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
