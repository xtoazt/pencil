// Gemini API Configuration with Ultra-Fast Rotation System
const GEMINI_API_KEYS = [
  "AIzaSyB-wBKdbcjiXW5ppgAUqVkX9jq9FDkc2BE",
  "AIzaSyDKBcnHqj0X_Y3hYBYFTqJ9lSxbwj3xoh0",
  "AIzaSyBxZQW9vWZijKa-Ro_CGa0QtVLoJNeB0NI",
  "AIzaSyAlW8aX7ZL7g6qnl6b2ZpYWKB0eWGfNsUY",
  "AIzaSyA7E34AEBhmt6_52pRnn4W1_q8GS8pps8A",
  "AIzaSyDwmohY6E4Xy-O425qttWXmqknxQ_i9JVU",
  "AIzaSyD4vXsehTtCwfeYiP_euZeCXx56a0TKV3s",
  "AIzaSyCoa1QC-jkkCwlkL47hzbX9JDboIHdzqSM",
  "AIzaSyBLbmpUVElRNlNSH-XjXWSOH-K3Qqiopco",
  "AIzaSyDCNUwFlG1yFnl7t3fvkVDHLzad7UaAq00",
  "AIzaSyB-JYIiFWjBkZn2ZFEraUGx965i8BLpKgU",
  "AIzaSyAl4nkBjsaci9GBqNyVD1uKcx8HR94Ohmw"
]

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

// API Rotation System for Gemini
let currentGeminiKeyIndex = 0
let geminiKeyStatus: { [key: string]: { exhausted: boolean; lastUsed: number; errorCount: number; responseTime: number } } = {}

// Get current Gemini API key with rotation
function getCurrentGeminiKey(): string {
  return GEMINI_API_KEYS[currentGeminiKeyIndex]
}

// Rotate to next available Gemini API key
function rotateGeminiKey(): string {
  const startIndex = currentGeminiKeyIndex
  
  do {
    currentGeminiKeyIndex = (currentGeminiKeyIndex + 1) % GEMINI_API_KEYS.length
    const currentKey = GEMINI_API_KEYS[currentGeminiKeyIndex]
    
    // Check if this key is not exhausted
    if (!geminiKeyStatus[currentKey]?.exhausted) {
      return currentKey
    }
  } while (currentGeminiKeyIndex !== startIndex)
  
  // If all keys are exhausted, reset status and use first key
  console.warn("All Gemini API keys exhausted, resetting status")
  geminiKeyStatus = {}
  currentGeminiKeyIndex = 0
  return GEMINI_API_KEYS[0]
}

// Mark Gemini API key as exhausted
function markGeminiKeyExhausted(apiKey: string, reason: string) {
  if (!geminiKeyStatus[apiKey]) {
    geminiKeyStatus[apiKey] = { exhausted: false, lastUsed: 0, errorCount: 0, responseTime: 0 }
  }
  
  geminiKeyStatus[apiKey].exhausted = true
  geminiKeyStatus[apiKey].errorCount++
  
  console.warn(`Gemini API key exhausted: ${reason}. Rotating to next key.`)
}

// Get Gemini API status for monitoring
export function getGeminiStatus() {
  return {
    currentKeyIndex: currentGeminiKeyIndex,
    totalKeys: GEMINI_API_KEYS.length,
    keyStatus: geminiKeyStatus,
    availableKeys: GEMINI_API_KEYS.filter((_, index) => !geminiKeyStatus[GEMINI_API_KEYS[index]]?.exhausted).length,
    averageResponseTime: Object.values(geminiKeyStatus).reduce((acc, status) => acc + status.responseTime, 0) / Object.keys(geminiKeyStatus).length || 0
  }
}

// Ultra-fast Gemini completion for Instant Mode with multi-response analysis
export async function geminiInstantCompletion(content: string): Promise<{
  content: string
  model: string
  processingTime: number
  apiKey: string
  alternatives?: string[]
}> {
  const startTime = Date.now()
  
  // Use 3 different API keys to generate multiple perspectives
  const keysToUse = GEMINI_API_KEYS.slice(0, 3) // Use first 3 keys
  const prompts = [
    `Provide a direct, helpful response to: ${content}`,
    `Give a concise, practical answer for: ${content}`,
    `Offer a quick, insightful response to: ${content}`
  ]
  
  const responses: Array<{
    content: string
    apiKey: string
    processingTime: number
  }> = []
  
  // Generate responses in parallel for speed
  const promises = keysToUse.map(async (apiKey, index) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000) // Ultra-fast 2 second timeout
      
      const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompts[index]
            }]
          }],
          generationConfig: {
            temperature: 0.2 + (index * 0.05), // Lower temperature for faster responses
            maxOutputTokens: 80, // Shorter responses for speed
            topP: 0.7,
            topK: 8
          }
        }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Gemini API error with key ${index + 1}:`, errorText)
        
        if (response.status === 429 || response.status === 403 || errorText.includes("quota") || errorText.includes("limit")) {
          markGeminiKeyExhausted(apiKey, `HTTP ${response.status}: ${errorText}`)
        }
        return null
      }

      const data = await response.json()
      
      // Update API key usage
      if (!geminiKeyStatus[apiKey]) {
        geminiKeyStatus[apiKey] = { exhausted: false, lastUsed: 0, errorCount: 0, responseTime: 0 }
      }
      geminiKeyStatus[apiKey].lastUsed = Date.now()
      geminiKeyStatus[apiKey].responseTime = Date.now() - startTime
      
      // Extract content
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const responseText = data.candidates[0].content.parts[0].text
        return {
          content: responseText,
          apiKey: apiKey.substring(0, 10) + "...",
          processingTime: Date.now() - startTime
        }
      }
      
      return null
    } catch (error) {
      console.error(`Gemini completion error with key ${index + 1}:`, error)
      if (error.name === 'AbortError' || error.message.includes('fetch')) {
        markGeminiKeyExhausted(apiKey, error.message)
      }
      return null
    }
  })
  
  // Wait for all responses
  const results = await Promise.all(promises)
  const validResponses = results.filter(result => result !== null) as Array<{
    content: string
    apiKey: string
    processingTime: number
  }>
  
  if (validResponses.length === 0) {
    throw new Error("All Gemini API keys failed. Please try again later.")
  }
  
  // Select the best response based on length, clarity, and completeness
  const bestResponse = selectBestResponse(validResponses, content)
  const alternatives = validResponses
    .filter(r => r.content !== bestResponse.content)
    .map(r => r.content)
    .slice(0, 2) // Keep top 2 alternatives
  
  return {
    content: bestResponse.content,
    model: "gemini-1.5-flash-multi",
    processingTime: Date.now() - startTime,
    apiKey: bestResponse.apiKey,
    alternatives
  }
}

// New 4-API Instant Mode System
export async function geminiClipboardResponse(
  clipboardContent: string
): Promise<{
  content: string
  model: string
  processingTime: number
  apiKey: string
}> {
  const startTime = Date.now()
  const apiKey = GEMINI_API_KEYS[0] // Use first API key
  const model = 'gemini-1.5-flash'
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Based on this clipboard content: "${clipboardContent}"\n\nProvide a helpful, concise response.`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          topK: 20,
          maxOutputTokens: 60,
          candidateCount: 1
        }
      }),
      signal: AbortSignal.timeout(1500)
    })

    if (!response.ok) {
      throw new Error(`Clipboard API failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const processingTime = Date.now() - startTime
      return {
        content: data.candidates[0].content.parts[0].text,
        model,
        processingTime,
        apiKey: 'clipboard-api'
      }
    }
    
    throw new Error('Invalid clipboard response')
  } catch (error) {
    console.error('Clipboard response error:', error)
    throw new Error(`Clipboard response failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function geminiTypingResponse(
  currentText: string
): Promise<{
  content: string
  model: string
  processingTime: number
  apiKey: string
}> {
  const startTime = Date.now()
  const apiKey = GEMINI_API_KEYS[1] // Use second API key
  const model = 'gemini-1.5-flash'
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `User is typing: "${currentText}"\n\nPredict what they might want to ask and provide a helpful response.`
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          topP: 0.8,
          topK: 20,
          maxOutputTokens: 60,
          candidateCount: 1
        }
      }),
      signal: AbortSignal.timeout(1500)
    })

    if (!response.ok) {
      throw new Error(`Typing API failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const processingTime = Date.now() - startTime
      return {
        content: data.candidates[0].content.parts[0].text,
        model,
        processingTime,
        apiKey: 'typing-api'
      }
    }
    
    throw new Error('Invalid typing response')
  } catch (error) {
    console.error('Typing response error:', error)
    throw new Error(`Typing response failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function geminiSendButtonResponse(
  finalText: string
): Promise<{
  content: string
  model: string
  processingTime: number
  apiKey: string
}> {
  const startTime = Date.now()
  const apiKey = GEMINI_API_KEYS[2] // Use third API key
  const model = 'gemini-1.5-flash'
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `User's final message: "${finalText}"\n\nProvide a comprehensive, helpful response.`
          }]
        }],
        generationConfig: {
          temperature: 0.5,
          topP: 0.8,
          topK: 20,
          maxOutputTokens: 100,
          candidateCount: 1
        }
      }),
      signal: AbortSignal.timeout(2000)
    })

    if (!response.ok) {
      throw new Error(`Send button API failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const processingTime = Date.now() - startTime
      return {
        content: data.candidates[0].content.parts[0].text,
        model,
        processingTime,
        apiKey: 'send-button-api'
      }
    }
    
    throw new Error('Invalid send button response')
  } catch (error) {
    console.error('Send button response error:', error)
    throw new Error(`Send button response failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function geminiCombineResponses(
  response1: string,
  response2: string
): Promise<{
  content: string
  model: string
  processingTime: number
  apiKey: string
}> {
  const startTime = Date.now()
  const apiKey = GEMINI_API_KEYS[3] || GEMINI_API_KEYS[0] // Use fourth API key or fallback
  const model = 'gemini-1.5-flash'
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Combine these two responses into the best possible answer:\n\nResponse 1: "${response1}"\n\nResponse 2: "${response2}"\n\nCreate a comprehensive, helpful final response.`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          topK: 20,
          maxOutputTokens: 120,
          candidateCount: 1
        }
      }),
      signal: AbortSignal.timeout(2000)
    })

    if (!response.ok) {
      throw new Error(`Combine API failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const processingTime = Date.now() - startTime
      return {
        content: data.candidates[0].content.parts[0].text,
        model,
        processingTime,
        apiKey: 'combine-api'
      }
    }
    
    throw new Error('Invalid combine response')
  } catch (error) {
    console.error('Combine response error:', error)
    throw new Error(`Combine response failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Helper function to select the best response
function selectBestResponse(responses: Array<{ content: string; apiKey: string; processingTime: number }>, originalContent: string): { content: string; apiKey: string; processingTime: number } {
  if (responses.length === 1) return responses[0]
  
  // Score responses based on multiple criteria
  const scoredResponses = responses.map(response => {
    let score = 0
    const content = response.content
    
    // Length score (prefer responses that are not too short or too long)
    const length = content.length
    if (length >= 20 && length <= 200) score += 3
    else if (length >= 10 && length <= 300) score += 2
    else if (length >= 5 && length <= 500) score += 1
    
    // Completeness score (prefer responses that seem complete)
    if (content.includes('.') || content.includes('!') || content.includes('?')) score += 2
    if (content.length > 30 && !content.endsWith('...')) score += 2
    
    // Relevance score (prefer responses that address the original content)
    const originalWords = originalContent.toLowerCase().split(' ').filter(w => w.length > 3)
    const responseWords = content.toLowerCase().split(' ')
    const matchingWords = originalWords.filter(word => responseWords.some(rw => rw.includes(word)))
    score += matchingWords.length
    
    // Clarity score (prefer responses without excessive repetition)
    const words = content.toLowerCase().split(' ')
    const uniqueWords = new Set(words)
    const repetitionScore = uniqueWords.size / words.length
    score += repetitionScore * 2
    
    return { ...response, score }
  })
  
  // Return the highest scoring response
  return scoredResponses.reduce((best, current) => 
    current.score > best.score ? current : best
  )
}

// Parallel processing for multiple requests (for future use)
export async function geminiParallelCompletion(contents: string[]): Promise<{
  results: Array<{
    content: string
    model: string
    processingTime: number
    apiKey: string
  }>
  totalTime: number
}> {
  const startTime = Date.now()
  
  const promises = contents.map(async (content, index) => {
    // Use different API keys for parallel requests
    const keyIndex = index % GEMINI_API_KEYS.length
    const originalIndex = currentGeminiKeyIndex
    currentGeminiKeyIndex = keyIndex
    
    try {
      const result = await geminiInstantCompletion(content)
      return result
    } finally {
      currentGeminiKeyIndex = originalIndex
    }
  })
  
  const results = await Promise.all(promises)
  const totalTime = Date.now() - startTime
  
  return {
    results,
    totalTime
  }
}

// Health check for Gemini API
export async function geminiHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  availableKeys: number
  averageResponseTime: number
  errors: string[]
}> {
  const errors: string[] = []
  let totalResponseTime = 0
  let successfulRequests = 0
  
  // Test each API key
  for (let i = 0; i < Math.min(3, GEMINI_API_KEYS.length); i++) {
    try {
      const startTime = Date.now()
      const result = await geminiInstantCompletion("Test")
      const responseTime = Date.now() - startTime
      
      totalResponseTime += responseTime
      successfulRequests++
    } catch (error) {
      errors.push(`Key ${i + 1}: ${error.message}`)
    }
  }
  
  const averageResponseTime = successfulRequests > 0 ? totalResponseTime / successfulRequests : 0
  const availableKeys = GEMINI_API_KEYS.length - errors.length
  
  let status: 'healthy' | 'degraded' | 'unhealthy'
  if (availableKeys >= GEMINI_API_KEYS.length * 0.8 && averageResponseTime < 1000) {
    status = 'healthy'
  } else if (availableKeys >= GEMINI_API_KEYS.length * 0.5 && averageResponseTime < 2000) {
    status = 'degraded'
  } else {
    status = 'unhealthy'
  }
  
  return {
    status,
    availableKeys,
    averageResponseTime,
    errors
  }
}
