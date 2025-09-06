"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface InstantModeSettings {
  clipboardEnabled: boolean
  typingEnabled: boolean
  responseDelay: number
  maxClipboardLength: number
  maxTypingLength: number
  autoProcess: boolean
  showPreview: boolean
}

interface InstantResponse {
  id: string
  content: string
  timestamp: number
  source: 'clipboard' | 'typing' | 'send-button' | 'combined'
  processingTime: number
  model: string
  apiKey: string
}

interface UseInstantModeReturn {
  isActive: boolean
  hasPermission: boolean
  isProcessing: boolean
  responses: InstantResponse[]
  settings: InstantModeSettings
  currentClipboard: string
  currentTyping: string
  clipboardResponse: string | null
  typingResponse: string | null
  finalResponse: string | null
  toggleInstantMode: () => Promise<void>
  requestClipboardPermission: () => Promise<boolean>
  processClipboardContent: (content: string) => Promise<void>
  processTypingContent: (text: string) => Promise<void>
  processSendButton: (finalText: string) => Promise<void>
  updateSettings: (newSettings: Partial<InstantModeSettings>) => void
  handleTypingChange: (text: string) => void
  clearContent: () => void
}

const defaultSettings: InstantModeSettings = {
  clipboardEnabled: true,
  typingEnabled: true,
  responseDelay: 200,
  maxClipboardLength: 1000,
  maxTypingLength: 500,
  autoProcess: true,
  showPreview: true
}

export function useInstantMode(): UseInstantModeReturn {
  const [isActive, setIsActive] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [responses, setResponses] = useState<InstantResponse[]>([])
  const [settings, setSettings] = useState<InstantModeSettings>(defaultSettings)
  const [currentClipboard, setCurrentClipboard] = useState("")
  const [currentTyping, setCurrentTyping] = useState("")
  const [clipboardResponse, setClipboardResponse] = useState<string | null>(null)
  const [typingResponse, setTypingResponse] = useState<string | null>(null)
  const [finalResponse, setFinalResponse] = useState<string | null>(null)
  
  const clipboardIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastClipboardContent = useRef("")
  const lastTypingContent = useRef("")

  // Request clipboard permission
  const requestClipboardPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (navigator.clipboard && navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName })
        if (permission.state === 'granted') {
          setHasPermission(true)
          return true
        }
      }
      
      // Try to read clipboard to trigger permission request
      try {
        await navigator.clipboard.readText()
        setHasPermission(true)
        return true
      } catch (error) {
        console.warn('Clipboard permission denied:', error)
        setHasPermission(false)
        return false
      }
    } catch (error) {
      console.error('Error requesting clipboard permission:', error)
      setHasPermission(false)
      return false
    }
  }, [])

  // Process clipboard content with API 1
  const processClipboardContent = useCallback(async (content: string) => {
    if (!content || content.length < 3 || content === lastClipboardContent.current) {
      return
    }

    lastClipboardContent.current = content
    setCurrentClipboard(content)
    setIsProcessing(true)

    try {
      const { geminiClipboardResponse } = await import("@/lib/gemini")
      const result = await geminiClipboardResponse(content)
      
      const response: InstantResponse = {
        id: `clipboard-${Date.now()}`,
        content: result.content,
        timestamp: Date.now(),
        source: 'clipboard',
        processingTime: result.processingTime,
        model: result.model,
        apiKey: result.apiKey
      }

      setClipboardResponse(result.content)
      setResponses(prev => [response, ...prev.slice(0, 9)]) // Keep last 10 responses
    } catch (error) {
      console.error('Clipboard processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  // Process typing content with API 2
  const processTypingContent = useCallback(async (text: string) => {
    if (!text || text.length < 3 || text === lastTypingContent.current) {
      return
    }

    lastTypingContent.current = text
    setCurrentTyping(text)

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout for typing response
    typingTimeoutRef.current = setTimeout(async () => {
      try {
        const { geminiTypingResponse } = await import("@/lib/gemini")
        const result = await geminiTypingResponse(text)
        
        const response: InstantResponse = {
          id: `typing-${Date.now()}`,
          content: result.content,
          timestamp: Date.now(),
          source: 'typing',
          processingTime: result.processingTime,
          model: result.model,
          apiKey: result.apiKey
        }

        setTypingResponse(result.content)
        setResponses(prev => [response, ...prev.slice(0, 9)])
      } catch (error) {
        console.error('Typing processing error:', error)
      }
    }, settings.responseDelay)
  }, [settings.responseDelay])

  // Process send button with API 3
  const processSendButton = useCallback(async (finalText: string) => {
    if (!finalText || finalText.length < 3) {
      return
    }

    setIsProcessing(true)

    try {
      const { geminiSendButtonResponse } = await import("@/lib/gemini")
      const result = await geminiSendButtonResponse(finalText)
      
      const response: InstantResponse = {
        id: `send-${Date.now()}`,
        content: result.content,
        timestamp: Date.now(),
        source: 'send-button',
        processingTime: result.processingTime,
        model: result.model,
        apiKey: result.apiKey
      }

      setResponses(prev => [response, ...prev.slice(0, 9)])

      // If we have both clipboard and typing responses, combine them with API 4
      if (clipboardResponse && typingResponse) {
        try {
          const { geminiCombineResponses } = await import("@/lib/gemini")
          const combinedResult = await geminiCombineResponses(clipboardResponse, typingResponse)
          
          const combinedResponse: InstantResponse = {
            id: `combined-${Date.now()}`,
            content: combinedResult.content,
            timestamp: Date.now(),
            source: 'combined',
            processingTime: combinedResult.processingTime,
            model: combinedResult.model,
            apiKey: combinedResult.apiKey
          }

          setFinalResponse(combinedResult.content)
          setResponses(prev => [combinedResponse, ...prev.slice(0, 9)])
        } catch (error) {
          console.error('Combine response error:', error)
          setFinalResponse(result.content)
        }
      } else {
        setFinalResponse(result.content)
      }
    } catch (error) {
      console.error('Send button processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [clipboardResponse, typingResponse])

  // Monitor clipboard
  const monitorClipboard = useCallback(async () => {
    if (!hasPermission || !settings.clipboardEnabled) {
      return
    }

    try {
      const text = await navigator.clipboard.readText()
      if (text && text.length > 3 && text.trim() !== '' && text !== lastClipboardContent.current) {
        await processClipboardContent(text)
      }
    } catch (error) {
      // Silently handle clipboard errors
    }
  }, [hasPermission, settings.clipboardEnabled, processClipboardContent])

  // Handle typing changes
  const handleTypingChange = useCallback((text: string) => {
    setCurrentTyping(text)
    if (settings.typingEnabled && settings.autoProcess) {
      processTypingContent(text)
    }
  }, [settings.typingEnabled, settings.autoProcess, processTypingContent])

  // Toggle instant mode
  const toggleInstantMode = useCallback(async () => {
    if (!isActive) {
      const permissionGranted = await requestClipboardPermission()
      if (permissionGranted) {
        setIsActive(true)
        // Start clipboard monitoring
        clipboardIntervalRef.current = setInterval(monitorClipboard, 200) // Faster polling
      }
    } else {
      setIsActive(false)
      if (clipboardIntervalRef.current) {
        clearInterval(clipboardIntervalRef.current)
        clipboardIntervalRef.current = null
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    }
  }, [isActive, requestClipboardPermission, monitorClipboard])

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<InstantModeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  // Clear content
  const clearContent = useCallback(() => {
    setCurrentClipboard("")
    setCurrentTyping("")
    setClipboardResponse(null)
    setTypingResponse(null)
    setFinalResponse(null)
    setResponses([])
    lastClipboardContent.current = ""
    lastTypingContent.current = ""
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clipboardIntervalRef.current) {
        clearInterval(clipboardIntervalRef.current)
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return {
    isActive,
    hasPermission,
    isProcessing,
    responses,
    settings,
    currentClipboard,
    currentTyping,
    clipboardResponse,
    typingResponse,
    finalResponse,
    toggleInstantMode,
    requestClipboardPermission,
    processClipboardContent,
    processTypingContent,
    processSendButton,
    updateSettings,
    handleTypingChange,
    clearContent
  }
}