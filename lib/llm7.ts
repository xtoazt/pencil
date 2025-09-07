// LLM7 API Configuration with Rotation System
const LLM7_API_KEYS = [
  process.env.LLM7_API_KEY || "ZaJ9R/8kJvNBebSNCBLOuE3Z2PzgFQHtngi+nKTJioErxAJvk7atA677L/7QUb+OZPwRzQkqglBTSYvBXL207hrUum8EEI1XW0BmCzX7IfQ1avVWSFH8xB3bon21XDLyGTLFPu7umEJwVS5lTto=",
  "MW2gDrKdBNwifnictuPXAswvJPKYNDM5b9ZoOoz8OmJkdzUeChHNGc14fTxr65/pEvcufXyTttSpbtWJR76594mWJ3HySiM8FHgTe6MxX2cIJ7J1IT5Tzf+3g+hQ",
  "+q5EuaM7myjUFYpKesilJVm2guShRURPFzvSEnuYMcDYVaZh8TPQhK20Q0q0Bb1/01qiQ04XVpm4S629SLYJ+rEa/opR8FNiENG5NSu8ZPOcACMGfQv+s3bOcG8f",
  "s5Mrm8q/+LNSSZSsf1I0sL3bbs3zSiAdPlflRRw3tDOb/5siSOo+/I9O/F7yiWA5M7VARTBR01JynN8CweEM5mpJvwXySRr5n8vdwsZQp14YqZ2lpLC81XmUBS59C2FEH/Y6l+4VKvSee6tHsq0="
]

const LLM7_BASE_URL = "https://api.llm7.io/v1"
const LLM7_CHAT_URL = "https://api.llm7.io/v1/chat/completions"

// API Rotation System
let currentApiKeyIndex = 0
let apiKeyStatus: { [key: string]: { exhausted: boolean; lastUsed: number; errorCount: number } } = {}

// Get current API key with rotation
function getCurrentApiKey(): string {
  return LLM7_API_KEYS[currentApiKeyIndex]
}

// Rotate to next available API key
function rotateApiKey(): string {
  const startIndex = currentApiKeyIndex
  
  do {
    currentApiKeyIndex = (currentApiKeyIndex + 1) % LLM7_API_KEYS.length
    const currentKey = LLM7_API_KEYS[currentApiKeyIndex]
    
    // Check if this key is not exhausted
    if (!apiKeyStatus[currentKey]?.exhausted) {
      return currentKey
    }
  } while (currentApiKeyIndex !== startIndex)
  
  // If all keys are exhausted, reset status and use first key
  console.warn("All API keys exhausted, resetting status")
  apiKeyStatus = {}
  currentApiKeyIndex = 0
  return LLM7_API_KEYS[0]
}

// Mark API key as exhausted
function markApiKeyExhausted(apiKey: string, reason: string) {
  if (!apiKeyStatus[apiKey]) {
    apiKeyStatus[apiKey] = { exhausted: false, lastUsed: 0, errorCount: 0 }
  }
  
  apiKeyStatus[apiKey].exhausted = true
  apiKeyStatus[apiKey].errorCount++
  
  console.warn(`API key exhausted: ${reason}. Rotating to next key.`)
}

// Get API status for monitoring
export function getApiStatus() {
  return {
    currentKeyIndex: currentApiKeyIndex,
    totalKeys: LLM7_API_KEYS.length,
    keyStatus: apiKeyStatus,
    availableKeys: LLM7_API_KEYS.filter((_, index) => !apiKeyStatus[LLM7_API_KEYS[index]]?.exhausted).length
  }
}

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
    capabilities: MODEL_CAPABILITIES[key as keyof typeof MODEL_CAPABILITIES] || { text: true, image: false, speed: "medium", quality: "good" },
    description: getModelDescription(key),
  }))
}

// Get models by category
export function getModelsByCategory(category: string) {
  return MODEL_CATEGORIES[category as keyof typeof MODEL_CATEGORIES] || []
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
  const capabilities = MODEL_CAPABILITIES[model as keyof typeof MODEL_CAPABILITIES]
  if (!capabilities) return "AI model for various tasks"
  
  let description = ""
  if ('specialty' in capabilities && capabilities.specialty) {
    description += `${capabilities.specialty.charAt(0).toUpperCase() + capabilities.specialty.slice(1)} specialist. `
  }
  description += `${capabilities.quality} quality, ${capabilities.speed} speed`
  if (capabilities.image) {
    description += ", supports images"
  }
  return description
}

// Super Mode Power Levels (1-10)
export const SUPER_POWER_LEVELS = {
  1: {
    name: "Lightning Fast",
    description: "Ultra-fast responses with basic models",
    models: ["nova-fast", "ministral-3b", "gpt-o4-mini"],
    speed: "very-fast",
    quality: "good",
    tokens: 500,
    dailyLimit: 10000
  },
  2: {
    name: "Quick",
    description: "Fast responses with efficient models",
    models: ["ministral-8b", "mistral-small-2503", "nova-fast"],
    speed: "fast",
    quality: "good",
    tokens: 750,
    dailyLimit: 10000
  },
  3: {
    name: "Balanced",
    description: "Good balance of speed and quality",
    models: ["mistral-medium", "gpt-4o-mini", "ministral-8b"],
    speed: "fast",
    quality: "high",
    tokens: 1000,
    dailyLimit: 10000
  },
  4: {
    name: "Enhanced",
    description: "Better quality with moderate speed",
    models: ["mistral-large-2402", "gpt-4.1-nano", "mistral-medium"],
    speed: "medium",
    quality: "high",
    tokens: 1250,
    dailyLimit: 10000
  },
  5: {
    name: "Advanced",
    description: "High quality with specialized models",
    models: ["mistral-large-2407", "deepseek-r1", "codestral-2501"],
    speed: "medium",
    quality: "very-high",
    tokens: 1500,
    dailyLimit: 10000
  },
  6: {
    name: "Expert",
    description: "Expert-level analysis and reasoning",
    models: ["mistral-large-2411", "deepseek-r1", "pixtral-large"],
    speed: "medium",
    quality: "very-high",
    tokens: 1750,
    dailyLimit: 10000
  },
  7: {
    name: "Master",
    description: "Master-level intelligence with multimodal",
    models: ["mistral-large-2411", "deepseek-r1", "pixtral-large", "bidara"],
    speed: "slow",
    quality: "excellent",
    tokens: 2000,
    dailyLimit: 10000
  },
  8: {
    name: "Elite",
    description: "Elite performance with advanced reasoning",
    models: ["mistral-large-2411", "deepseek-r1", "pixtral-large", "mirexa"],
    speed: "slow",
    quality: "excellent",
    tokens: 2250,
    dailyLimit: 10000
  },
  9: {
    name: "Ultimate",
    description: "Ultimate intelligence with all capabilities",
    models: ["mistral-large-2411", "deepseek-r1", "pixtral-large", "mirexa", "open-mixtral-8x22b"],
    speed: "very-slow",
    quality: "exceptional",
    tokens: 2500,
    dailyLimit: 10000
  },
  10: {
    name: "Transcendent",
    description: "Transcendent AI with maximum power",
    models: ["mistral-large-2411", "deepseek-r1", "pixtral-large", "mirexa", "open-mixtral-8x22b", "gemini"],
    speed: "very-slow",
    quality: "transcendent",
    tokens: 3000,
    dailyLimit: 10000
  }
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

// Get models for Super Mode power level
export function getSuperModeModels(powerLevel: number): string[] {
  return SUPER_POWER_LEVELS[powerLevel as keyof typeof SUPER_POWER_LEVELS]?.models || SUPER_POWER_LEVELS[5].models
}

// Get Super Mode configuration
export function getSuperModeConfig(powerLevel: number) {
  return SUPER_POWER_LEVELS[powerLevel as keyof typeof SUPER_POWER_LEVELS] || SUPER_POWER_LEVELS[5]
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

// Standard chat completion using LLM7 with API rotation
export async function chatCompletion(messages: ChatMessage[], model = "gpt-4.1-nano") {
  let attempts = 0
  const maxAttempts = LLM7_API_KEYS.length
  
  while (attempts < maxAttempts) {
  try {
    // Ensure model is available on LLM7
    const llm7Model = AVAILABLE_MODELS[model as keyof typeof AVAILABLE_MODELS] || model
      const currentApiKey = getCurrentApiKey()
    
      console.log(`Making request to LLM7 with model: ${llm7Model}, API key: ${currentApiKeyIndex + 1}/${LLM7_API_KEYS.length}`)
    console.log("Messages:", messages)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    const response = await fetch(LLM7_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
          "Authorization": `Bearer ${currentApiKey}`,
      },
      body: JSON.stringify({
        model: llm7Model,
        messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 2000,
      }),
        signal: controller.signal,
    })
      
      clearTimeout(timeoutId)

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("LLM7 API error response:", errorText)
        
        // Check if it's a rate limit or quota exceeded error
        if (response.status === 429 || response.status === 402 || errorText.includes("quota") || errorText.includes("limit")) {
          markApiKeyExhausted(currentApiKey, `HTTP ${response.status}: ${errorText}`)
          attempts++
          continue // Try next API key
        }
        
      throw new Error(`LLM7 API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log("LLM7 response data:", data)
      
      // Update API key usage
      if (!apiKeyStatus[currentApiKey]) {
        apiKeyStatus[currentApiKey] = { exhausted: false, lastUsed: 0, errorCount: 0 }
      }
      apiKeyStatus[currentApiKey].lastUsed = Date.now()
    
    // LLM7 uses standard OpenAI format
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return {
        choices: [{ message: { content: data.choices[0].message.content } }],
        usage: data.usage?.total_tokens || 0,
        model: llm7Model,
      }
    } else if (data.content) {
      // Handle alternative response format
      return {
        choices: [{ message: { content: data.content } }],
        usage: data.usage?.total_tokens || 0,
        model: llm7Model,
      }
    } else {
      console.error("Unexpected response format:", data)
      console.error("Response keys:", Object.keys(data))
      throw new Error(`Unexpected response format from LLM7: ${JSON.stringify(data)}`)
    }
  } catch (error) {
    console.error("Chat completion error:", error)
      
      // If it's a network error or timeout, try next API key
      if ((error as any).name === 'AbortError' || (error as any).message?.includes('fetch')) {
        markApiKeyExhausted(getCurrentApiKey(), (error as any).message)
        attempts++
        continue
      }
      
      // For other errors, throw immediately
    throw error
  }
  }
  
  // If we've exhausted all API keys
  throw new Error("All API keys have been exhausted. Please try again later.")
}

// Code generation with specialized models
export async function generateCode(prompt: string, language = "javascript") {
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

  try {
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

// Image generation using LLM7 multimodal models with fal.ai fallback
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
    
    // Check if the result contains actual image data or just text description
    const responseContent = result.choices[0].message.content
    
    // If RTIST model returns actual image URLs or data, use them
    if (responseContent.includes("http") && (responseContent.includes(".jpg") || responseContent.includes(".png") || responseContent.includes(".jpeg"))) {
      // Extract image URL from response
      const urlMatch = responseContent.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i)
      if (urlMatch) {
    return {
          url: urlMatch[0],
      prompt: prompt,
      width: width,
      height: height,
      model: "rtist",
          response: responseContent
        }
      }
    }
    
    // If no actual image URL found, throw error to trigger fallback
    throw new Error("LLM7 RTIST model did not return a valid image URL")
    
  } catch (error) {
    console.error("LLM7 image generation error:", error)
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
      model: "mistral-large-2411",
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

    const analysis = await chatCompletion(analysisMessages, "mistral-large-2411")
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
      model: "mistral-large-2411",
      purpose: "Prompt Analysis",
      tokens: analysis.usage || 0,
      confidence: analysisResult.confidence || 0.8,
    })

    // Step 2: Generate primary response based on analysis
    const primaryStart = Date.now()
    processingSteps.push({
      step: 2,
      description: `Generating primary ${analysisResult.type} response`,
      model: analysisResult.type === "code" ? "codestral-2501" : "gpt-4.1-nano",
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
      model: analysisResult.type === "code" ? "gpt-4.1-nano" : "mistral-large-2411",
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

      alternativeResult = await chatCompletion(altMessages, analysisResult.type === "code" ? "gpt-4.1-nano" : "mistral-large-2411")
      const altDuration = Date.now() - altStart

      processingSteps[2] = {
        ...processingSteps[2],
        duration: altDuration,
        status: "completed",
      }

      modelUsage.push({
        model: analysisResult.type === "code" ? "gpt-4.1-nano" : "mistral-large-2411",
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
      model: "mistral-large-2411",
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

    const synthesis = await chatCompletion(synthesisMessages, "mistral-large-2411")
    const synthDuration = Date.now() - synthStart

    processingSteps[processingSteps.length - 1] = {
      ...processingSteps[processingSteps.length - 1],
      duration: synthDuration,
      status: "completed",
    }

    modelUsage.push({
      model: "mistral-large-2411",
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
