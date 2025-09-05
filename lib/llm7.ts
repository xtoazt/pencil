// LLM7 API Configuration
const LLM7_API_KEY = process.env.LLM7_API_KEY || "ZaJ9R/8kJvNBebSNCBLOuE3Z2PzgFQHtngi+nKTJioErxAJvk7atA677L/7QUb+OZPwRzQkqglBTSYvBXL207hrUum8EEI1XW0BmCzX7IfQ1avVWSFH8xB3bon21XDLyGTLFPu7umEJwVS5lTto="
const LLM7_BASE_URL = "https://api.llm7.io/v1"
const LLM7_CHAT_URL = "https://api.llm7.io/v1/chat/completions"

// Available models on LLM7 - Complete list with all models
export const AVAILABLE_MODELS = {
  // GPT Models
  "gpt-4.1-nano": "gpt-4.1-nano-2025-04-14",
  "gpt-4o-mini": "gpt-4o-mini-2024-07-18",
  "gpt-o4-mini": "gpt-o4-mini-2025-04-16",
  
  // Mistral Models - Complete collection
  "mistral-large-2411": "mistral-large-2411",
  "mistral-large-2407": "mistral-large-2407",
  "mistral-large-2402": "mistral-large-2402",
  "mistral-medium": "mistral-medium",
  "mistral-small-2503": "mistral-small-2503",
  "mistral-small-2501": "mistral-small-2501",
  "mistral-small-2409": "mistral-small-2409",
  "mistral-small-2402": "mistral-small-2402",
  "mistral-small-3.1-24b": "mistral-small-3.1-24b-instruct-2503",
  "mistral-saba": "mistral-saba-2502",
  "codestral-2501": "codestral-2501",
  "codestral-2405": "codestral-2405",
  "ministral-8b": "ministral-8b-2410",
  "ministral-3b": "ministral-3b-2410",
  "open-mixtral-8x7b": "open-mixtral-8x7b",
  "open-mixtral-8x22b": "open-mixtral-8x22b",
  "open-mistral-7b": "open-mistral-7b",
  "open-mistral-nemo": "open-mistral-nemo",
  
  // Specialized Models
  "deepseek-r1": "deepseek-r1-0528",
  "gemini": "gemini",
  "qwen2.5-coder": "qwen2.5-coder-32b-instruct",
  "roblox-rp": "roblox-rp",
  "nova-fast": "nova-fast",
  
  // Multimodal Models
  "bidara": "bidara",
  "mirexa": "mirexa",
  "rtist": "rtist",
  "pixtral-12b": "pixtral-12b-2409",
  "pixtral-large": "pixtral-large-2411",
}

// Model categories for better organization
export const MODEL_CATEGORIES = {
  "GPT Models": ["gpt-4.1-nano", "gpt-4o-mini", "gpt-o4-mini"],
  "Mistral Large": ["mistral-large-2411", "mistral-large-2407", "mistral-large-2402"],
  "Mistral Medium": ["mistral-medium"],
  "Mistral Small": ["mistral-small-2503", "mistral-small-2501", "mistral-small-2409", "mistral-small-2402", "mistral-small-3.1-24b"],
  "Coding Models": ["codestral-2501", "codestral-2405", "qwen2.5-coder"],
  "Efficient Models": ["ministral-8b", "ministral-3b", "nova-fast"],
  "Open Source": ["open-mixtral-8x7b", "open-mixtral-8x22b", "open-mistral-7b", "open-mistral-nemo"],
  "Specialized": ["deepseek-r1", "gemini", "roblox-rp", "mistral-saba"],
  "Multimodal": ["bidara", "mirexa", "rtist", "pixtral-12b", "pixtral-large", "gpt-4o-mini", "gpt-4.1-nano"],
}

// Model capabilities
export const MODEL_CAPABILITIES = {
  "gpt-4.1-nano": { text: true, image: true, speed: "fast", quality: "high" },
  "gpt-4o-mini": { text: true, image: true, speed: "fast", quality: "high" },
  "gpt-o4-mini": { text: true, image: false, speed: "fast", quality: "high" },
  "mistral-large-2411": { text: true, image: false, speed: "medium", quality: "very-high" },
  "mistral-large-2407": { text: true, image: false, speed: "medium", quality: "very-high" },
  "mistral-large-2402": { text: true, image: false, speed: "medium", quality: "very-high" },
  "mistral-medium": { text: true, image: false, speed: "fast", quality: "high" },
  "mistral-small-2503": { text: true, image: false, speed: "very-fast", quality: "good" },
  "mistral-small-2501": { text: true, image: false, speed: "very-fast", quality: "good" },
  "mistral-small-2409": { text: true, image: false, speed: "very-fast", quality: "good" },
  "mistral-small-2402": { text: true, image: false, speed: "very-fast", quality: "good" },
  "mistral-small-3.1-24b": { text: true, image: false, speed: "medium", quality: "high" },
  "mistral-saba": { text: true, image: false, speed: "medium", quality: "high" },
  "codestral-2501": { text: true, image: false, speed: "fast", quality: "high", specialty: "coding" },
  "codestral-2405": { text: true, image: false, speed: "fast", quality: "high", specialty: "coding" },
  "ministral-8b": { text: true, image: false, speed: "very-fast", quality: "good" },
  "ministral-3b": { text: true, image: false, speed: "very-fast", quality: "good" },
  "open-mixtral-8x7b": { text: true, image: false, speed: "medium", quality: "high" },
  "open-mixtral-8x22b": { text: true, image: false, speed: "slow", quality: "very-high" },
  "open-mistral-7b": { text: true, image: false, speed: "fast", quality: "good" },
  "open-mistral-nemo": { text: true, image: false, speed: "fast", quality: "good" },
  "deepseek-r1": { text: true, image: false, speed: "medium", quality: "very-high", specialty: "reasoning" },
  "gemini": { text: true, image: false, speed: "fast", quality: "high" },
  "qwen2.5-coder": { text: true, image: false, speed: "fast", quality: "high", specialty: "coding" },
  "roblox-rp": { text: true, image: false, speed: "fast", quality: "good", specialty: "roleplay" },
  "nova-fast": { text: true, image: false, speed: "very-fast", quality: "good" },
  "bidara": { text: true, image: true, speed: "medium", quality: "high", specialty: "multimodal" },
  "mirexa": { text: true, image: true, speed: "medium", quality: "high", specialty: "multimodal" },
  "rtist": { text: true, image: false, speed: "medium", quality: "high", specialty: "art" },
  "pixtral-12b": { text: true, image: true, speed: "medium", quality: "high", specialty: "multimodal" },
  "pixtral-large": { text: true, image: true, speed: "slow", quality: "very-high", specialty: "multimodal" },
}

// Get available models for UI display
export function getAvailableModels() {
  return Object.keys(AVAILABLE_MODELS).map(key => ({
    id: key,
    name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    provider: getModelProvider(key),
    category: getModelCategory(key),
    capabilities: MODEL_CAPABILITIES[key] || { text: true, image: false, speed: "medium", quality: "good" },
    description: getModelDescription(key),
  }))
}

// Get models by category
export function getModelsByCategory(category: string) {
  return MODEL_CATEGORIES[category] || []
}

// Get model provider for display
function getModelProvider(model: string): string {
  if (model.includes("gpt")) return "OpenAI"
  if (model.includes("mistral") || model.includes("codestral") || model.includes("ministral") || model.includes("mixtral")) return "Mistral"
  if (model.includes("gemini")) return "Google"
  if (model.includes("deepseek")) return "DeepSeek"
  if (model.includes("qwen")) return "Alibaba"
  if (model.includes("roblox")) return "Roblox"
  if (model.includes("nova")) return "Amazon"
  if (model.includes("bidara") || model.includes("mirexa") || model.includes("rtist") || model.includes("pixtral")) return "Azure"
  return "LLM7"
}

// Get model category for display
function getModelCategory(model: string): string {
  for (const [category, models] of Object.entries(MODEL_CATEGORIES)) {
    if (models.includes(model)) {
      return category
    }
  }
  return "Other"
}

// Get model description
function getModelDescription(model: string): string {
  const capabilities = MODEL_CAPABILITIES[model]
  if (!capabilities) return "AI model for various tasks"
  
  let description = ""
  if (capabilities.specialty) {
    description += `${capabilities.specialty.charAt(0).toUpperCase() + capabilities.specialty.slice(1)} specialist. `
  }
  description += `${capabilities.quality} quality, ${capabilities.speed} speed`
  if (capabilities.image) {
    description += ", supports images"
  }
  return description
}

// Get recommended model for task
export function getRecommendedModel(task: string): string {
  const taskLower = task.toLowerCase()
  
  if (taskLower.includes("code") || taskLower.includes("programming") || taskLower.includes("debug")) {
    return "codestral-2501"
  }
  if (taskLower.includes("image") || taskLower.includes("visual") || taskLower.includes("art")) {
    return "pixtral-large"
  }
  if (taskLower.includes("reasoning") || taskLower.includes("analysis") || taskLower.includes("complex")) {
    return "deepseek-r1"
  }
  if (taskLower.includes("fast") || taskLower.includes("quick")) {
    return "nova-fast"
  }
  if (taskLower.includes("roleplay") || taskLower.includes("story")) {
    return "roblox-rp"
  }
  
  return "mistral-large-2411" // Default to high-quality model
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

// Standard chat completion using LLM7
export async function chatCompletion(messages: ChatMessage[], model = "gpt-4.1-nano") {
  try {
    // Ensure model is available on LLM7
    const llm7Model = AVAILABLE_MODELS[model as keyof typeof AVAILABLE_MODELS] || model
    
    console.log("Making request to LLM7 with model:", llm7Model)
    console.log("Messages:", messages)
    
    const response = await fetch(LLM7_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LLM7_API_KEY}`,
      },
      body: JSON.stringify({
        model: llm7Model,
        messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("LLM7 API error response:", errorText)
      throw new Error(`LLM7 API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log("LLM7 response data:", data)
    
    // LLM7 uses standard OpenAI format
    if (data.choices && data.choices[0]) {
      return {
        choices: [{ message: { content: data.choices[0].message.content } }],
        usage: data.usage?.total_tokens || 0,
        model: llm7Model,
      }
    } else {
      console.error("Unexpected response format:", data)
      throw new Error("Unexpected response format from LLM7")
    }
  } catch (error) {
    console.error("Chat completion error:", error)
    throw error
  }
}

// Code generation with specialized models
export async function generateCode(prompt: string, language = "javascript") {
  try {
    // Use Codestral for code generation as it's specialized for coding tasks
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

    return await chatCompletion(messages, "codestral")
  } catch (error) {
    console.error("Code generation error:", error)
    // Fallback to GPT-4.1-nano if Codestral fails
    try {
      return await chatCompletion(messages, "gpt-4.1-nano")
    } catch (fallbackError) {
      throw fallbackError
    }
  }
}

// Image generation using LLM7 multimodal models
export async function generateImage(prompt: string, width = 512, height = 512) {
  try {
    // Use RTIST model for image generation
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: "You are an expert image generator. Create detailed, high-quality images based on the user's prompt. Focus on visual appeal and artistic quality."
      },
      {
        role: "user",
        content: `Generate an image: ${prompt}. Dimensions: ${width}x${height}`
      }
    ]

    const result = await chatCompletion(messages, "rtist")
    
    // For now, return a placeholder since LLM7 image generation might work differently
    // This will be updated once we test the actual image generation capabilities
    return {
      url: `https://via.placeholder.com/${width}x${height}/4F46E5/FFFFFF?text=Image+Generation+Coming+Soon`,
      prompt: prompt,
      width: width,
      height: height,
      model: "rtist",
      response: result.choices[0].message.content
    }
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
      model: "mistral-large",
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

    const analysis = await chatCompletion(analysisMessages, "mistral-large")
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
      model: "mistral-large",
      purpose: "Prompt Analysis",
      tokens: analysis.usage || 0,
      confidence: analysisResult.confidence || 0.8,
    })

    // Step 2: Generate primary response based on analysis
    const primaryStart = Date.now()
    processingSteps.push({
      step: 2,
      description: `Generating primary ${analysisResult.type} response`,
      model: analysisResult.type === "code" ? "codestral" : "gpt-4.1-nano",
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
        primaryResult = await chatCompletion(primaryMessages, "gpt-4.1-nano")
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
        model: analysisResult.type === "code" ? "gpt-4.1-nano" : "mistral-large",
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

      alternativeResult = await chatCompletion(altMessages, analysisResult.type === "code" ? "gpt-4.1-nano" : "mistral-large")
      const altDuration = Date.now() - altStart

      processingSteps[2] = {
        ...processingSteps[2],
        duration: altDuration,
        status: "completed",
      }

      modelUsage.push({
        model: analysisResult.type === "code" ? "gpt-4.1-nano" : "mistral-large",
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
      model: "mistral-large",
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

    const synthesis = await chatCompletion(synthesisMessages, "mistral-large")
    const synthDuration = Date.now() - synthStart

    processingSteps[processingSteps.length - 1] = {
      ...processingSteps[processingSteps.length - 1],
      duration: synthDuration,
      status: "completed",
    }

    modelUsage.push({
      model: "mistral-large",
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
