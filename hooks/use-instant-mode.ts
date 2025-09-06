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
  source: 'clipboard' | 'typing'
  processingTime: number
  model: string
  alternatives?: string[]
}

interface UseInstantModeReturn {
  isActive: boolean
  hasPermission: boolean
  isProcessing: boolean
  responses: InstantResponse[]
  settings: InstantModeSettings
  currentClipboard: string
  currentTyping: string
  toggleInstantMode: () => Promise<void>
  requestClipboardPermission: () => Promise<boolean>
  processInstantRequest: (content: string, source: 'clipboard' | 'typing') => Promise<void>
  updateSettings: (newSettings: Partial<InstantModeSettings>) => void
  handleTypingChange: (text: string) => void
  clearContent: () => void
}

const defaultSettings: InstantModeSettings = {
  clipboardEnabled: false,
  typingEnabled: true,
  responseDelay: 500,
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

  const clipboardIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastClipboardRef = useRef("")
  const lastTypingRef = useRef("")
  const workerRef = useRef<Worker | null>(null)

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
      
      // Fallback: try to read clipboard directly
      const text = await navigator.clipboard.readText()
      setHasPermission(true)
      return true
    } catch (error) {
      console.error('Clipboard permission denied:', error)
      setHasPermission(false)
      return false
    }
  }, [])

  // Monitor clipboard changes with improved detection - MANDATORY
  const monitorClipboard = useCallback(async () => {
    if (!hasPermission) {
      // Always try to get permission if we don't have it
      await requestClipboardPermission()
      return
    }

    try {
      const text = await navigator.clipboard.readText()
      if (text && 
          text !== lastClipboardRef.current && 
          text.length <= settings.maxClipboardLength &&
          text.length > 3 && // Only process meaningful content
          text.trim() !== '') {
        lastClipboardRef.current = text
        setCurrentClipboard(text)
        
        // Always process clipboard content when Instant Mode is active
        if (isActive) {
          await processInstantRequest(text, 'clipboard')
        }
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error)
      // Try to re-request permission if it fails
      if (error.name === 'NotAllowedError') {
        setHasPermission(false)
        // Automatically request permission again
        setTimeout(() => requestClipboardPermission(), 1000)
      }
    }
  }, [hasPermission, settings.maxClipboardLength, isActive, requestClipboardPermission])

  // Handle typing changes
  const handleTypingChange = useCallback((text: string) => {
    if (!settings.typingEnabled || text.length > settings.maxTypingLength) return

    setCurrentTyping(text)
    lastTypingRef.current = text

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout for processing
    if (text.length > 10 && settings.autoProcess && isActive) {
      typingTimeoutRef.current = setTimeout(() => {
        processInstantRequest(text, 'typing')
      }, settings.responseDelay)
    }
  }, [settings.typingEnabled, settings.maxTypingLength, settings.autoProcess, settings.responseDelay, isActive])

  // Process instant AI request using Gemini
  const processInstantRequest = useCallback(async (content: string, source: 'clipboard' | 'typing') => {
    if (isProcessing) return

    setIsProcessing(true)
    const startTime = Date.now()

    try {
      const response = await fetch("/api/instant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          source: source
        }),
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      if (data.content) {
        const newResponse: InstantResponse = {
          id: Date.now().toString(),
          content: data.content,
          timestamp: Date.now(),
          source,
          processingTime: data.processingTime || processingTime,
          model: data.model || "gemini-1.5-flash-multi",
          alternatives: data.alternatives || []
        }

        setResponses(prev => [newResponse, ...prev.slice(0, 9)]) // Keep last 10 responses
      }
    } catch (error) {
      console.error("Instant processing error:", error)
    } finally {
      setIsProcessing(false)
    }
  }, [isProcessing])

  // Initialize worker
  useEffect(() => {
    if (typeof Worker !== 'undefined') {
      workerRef.current = new Worker('/instant-worker.js')
      
      workerRef.current.onmessage = (e) => {
        const { type, data } = e.data
        
        switch (type) {
          case 'CLIPBOARD_CHANGED':
            setCurrentClipboard(data.content)
            if (settings.autoProcess && isActive) {
              processInstantRequest(data.content, 'clipboard')
            }
            break
            
          case 'INSTANT_RESPONSE':
            const newResponse: InstantResponse = {
              id: Date.now().toString(),
              content: data.content,
              timestamp: data.timestamp,
              source: data.source,
              processingTime: 0, // Worker doesn't track this
              model: data.model
            }
            setResponses(prev => [newResponse, ...prev.slice(0, 9)])
            break
        }
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [settings.autoProcess, isActive, processInstantRequest])

  // Start/stop monitoring
  const toggleInstantMode = useCallback(async () => {
    if (!isActive) {
      // Starting instant mode
      if (settings.clipboardEnabled) {
        const permissionGranted = await requestClipboardPermission()
        if (!permissionGranted) {
          alert("Clipboard permission is required for Instant Mode. Please allow clipboard access.")
          return
        }
      }

      setIsActive(true)
      
      // Start clipboard monitoring with ultra-fast polling - ALWAYS ENABLED
      clipboardIntervalRef.current = setInterval(monitorClipboard, 200) // Check every 200ms for ultra-fast response
        
        // Start worker monitoring
        if (workerRef.current) {
          workerRef.current.postMessage({
            type: 'START_MONITORING',
            data: { apiEndpoint: '/api/instant' }
          })
        }
      }
    } else {
      // Stopping instant mode
      setIsActive(false)
      
      if (clipboardIntervalRef.current) {
        clearInterval(clipboardIntervalRef.current)
        clipboardIntervalRef.current = null
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
      
      // Stop worker monitoring
      if (workerRef.current) {
        workerRef.current.postMessage({
          type: 'STOP_MONITORING'
        })
      }
    }
  }, [isActive, settings.clipboardEnabled, requestClipboardPermission, monitorClipboard])

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<InstantModeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  // Clear content
  const clearContent = useCallback(() => {
    setCurrentClipboard("")
    setCurrentTyping("")
    lastClipboardRef.current = ""
    lastTypingRef.current = ""
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
      if (workerRef.current) {
        workerRef.current.terminate()
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
    toggleInstantMode,
    requestClipboardPermission,
    processInstantRequest,
    updateSettings,
    handleTypingChange,
    clearContent
  }
}
