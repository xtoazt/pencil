"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HuggingFaceModels } from "@/components/huggingface-models"
import { LocalAIIntegration } from "@/components/localai-integration"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Cpu, 
  Server, 
  Database, 
  Zap, 
  Image, 
  Mic, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Loader2, 
  Activity, 
  HardDrive, 
  MemoryStick, 
  Network, 
  Wifi, 
  WifiOff, 
  Globe, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2, 
  Terminal, 
  Code, 
  FileText, 
  MessageSquare, 
  Brain, 
  Sparkles, 
  Layers, 
  Package, 
  GitBranch, 
  Github, 
  ExternalLink, 
  Bookmark, 
  Star, 
  Share2, 
  Copy, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  Hash, 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  PieChart, 
  LineChart
} from "lucide-react"

interface LocalAIModel {
  id: string
  name: string
  description: string
  type: 'text' | 'image' | 'audio' | 'video'
  size: string
  capabilities: string[]
  status: 'available' | 'loading' | 'error'
}

interface LocalAIResponse {
  id: string
  content: string
  model: string
  timestamp: Date
  processingTime: number
  tokens?: number
  type: 'text' | 'image' | 'audio'
}

interface LocalAIHealth {
  available: boolean
  models: number
  uptime?: number
  version?: string
}

export function LocalAIStudio() {
  // Core State
  const [isConnected, setIsConnected] = useState(false)
  const [models, setModels] = useState<LocalAIModel[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [health, setHealth] = useState<LocalAIHealth | null>(null)
  const [activeTab, setActiveTab] = useState("chat")
  
  // Chat State
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [responses, setResponses] = useState<LocalAIResponse[]>([])
  
  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState("")
  const [imageSize, setImageSize] = useState("1024x1024")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  
  // Audio Generation State
  const [audioText, setAudioText] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("alloy")
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  // Settings State
  const [localAIUrl, setLocalAIUrl] = useState("http://localhost:8080")
  const [showSettings, setShowSettings] = useState(false)
  const [autoConnect, setAutoConnect] = useState(true)
  
  // Performance Metrics
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    averageResponseTime: 0,
    successRate: 0,
    modelsLoaded: 0
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check LocalAI connection on mount
  useEffect(() => {
    if (autoConnect) {
      checkConnection()
    }
  }, [autoConnect])

  // Check LocalAI connection
  const checkConnection = async () => {
    try {
      const response = await fetch('/api/localai?action=status')
      const data = await response.json()
      
      if (data.success && data.available) {
        setIsConnected(true)
        await loadModels()
        await loadHealth()
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Connection check failed:', error)
      setIsConnected(false)
    }
  }

  // Load available models
  const loadModels = async () => {
    try {
      const response = await fetch('/api/localai?action=models')
      const data = await response.json()
      
      if (data.success) {
        setModels(data.models)
        setMetrics(prev => ({ ...prev, modelsLoaded: data.count }))
        
        // Auto-select first text model if none selected
        if (!selectedModel && data.models.length > 0) {
          const textModel = data.models.find((m: LocalAIModel) => m.type === 'text')
          if (textModel) {
            setSelectedModel(textModel.id)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load models:', error)
    }
  }

  // Load health information
  const loadHealth = async () => {
    try {
      const response = await fetch('/api/localai?action=health')
      const data = await response.json()
      
      if (data.success) {
        setHealth(data.health)
      }
    } catch (error) {
      console.error('Failed to load health:', error)
    }
  }

  // Send chat message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedModel || isGenerating) return

    const userMessage = { role: 'user', content: inputMessage }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputMessage("")
    setIsGenerating(true)

    const startTime = Date.now()

    try {
      const response = await fetch('/api/localai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          messages: newMessages,
          model: selectedModel,
          options: {
            temperature: 0.7,
            max_tokens: 2000
          }
        })
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      if (data.success && data.data.choices && data.data.choices[0]) {
        const assistantMessage = {
          role: 'assistant',
          content: data.data.choices[0].message.content
        }
        
        setMessages(prev => [...prev, assistantMessage])
        
        // Add to responses for history
        const newResponse: LocalAIResponse = {
          id: `response-${Date.now()}`,
          content: assistantMessage.content,
          model: selectedModel,
          timestamp: new Date(),
          processingTime,
          tokens: data.data.usage?.total_tokens || 0,
          type: 'text'
        }
        
        setResponses(prev => [newResponse, ...prev.slice(0, 49)])
        
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          totalRequests: prev.totalRequests + 1,
          averageResponseTime: (prev.averageResponseTime + processingTime) / 2,
          successRate: ((prev.successRate * prev.totalRequests) + 100) / (prev.totalRequests + 1)
        }))
      } else {
        throw new Error(data.error || 'Failed to generate response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message}`
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate image
  const generateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return

    setIsGeneratingImage(true)
    const startTime = Date.now()

    try {
      const response = await fetch('/api/localai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'image',
          options: {
            prompt: imagePrompt,
            size: imageSize
          }
        })
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      if (data.success && data.data.data && data.data.data[0]) {
        const imageUrl = data.data.data[0].url
        setGeneratedImages(prev => [imageUrl, ...prev.slice(0, 9)])
        
        // Add to responses
        const newResponse: LocalAIResponse = {
          id: `image-${Date.now()}`,
          content: imagePrompt,
          model: 'dall-e-3',
          timestamp: new Date(),
          processingTime,
          type: 'image'
        }
        
        setResponses(prev => [newResponse, ...prev.slice(0, 49)])
        setImagePrompt("")
      } else {
        throw new Error(data.error || 'Failed to generate image')
      }
    } catch (error) {
      console.error('Image generation error:', error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Generate audio
  const generateAudio = async () => {
    if (!audioText.trim() || isGeneratingAudio) return

    setIsGeneratingAudio(true)
    const startTime = Date.now()

    try {
      const response = await fetch('/api/localai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'audio',
          options: {
            text: audioText,
            voice: selectedVoice
          }
        })
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      if (data.success && data.audio) {
        const audioBlob = new Blob([Buffer.from(data.audio, 'base64')], { type: 'audio/mp3' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioUrl(audioUrl)
        
        // Add to responses
        const newResponse: LocalAIResponse = {
          id: `audio-${Date.now()}`,
          content: audioText,
          model: 'tts-1',
          timestamp: new Date(),
          processingTime,
          type: 'audio'
        }
        
        setResponses(prev => [newResponse, ...prev.slice(0, 49)])
      } else {
        throw new Error(data.error || 'Failed to generate audio')
      }
    } catch (error) {
      console.error('Audio generation error:', error)
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  // Clear chat
  const clearChat = () => {
    setMessages([])
  }

  // Get model type icon
  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <MessageSquare className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" />
      case 'audio': return <Volume2 className="h-4 w-4" />
      case 'video': return <Play className="h-4 w-4" />
      default: return <Cpu className="h-4 w-4" />
    }
  }

  // Get model type color
  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'text-blue-600'
      case 'image': return 'text-green-600'
      case 'audio': return 'text-purple-600'
      case 'video': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Cpu className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono">
              LocalAI Studio
            </h1>
            <p className="text-sm text-muted-foreground font-mono">Local AI Models & Inference</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            
            {health && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                {health.models} models
              </Badge>
            )}
          </div>
          
          {/* Control Buttons */}
          <Button
            onClick={checkConnection}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            size="sm"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-6 m-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="huggingface">HuggingFace</TabsTrigger>
              <TabsTrigger value="localai">LocalAI</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 p-4">
              <div className="space-y-4 h-full flex flex-col">
                {/* Chat Messages */}
                <Card className="flex-1 flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Chat with LocalAI
                      {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Start a conversation with your local AI models</p>
                        </div>
                      ) : (
                        messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                      {isGenerating && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Generating response...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                        className="flex-1 min-h-[60px]"
                        disabled={!isConnected || !selectedModel || isGenerating}
                      />
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={sendMessage}
                          disabled={!inputMessage.trim() || !isConnected || !selectedModel || isGenerating}
                        >
                          <Zap className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={clearChat}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="image" className="flex-1 p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Image Generation
                    </CardTitle>
                    <CardDescription>
                      Generate images using local AI models
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-prompt">Image Prompt</Label>
                      <Textarea
                        id="image-prompt"
                        placeholder="Describe the image you want to generate..."
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={imageSize} onValueChange={setImageSize}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="256x256">256x256</SelectItem>
                          <SelectItem value="512x512">512x512</SelectItem>
                          <SelectItem value="1024x1024">1024x1024</SelectItem>
                          <SelectItem value="1792x1024">1792x1024</SelectItem>
                          <SelectItem value="1024x1792">1024x1792</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        onClick={generateImage}
                        disabled={!imagePrompt.trim() || !isConnected || isGeneratingImage}
                        className="flex-1"
                      >
                        {isGeneratingImage ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Image className="h-4 w-4 mr-2" />
                            Generate Image
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Images */}
                {generatedImages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {generatedImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Generated image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <div className="flex gap-2">
                                <Button size="sm" variant="secondary">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="secondary">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="audio" className="flex-1 p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5" />
                      Audio Generation
                    </CardTitle>
                    <CardDescription>
                      Generate speech from text using local AI models
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="audio-text">Text to Speech</Label>
                      <Textarea
                        id="audio-text"
                        placeholder="Enter text to convert to speech..."
                        value={audioText}
                        onChange={(e) => setAudioText(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alloy">Alloy</SelectItem>
                          <SelectItem value="echo">Echo</SelectItem>
                          <SelectItem value="fable">Fable</SelectItem>
                          <SelectItem value="onyx">Onyx</SelectItem>
                          <SelectItem value="nova">Nova</SelectItem>
                          <SelectItem value="shimmer">Shimmer</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        onClick={generateAudio}
                        disabled={!audioText.trim() || !isConnected || isGeneratingAudio}
                        className="flex-1"
                      >
                        {isGeneratingAudio ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-4 w-4 mr-2" />
                            Generate Audio
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Audio Player */}
                    {audioUrl && (
                      <div className="space-y-2">
                        <Label>Generated Audio</Label>
                        <audio controls className="w-full">
                          <source src={audioUrl} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="models" className="flex-1 p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Available Models
                    </CardTitle>
                    <CardDescription>
                      Manage and monitor your local AI models
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {models.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No models available</p>
                          <p className="text-sm">Make sure LocalAI is running and models are loaded</p>
                        </div>
                      ) : (
                        models.map((model) => (
                          <div
                            key={model.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedModel === model.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedModel(model.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={getModelTypeColor(model.type)}>
                                  {getModelTypeIcon(model.type)}
                                </div>
                                <div>
                                  <h3 className="font-medium">{model.name}</h3>
                                  <p className="text-sm text-muted-foreground">{model.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {model.size}
                                </Badge>
                                <Badge 
                                  variant={model.status === 'available' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {model.status}
                                </Badge>
                              </div>
                            </div>
                            {model.capabilities.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {model.capabilities.map((capability) => (
                                  <Badge key={capability} variant="outline" className="text-xs">
                                    {capability}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Health Status */}
                {health && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {health.available ? '✓' : '✗'}
                          </div>
                          <p className="text-sm text-muted-foreground">Status</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{health.models}</div>
                          <p className="text-sm text-muted-foreground">Models</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{metrics.totalRequests}</div>
                          <p className="text-sm text-muted-foreground">Requests</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{Math.round(metrics.averageResponseTime)}ms</div>
                          <p className="text-sm text-muted-foreground">Avg Time</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="huggingface" className="flex-1 p-4">
              <HuggingFaceModels />
            </TabsContent>

            <TabsContent value="localai" className="flex-1 p-4">
              <LocalAIIntegration />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="p-4 space-y-4">
            {/* Model Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Selected Model</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedModel ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getModelTypeIcon(models.find(m => m.id === selectedModel)?.type || 'text')}
                      <span className="font-medium text-sm">{selectedModel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {models.find(m => m.id === selectedModel)?.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No model selected</p>
                )}
              </CardContent>
            </Card>

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
                  onClick={loadModels}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Models
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={loadHealth}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Check Health
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={clearChat}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Chat
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            {showSettings && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="localai-url" className="text-xs">LocalAI URL</Label>
                    <Input
                      id="localai-url"
                      value={localAIUrl}
                      onChange={(e) => setLocalAIUrl(e.target.value)}
                      placeholder="http://localhost:8080"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto-connect"
                      checked={autoConnect}
                      onChange={(e) => setAutoConnect(e.target.checked)}
                    />
                    <Label htmlFor="auto-connect" className="text-xs">Auto-connect on startup</Label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
