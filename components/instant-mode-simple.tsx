"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Zap, 
  Clipboard, 
  Brain, 
  Settings, 
  History, 
  Star, 
  Share2, 
  Download, 
  Upload,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Bookmark,
  Tag,
  Filter,
  Search,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  FileText,
  Image,
  Code,
  Globe,
  Database,
  Cpu,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  Zap as Lightning,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from "lucide-react"

interface InstantResponse {
  id: string
  content: string
  timestamp: Date
  source: 'clipboard' | 'typing' | 'send' | 'combined'
  confidence: number
  processingTime: number
  alternatives?: string[]
  metadata?: {
    tokens: number
    model: string
    temperature: number
  }
}

interface ClipboardData {
  content: string
  type: string
  timestamp: Date
  length: number
}

export function InstantModePro() {
  // Core State
  const [isActive, setIsActive] = useState(false)
  const [clipboardData, setClipboardData] = useState<ClipboardData | null>(null)
  const [typingContent, setTypingContent] = useState("")
  const [responses, setResponses] = useState<InstantResponse[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Advanced Features
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [favorites, setFavorites] = useState<InstantResponse[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("live")
  const [autoMode, setAutoMode] = useState(true) // Auto mode prevents manual switching
  
  // Settings
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7)
  const [maxAlternatives, setMaxAlternatives] = useState(3)
  const [responseDelay, setResponseDelay] = useState(1000)
  
  // Performance Metrics
  const [metrics, setMetrics] = useState({
    totalResponses: 0,
    averageResponseTime: 0,
    successRate: 0,
    activeUsers: 0
  })

  const clipboardRef = useRef<HTMLTextAreaElement>(null)
  const typingRef = useRef<HTMLTextAreaElement>(null)
  const speechSynthesis = useRef<SpeechSynthesisUtterance | null>(null)

  // Process Instant Request
  const processInstantRequest = useCallback(async (content: string, source: InstantResponse['source']) => {
    setIsProcessing(true)
    const startTime = Date.now()
    
    try {
      const response = await fetch('/api/instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          source,
          settings: {
            maxAlternatives,
            confidenceThreshold,
            responseDelay
          }
        })
      })
      
      const data = await response.json()
      const processingTime = Date.now() - startTime
      
      const newResponse: InstantResponse = {
        id: `response-${Date.now()}`,
        content: data.content,
        timestamp: new Date(),
        source,
        confidence: data.confidence || 0.8,
        processingTime,
        alternatives: data.alternatives || [],
        metadata: {
          tokens: data.tokens || 0,
          model: data.model || 'gemini-pro',
          temperature: data.temperature || 0.3
        }
      }
      
      setResponses(prev => [newResponse, ...prev.slice(0, 49)]) // Keep last 50
      
      // Auto-speak if enabled
      if (autoSpeak && newResponse.confidence >= confidenceThreshold) {
        speakResponse(newResponse.content)
      }
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalResponses: prev.totalResponses + 1,
        averageResponseTime: (prev.averageResponseTime + processingTime) / 2,
        successRate: ((prev.successRate * prev.totalResponses) + (newResponse.confidence * 100)) / (prev.totalResponses + 1)
      }))
      
    } catch (error) {
      console.error('Error processing instant request:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [maxAlternatives, confidenceThreshold, responseDelay, autoSpeak])

  // Clipboard Monitoring
  const monitorClipboard = useCallback(async () => {
    try {
      const clipboardItems = await navigator.clipboard.read()
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type === 'text/plain') {
            const blob = await clipboardItem.getType(type)
            const text = await blob.text()
            
            if (text && text.length > 3 && text !== clipboardData?.content) {
              setClipboardData({
                content: text,
                type: 'text/plain',
                timestamp: new Date(),
                length: text.length
              })
              
              // Auto-process clipboard content
              if (isActive) {
                await processInstantRequest(text, 'clipboard')
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Clipboard access denied or error:', error)
    }
  }, [clipboardData, isActive, processInstantRequest])

  // Text-to-Speech
  const speakResponse = (text: string) => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel()
    }
    
    speechSynthesis.current = new SpeechSynthesisUtterance(text)
    speechSynthesis.current.rate = 0.9
    speechSynthesis.current.pitch = 1
    speechSynthesis.current.volume = 0.8
    
    speechSynthesis.current.onstart = () => setIsSpeaking(true)
    speechSynthesis.current.onend = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(speechSynthesis.current)
  }

  // Voice Recording
  const startRecording = () => {
    setIsRecording(true)
    // Voice recording implementation would go here
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Process recorded audio
  }

  // Favorites Management
  const toggleFavorite = (response: InstantResponse) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === response.id)
      if (exists) {
        return prev.filter(fav => fav.id !== response.id)
      } else {
        return [...prev, response]
      }
    })
  }

  // Filter Responses
  const filteredResponses = responses.filter(response => {
    if (searchQuery) {
      return response.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
             response.source.includes(searchQuery.toLowerCase())
    }
    return true
  })

  // Clipboard Effect
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(monitorClipboard, 200)
      return () => clearInterval(interval)
    }
  }, [isActive, monitorClipboard])

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Lightning className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono">
              Instant Mode Pro
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              Auto-processing clipboard and typing content
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Zap className="h-3 w-3 mr-1" />
            Auto Mode
          </Badge>
          {isActive && (
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Brain className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
          <Button
            onClick={() => setIsActive(!isActive)}
            className={isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-mono">Instant Mode - Auto Processing</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Zap className="h-3 w-3 mr-1" />
                    Auto Mode
                  </Badge>
                  {isActive && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      <Brain className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 p-4">
              <div className="space-y-4">
                {/* Live Response Feed */}
                <Card className="card-terminal">
                  <CardHeader className="terminal-header">
                    <CardTitle className="flex items-center gap-2 font-mono">
                      <MessageSquare className="h-5 w-5" />
                      Live Response Feed
                    </CardTitle>
                    <CardDescription className="font-mono text-sm">
                      Real-time AI responses from clipboard and typing analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="terminal-content">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredResponses.map((response) => (
                        <div key={response.id} className="p-3 bg-muted rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {response.source}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {response.timestamp.toLocaleTimeString()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {response.processingTime}ms
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleFavorite(response)}
                              >
                                <Star className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm font-mono">{response.content}</p>
                        </div>
                      ))}
                      
                      {responses.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="font-mono">No responses yet. Start Instant Mode to begin!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Auto Processing Status */}
                <Card className="card-terminal">
                  <CardHeader className="terminal-header">
                    <CardTitle className="flex items-center gap-2 font-mono">
                      <Brain className="h-5 w-5" />
                      Auto Processing Status
                    </CardTitle>
                    <CardDescription className="font-mono text-sm">
                      Instant mode automatically processes clipboard and typing content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="terminal-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          <Clipboard className="h-4 w-4" />
                          <span className="text-sm font-medium font-mono">Clipboard Monitor</span>
                          {isActive && <Badge variant="outline" className="text-green-600">Active</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {clipboardData ? (
                            <div>
                              <p>Content: {clipboardData.content.substring(0, 100)}...</p>
                              <p>Type: {clipboardData.type}</p>
                              <p>Length: {clipboardData.length} characters</p>
                            </div>
                          ) : (
                            <p>Monitoring clipboard for changes...</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-muted rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4" />
                          <span className="text-sm font-medium font-mono">Typing Analysis</span>
                          {isActive && <Badge variant="outline" className="text-green-600">Active</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {typingContent ? (
                            <div>
                              <p>Content: {typingContent.substring(0, 100)}...</p>
                              <p>Length: {typingContent.length} characters</p>
                            </div>
                          ) : (
                            <p>Ready to analyze typing patterns...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className="card-terminal">
                  <CardHeader className="terminal-header">
                    <CardTitle className="flex items-center gap-2 font-mono">
                      <TrendingUp className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="terminal-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold font-mono">{metrics.totalResponses}</div>
                        <div className="text-sm text-muted-foreground font-mono">Total Responses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold font-mono">{metrics.averageResponseTime}ms</div>
                        <div className="text-sm text-muted-foreground font-mono">Avg Response Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold font-mono">{metrics.successRate.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground font-mono">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold font-mono">{metrics.activeUsers}</div>
                        <div className="text-sm text-muted-foreground font-mono">Active Users</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
