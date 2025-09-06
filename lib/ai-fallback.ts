// AI Fallback System - Multiple AI Providers with Automatic Fallback
import { chatCompletion as llm7Chat } from './llm7'
import { geminiInstantCompletion } from './gemini'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  content: string
  model: string
  provider: string
  processingTime: number
  tokens?: number
  confidence?: number
}

// AI Provider Configuration
const AI_PROVIDERS = [
  {
    name: 'llm7',
    priority: 1,
    enabled: true,
    timeout: 30000,
    retries: 2
  },
  {
    name: 'gemini',
    priority: 2,
    enabled: true,
    timeout: 15000,
    retries: 1
  }
]

// Provider Status Tracking
const providerStatus: { [key: string]: { 
  available: boolean
  lastError?: string
  errorCount: number
  lastSuccess: number
} } = {}

// Initialize provider status
AI_PROVIDERS.forEach(provider => {
  providerStatus[provider.name] = {
    available: true,
    errorCount: 0,
    lastSuccess: Date.now()
  }
})

// Mark provider as failed
function markProviderFailed(providerName: string, error: string) {
  if (providerStatus[providerName]) {
    providerStatus[providerName].available = false
    providerStatus[providerName].lastError = error
    providerStatus[providerName].errorCount++
    
    console.warn(`Provider ${providerName} marked as failed: ${error}`)
    
    // Reset provider after 5 minutes
    setTimeout(() => {
      if (providerStatus[providerName]) {
        providerStatus[providerName].available = true
        providerStatus[providerName].errorCount = 0
        console.log(`Provider ${providerName} reset and available again`)
      }
    }, 5 * 60 * 1000)
  }
}

// Mark provider as successful
function markProviderSuccess(providerName: string) {
  if (providerStatus[providerName]) {
    providerStatus[providerName].available = true
    providerStatus[providerName].lastSuccess = Date.now()
    providerStatus[providerName].errorCount = 0
  }
}

// Get available providers sorted by priority
function getAvailableProviders() {
  return AI_PROVIDERS
    .filter(provider => provider.enabled && providerStatus[provider.name]?.available)
    .sort((a, b) => a.priority - b.priority)
}

// LLM7 Provider
async function callLLM7(messages: ChatMessage[], model: string = "gpt-4.1-nano"): Promise<AIResponse> {
  const startTime = Date.now()
  
  try {
    const response = await llm7Chat(messages, model)
    const processingTime = Date.now() - startTime
    
    if (response.choices && response.choices[0]) {
      markProviderSuccess('llm7')
      return {
        content: response.choices[0].message.content,
        model: response.model || model,
        provider: 'llm7',
        processingTime,
        tokens: response.usage || 0,
        confidence: 0.9
      }
    } else {
      throw new Error('Invalid response format from LLM7')
    }
  } catch (error) {
    markProviderFailed('llm7', error.message)
    throw error
  }
}

// Gemini Provider
async function callGemini(messages: ChatMessage[], model: string = "gemini-pro"): Promise<AIResponse> {
  const startTime = Date.now()
  
  try {
    // Convert messages to Gemini format
    const lastMessage = messages[messages.length - 1]
    const prompt = lastMessage?.content || ""
    
    const response = await geminiInstantCompletion(prompt)
    const processingTime = Date.now() - startTime
    
    markProviderSuccess('gemini')
    return {
      content: response.content,
      model: response.model || model,
      provider: 'gemini',
      processingTime,
      tokens: response.tokens || 0,
      confidence: response.confidence || 0.8
    }
  } catch (error) {
    markProviderFailed('gemini', error.message)
    throw error
  }
}

// Main AI completion function with automatic fallback
export async function aiCompletion(
  messages: ChatMessage[], 
  model: string = "gpt-4.1-nano",
  options: {
    maxRetries?: number
    timeout?: number
    fallbackEnabled?: boolean
  } = {}
): Promise<AIResponse> {
  const { maxRetries = 3, timeout = 30000, fallbackEnabled = true } = options
  
  const availableProviders = getAvailableProviders()
  
  if (availableProviders.length === 0) {
    throw new Error('No AI providers available. Please try again later.')
  }
  
  let lastError: Error | null = null
  
  for (const provider of availableProviders) {
    try {
      console.log(`Attempting to use provider: ${provider.name}`)
      
      let response: AIResponse
      
      switch (provider.name) {
        case 'llm7':
          response = await callLLM7(messages, model)
          break
        case 'gemini':
          response = await callGemini(messages, model)
          break
        default:
          throw new Error(`Unknown provider: ${provider.name}`)
      }
      
      console.log(`Successfully used provider: ${provider.name}`)
      return response
      
    } catch (error) {
      console.error(`Provider ${provider.name} failed:`, error.message)
      lastError = error
      
      // If this is the last provider or fallback is disabled, throw the error
      if (provider === availableProviders[availableProviders.length - 1] || !fallbackEnabled) {
        break
      }
      
      // Continue to next provider
      continue
    }
  }
  
  // If we get here, all providers failed
  throw new Error(`All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`)
}

// Code generation with fallback
export async function generateCodeWithFallback(
  prompt: string, 
  language: string = "javascript"
): Promise<AIResponse> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `You are an expert ${language} developer. Generate clean, well-documented code based on the user's request. Include comments explaining the logic and best practices. Return only the code without explanations.`
    },
    {
      role: "user",
      content: prompt
    }
  ]
  
  // Try coding-specific models first
  const codingModels = ["codestral-2501", "qwen2.5-coder", "gpt-4.1-nano"]
  
  for (const model of codingModels) {
    try {
      return await aiCompletion(messages, model)
    } catch (error) {
      console.warn(`Model ${model} failed for code generation:`, error.message)
      continue
    }
  }
  
  // Fallback to any available model
  return await aiCompletion(messages)
}

// Image generation with fallback
export async function generateImageWithFallback(
  prompt: string,
  width: number = 512,
  height: number = 512
): Promise<{ url: string; model: string; provider: string }> {
  try {
    // Try fal.ai first
    const { generateFalImage } = await import('./fal-ai')
    const falResponse = await generateFalImage(prompt, width, height)
    
    if (falResponse && falResponse.url) {
      return {
        url: falResponse.url,
        model: 'flux-1',
        provider: 'fal.ai'
      }
    }
  } catch (error) {
    console.warn('Fal.ai image generation failed:', error.message)
  }
  
  try {
    // Fallback to LLM7 RTIST
    const { generateImage } = await import('./llm7')
    const llm7Response = await generateImage(prompt, width, height)
    
    if (llm7Response && llm7Response.url) {
      return {
        url: llm7Response.url,
        model: 'rtist',
        provider: 'llm7'
      }
    }
  } catch (error) {
    console.warn('LLM7 image generation failed:', error.message)
  }
  
  throw new Error('All image generation providers failed')
}

// Get provider status for monitoring
export function getProviderStatus() {
  return {
    providers: AI_PROVIDERS.map(provider => ({
      name: provider.name,
      priority: provider.priority,
      enabled: provider.enabled,
      status: providerStatus[provider.name] || { available: false, errorCount: 0, lastSuccess: 0 }
    })),
    availableCount: getAvailableProviders().length,
    totalCount: AI_PROVIDERS.length
  }
}

// Health check for all providers
export async function healthCheck(): Promise<{ [key: string]: boolean }> {
  const results: { [key: string]: boolean } = {}
  
  for (const provider of AI_PROVIDERS) {
    try {
      const testMessages: ChatMessage[] = [
        { role: 'user', content: 'Hello, this is a health check. Please respond with "OK".' }
      ]
      
      await aiCompletion(testMessages, undefined, { fallbackEnabled: false })
      results[provider.name] = true
    } catch (error) {
      results[provider.name] = false
    }
  }
  
  return results
}
