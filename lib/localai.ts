// LocalAI Integration - Local AI Models with OpenAI API Compatibility
// Based on https://localai.io/

export interface LocalAIConfig {
  baseUrl: string
  apiKey?: string
  timeout: number
  retries: number
}

export interface LocalAIModel {
  id: string
  name: string
  description: string
  type: 'text' | 'image' | 'audio' | 'video'
  size: string
  capabilities: string[]
  status: 'available' | 'loading' | 'error'
}

export interface LocalAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LocalAIResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface LocalAIImageResponse {
  created: number
  data: Array<{
    url: string
    b64_json?: string
  }>
}

// Default LocalAI configuration
const DEFAULT_CONFIG: LocalAIConfig = {
  baseUrl: process.env.LOCALAI_BASE_URL || 'http://localhost:8080',
  apiKey: process.env.LOCALAI_API_KEY || '',
  timeout: 30000,
  retries: 3
}

// LocalAI Client Class
export class LocalAIClient {
  private config: LocalAIConfig
  private availableModels: LocalAIModel[] = []

  constructor(config: Partial<LocalAIConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  // Check if LocalAI is available
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        signal: AbortSignal.timeout(5000)
      })
      return response.ok
    } catch (error) {
      console.warn('LocalAI not available:', error.message)
      return false
    }
  }

  // Get available models
  async getModels(): Promise<LocalAIModel[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        throw new Error(`LocalAI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      this.availableModels = data.data.map((model: any) => ({
        id: model.id,
        name: model.id,
        description: model.description || `Local AI model: ${model.id}`,
        type: this.detectModelType(model.id),
        size: this.estimateModelSize(model.id),
        capabilities: this.getModelCapabilities(model.id),
        status: 'available'
      }))

      return this.availableModels
    } catch (error) {
      console.error('Error fetching LocalAI models:', error)
      return []
    }
  }

  // Chat completion using LocalAI
  async chatCompletion(
    messages: LocalAIMessage[],
    model: string = 'gpt-3.5-turbo',
    options: {
      temperature?: number
      max_tokens?: number
      stream?: boolean
    } = {}
  ): Promise<LocalAIResponse> {
    const { temperature = 0.7, max_tokens = 2000, stream = false } = options

    try {
      const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          stream
        }),
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`LocalAI API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('LocalAI chat completion error:', error)
      throw error
    }
  }

  // Image generation using LocalAI
  async generateImage(
    prompt: string,
    options: {
      model?: string
      size?: string
      n?: number
      quality?: string
    } = {}
  ): Promise<LocalAIImageResponse> {
    const { 
      model = 'dall-e-3', 
      size = '1024x1024', 
      n = 1, 
      quality = 'standard' 
    } = options

    try {
      const response = await fetch(`${this.config.baseUrl}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          model,
          prompt,
          size,
          n,
          quality
        }),
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`LocalAI image generation error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('LocalAI image generation error:', error)
      throw error
    }
  }

  // Audio generation using LocalAI
  async generateAudio(
    prompt: string,
    options: {
      model?: string
      voice?: string
      response_format?: string
    } = {}
  ): Promise<ArrayBuffer> {
    const { 
      model = 'tts-1', 
      voice = 'alloy', 
      response_format = 'mp3' 
    } = options

    try {
      const response = await fetch(`${this.config.baseUrl}/v1/audio/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          model,
          input: prompt,
          voice,
          response_format
        }),
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`LocalAI audio generation error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return await response.arrayBuffer()
    } catch (error) {
      console.error('LocalAI audio generation error:', error)
      throw error
    }
  }

  // Get model information
  getModelInfo(modelId: string): LocalAIModel | undefined {
    return this.availableModels.find(model => model.id === modelId)
  }

  // Detect model type based on model ID
  private detectModelType(modelId: string): 'text' | 'image' | 'audio' | 'video' {
    const id = modelId.toLowerCase()
    
    if (id.includes('dall-e') || id.includes('stable-diffusion') || id.includes('flux')) {
      return 'image'
    }
    if (id.includes('tts') || id.includes('whisper') || id.includes('audio')) {
      return 'audio'
    }
    if (id.includes('video') || id.includes('sora')) {
      return 'video'
    }
    
    return 'text'
  }

  // Estimate model size based on model ID
  private estimateModelSize(modelId: string): string {
    const id = modelId.toLowerCase()
    
    if (id.includes('7b')) return '7B'
    if (id.includes('13b')) return '13B'
    if (id.includes('30b')) return '30B'
    if (id.includes('65b')) return '65B'
    if (id.includes('70b')) return '70B'
    if (id.includes('small')) return 'Small'
    if (id.includes('medium')) return 'Medium'
    if (id.includes('large')) return 'Large'
    
    return 'Unknown'
  }

  // Get model capabilities based on model ID
  private getModelCapabilities(modelId: string): string[] {
    const capabilities: string[] = []
    const id = modelId.toLowerCase()
    
    if (id.includes('gpt') || id.includes('llama') || id.includes('mistral')) {
      capabilities.push('text-generation', 'conversation', 'reasoning')
    }
    if (id.includes('dall-e') || id.includes('stable-diffusion') || id.includes('flux')) {
      capabilities.push('image-generation', 'image-editing')
    }
    if (id.includes('tts')) {
      capabilities.push('text-to-speech', 'voice-synthesis')
    }
    if (id.includes('whisper')) {
      capabilities.push('speech-to-text', 'transcription')
    }
    if (id.includes('code') || id.includes('codestral')) {
      capabilities.push('code-generation', 'code-completion', 'debugging')
    }
    
    return capabilities.length > 0 ? capabilities : ['general-purpose']
  }

  // Health check
  async healthCheck(): Promise<{
    available: boolean
    models: number
    uptime?: number
    version?: string
  }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })

      if (response.ok) {
        const models = await this.getModels()
        return {
          available: true,
          models: models.length
        }
      }
      
      return { available: false, models: 0 }
    } catch (error) {
      return { available: false, models: 0 }
    }
  }
}

// Default LocalAI client instance
export const localAI = new LocalAIClient()

// Convenience functions
export async function localAIChatCompletion(
  messages: LocalAIMessage[],
  model: string = 'gpt-3.5-turbo'
): Promise<LocalAIResponse> {
  return await localAI.chatCompletion(messages, model)
}

export async function localAIGenerateImage(
  prompt: string,
  size: string = '1024x1024'
): Promise<LocalAIImageResponse> {
  return await localAI.generateImage(prompt, { size })
}

export async function localAIGenerateAudio(
  prompt: string,
  voice: string = 'alloy'
): Promise<ArrayBuffer> {
  return await localAI.generateAudio(prompt, { voice })
}

// Model management utilities
export async function getLocalAIModels(): Promise<LocalAIModel[]> {
  return await localAI.getModels()
}

export async function isLocalAIAvailable(): Promise<boolean> {
  return await localAI.isAvailable()
}

export async function getLocalAIHealth(): Promise<{
  available: boolean
  models: number
  uptime?: number
  version?: string
}> {
  return await localAI.healthCheck()
}
