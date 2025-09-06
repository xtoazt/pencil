// Gemini API Configuration with Ultra-Fast Rotation System
const GEMINI_API_KEYS = [
  "AIzaSyB-wBKdbcjiXW5ppgAUqVkX9jq9FDkc2BE",
  "AIzaSyDKBcnHqj0X_Y3hYBYFTqJ9lSxbwj3xoh0",
  "AIzaSyBxZQW9vWZijKa-Ro_CGa0QtVLoJNeB0NI",
  "AIzaSyAlW8aX7ZL7g6qnl6b2ZpYWKB0eWGfNsUY",
  "AIzaSyA7E34AEBhmt6_52pRnn4W1_q8GS8pps8A",
  "AIzaSyDwmohY6E4Xy-O425qttWXmqknxQ_i9JVU",
  "AIzaSyD4vXsehTtCwfeYiP_euZeCXx56a0TKV3s"
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

// Ultra-fast Gemini completion for Instant Mode
export async function geminiInstantCompletion(content: string): Promise<{
  content: string
  model: string
  processingTime: number
  apiKey: string
}> {
  let attempts = 0
  const maxAttempts = GEMINI_API_KEYS.length
  const startTime = Date.now()
  
  while (attempts < maxAttempts) {
    try {
      const currentApiKey = getCurrentGeminiKey()
      
      console.log(`Making ultra-fast request to Gemini with key: ${currentGeminiKeyIndex + 1}/${GEMINI_API_KEYS.length}`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout for instant mode
      
      const response = await fetch(`${GEMINI_BASE_URL}?key=${currentApiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Respond quickly and concisely to: ${content}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 150, // Keep responses short for speed
            topP: 0.8,
            topK: 10
          }
        }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      const processingTime = Date.now() - startTime

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Gemini API error response:", errorText)
        
        // Check if it's a rate limit or quota exceeded error
        if (response.status === 429 || response.status === 403 || errorText.includes("quota") || errorText.includes("limit")) {
          markGeminiKeyExhausted(currentApiKey, `HTTP ${response.status}: ${errorText}`)
          attempts++
          continue // Try next API key
        }
        
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Gemini response data:", data)
      
      // Update API key usage and performance
      if (!geminiKeyStatus[currentApiKey]) {
        geminiKeyStatus[currentApiKey] = { exhausted: false, lastUsed: 0, errorCount: 0, responseTime: 0 }
      }
      geminiKeyStatus[currentApiKey].lastUsed = Date.now()
      geminiKeyStatus[currentApiKey].responseTime = processingTime
      
      // Extract content from Gemini response
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const responseText = data.candidates[0].content.parts[0].text
        
        return {
          content: responseText,
          model: "gemini-1.5-flash",
          processingTime,
          apiKey: currentApiKey.substring(0, 10) + "..." // Partial key for logging
        }
      } else {
        console.error("Unexpected Gemini response format:", data)
        throw new Error("Unexpected response format from Gemini")
      }
    } catch (error) {
      console.error("Gemini instant completion error:", error)
      
      // If it's a network error or timeout, try next API key
      if (error.name === 'AbortError' || error.message.includes('fetch')) {
        markGeminiKeyExhausted(getCurrentGeminiKey(), error.message)
        attempts++
        continue
      }
      
      // For other errors, throw immediately
      throw error
    }
  }
  
  // If we've exhausted all API keys
  throw new Error("All Gemini API keys have been exhausted. Please try again later.")
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
