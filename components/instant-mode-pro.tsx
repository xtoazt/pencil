"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  }, [clipboardData, isActive])

  // Process Instant Request
  const processInstantRequest = async (content: string, source: InstantResponse['source']) => {
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
  }

  // Text-to-Speech
  const speakResponse = (text: string) => {
    if (speechSynthesis.current) {
      speechSynthesis.cancel()
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Lightning className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Instant Mode Pro
            </h1>
            <p className="text-sm text-muted-foreground">AI-Powered Real-Time Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status Indicators */}
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
            
            {clipboardData && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clipboard className="h-3 w-3" />
                {clipboardData.length} chars
              </Badge>
            )}
            
            <Badge variant="outline" className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {responses.length}
            </Badge>
          </div>
          
          {/* Control Buttons */}
          <Button
            onClick={() => setIsActive(!isActive)}
            variant={isActive ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isActive ? 'Stop' : 'Start'}
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger value="live">Live Feed</TabsTrigger>
              <TabsTrigger value="clipboard">Clipboard</TabsTrigger>
              <TabsTrigger value="typing">Typing</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="live" className="flex-1 p-4">
              <div className="space-y-4">
                {/* Live Response Feed */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Live Response Feed
                      {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredResponses.map((response) => (
                        <div key={response.id} className="p-3 border rounded-lg bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {response.source}
                              </Badge>
                              <Badge variant={response.confidence > 0.8 ? "default" : "secondary"} className="text-xs">
                                {Math.round(response.confidence * 100)}%
                              </Badge>
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
                                <Star className={`h-4 w-4 ${favorites.find(fav => fav.id === response.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm">{response.content}</p>
                          
                          {/* Alternatives */}
                          {response.alternatives && response.alternatives.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-muted-foreground">Alternatives:</p>
                              {response.alternatives.map((alt, index) => (
                                <div key={index} className="text-xs p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                  {alt}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {responses.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No responses yet. Start Instant Mode to begin!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clipboard" className="flex-1 p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clipboard className="h-5 w-5" />
                      Clipboard Monitor
                    </CardTitle>
                    <CardDescription>
                      Real-time clipboard content monitoring and processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {clipboardData ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {clipboardData.type} • {clipboardData.length} characters
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {clipboardData.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <Textarea
                          value={clipboardData.content}
                          readOnly
                          className="min-h-[200px] font-mono text-sm"
                        />
                        <Button 
                          onClick={() => processInstantRequest(clipboardData.content, 'clipboard')}
                          className="w-full"
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          Process Clipboard Content
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clipboard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No clipboard content detected</p>
                        <p className="text-sm">Copy some text to see it here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="typing" className="flex-1 p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Smart Typing Assistant
                    </CardTitle>
                    <CardDescription>
                      AI-powered typing assistance and auto-completion
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Textarea
                        ref={typingRef}
                        placeholder="Start typing and get instant AI assistance..."
                        value={typingContent}
                        onChange={(e) => setTypingContent(e.target.value)}
                        className="min-h-[200px]"
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => processInstantRequest(typingContent, 'typing')}
                          disabled={!typingContent.trim()}
                          className="flex-1"
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          Get AI Assistance
                        </Button>
                        <Button variant="outline">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{metrics.totalResponses}</p>
                        <p className="text-sm text-muted-foreground">Total Responses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{Math.round(metrics.averageResponseTime)}ms</p>
                        <p className="text-sm text-muted-foreground">Avg Response Time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold">{Math.round(metrics.successRate)}%</p>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="text-2xl font-bold">{metrics.activeUsers}</p>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="p-4 space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isRecording ? 'Stop Recording' : 'Voice Input'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setIsSpeaking(!isSpeaking)}
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                  {isSpeaking ? 'Stop Speaking' : 'Text to Speech'}
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export History
                </Button>
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Favorites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                      <p className="truncate">{fav.content}</p>
                      <p className="text-xs text-muted-foreground">{fav.source}</p>
                    </div>
                  ))}
                  {favorites.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center">No favorites yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Search Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search responses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
