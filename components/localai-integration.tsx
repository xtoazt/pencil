"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Server, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Terminal,
  Download,
  Settings,
  Activity,
  Database,
  Cpu,
  Zap
} from "lucide-react"

interface LocalAIModel {
  id: string
  name: string
  size: string
  status: 'available' | 'downloading' | 'ready' | 'error'
  type: 'text' | 'image' | 'audio'
}

const LOCALAI_MODELS: LocalAIModel[] = [
  {
    id: "llama-3.2-1b-instruct:q4_k_m",
    name: "Llama 3.2 1B Instruct",
    size: "1.1GB",
    status: "available",
    type: "text"
  },
  {
    id: "phi-2:Q8_0",
    name: "Phi-2",
    size: "2.7GB",
    status: "available",
    type: "text"
  },
  {
    id: "gemma:2b",
    name: "Gemma 2B",
    size: "1.6GB",
    status: "available",
    type: "text"
  },
  {
    id: "stable-diffusion-v1-5",
    name: "Stable Diffusion v1.5",
    size: "4.1GB",
    status: "available",
    type: "image"
  }
]

export function LocalAIIntegration() {
  const [isConnected, setIsConnected] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [models, setModels] = useState<LocalAIModel[]>(LOCALAI_MODELS)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isChatting, setIsChatting] = useState(false)
  const [localaiUrl, setLocalaiUrl] = useState("http://localhost:8080")
  const [healthStatus, setHealthStatus] = useState<any>(null)

  // Check LocalAI health
  const checkHealth = async () => {
    try {
      const response = await fetch(`${localaiUrl}/health`)
      if (response.ok) {
        const health = await response.json()
        setHealthStatus(health)
        setIsConnected(true)
        return true
      }
    } catch (error) {
      console.log("LocalAI not running:", error)
    }
    setIsConnected(false)
    setHealthStatus(null)
    return false
  }

  // Start LocalAI server
  const startLocalAI = async () => {
    setIsStarting(true)
    try {
      // This would typically start a LocalAI server process
      // For demo purposes, we'll simulate the startup
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Check if it's running
      const isRunning = await checkHealth()
      if (isRunning) {
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Failed to start LocalAI:", error)
    } finally {
      setIsStarting(false)
    }
  }

  // Download and run a model
  const runModel = async (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, status: 'downloading' } : model
    ))

    try {
      // Simulate model download and startup
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      setModels(prev => prev.map(model => 
        model.id === modelId ? { ...model, status: 'ready' } : model
      ))
      setSelectedModel(modelId)
    } catch (error) {
      setModels(prev => prev.map(model => 
        model.id === modelId ? { ...model, status: 'error' } : model
      ))
    }
  }

  // Send message to LocalAI
  const sendMessage = async () => {
    if (!currentMessage.trim() || !selectedModel || isChatting || !isConnected) return

    const userMessage = { role: 'user' as const, content: currentMessage }
    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage("")
    setIsChatting(true)

    try {
      const response = await fetch(`${localaiUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...chatMessages, userMessage],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage = { 
          role: 'assistant' as const, 
          content: data.choices[0]?.message?.content || "No response received"
        }
        setChatMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      const errorMessage = { 
        role: 'assistant' as const, 
        content: `Error: ${error.message}. Make sure LocalAI is running and the model is loaded.`
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsChatting(false)
    }
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [localaiUrl])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono">LocalAI Integration</h2>
          <p className="text-muted-foreground font-mono">Run AI models locally with LocalAI</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          {healthStatus && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              {healthStatus.models || 0} models
            </Badge>
          )}
        </div>
      </div>

      {/* Connection Setup */}
      <Card className="card-terminal">
        <CardHeader className="terminal-header">
          <CardTitle className="flex items-center gap-2 font-mono">
            <Server className="h-5 w-5" />
            LocalAI Server
          </CardTitle>
          <CardDescription className="font-mono text-sm">
            Connect to your LocalAI instance or start a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="terminal-content">
          <div className="space-y-4">
            <div>
              <Label htmlFor="localai-url" className="font-mono text-sm">LocalAI URL</Label>
              <Input
                id="localai-url"
                value={localaiUrl}
                onChange={(e) => setLocalaiUrl(e.target.value)}
                placeholder="http://localhost:8080"
                className="input-terminal font-mono text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={checkHealth}
                className="btn-terminal"
                disabled={isStarting}
              >
                <Activity className="h-4 w-4 mr-2" />
                Check Connection
              </Button>
              
              {!isConnected && (
                <Button
                  onClick={startLocalAI}
                  className="btn-terminal"
                  disabled={isStarting}
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start LocalAI
                    </>
                  )}
                </Button>
              )}
            </div>

            {!isConnected && (
              <div className="p-4 bg-muted rounded border">
                <h4 className="font-mono font-semibold mb-2">Quick Start Commands:</h4>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <code className="bg-background px-2 py-1 rounded">curl https://localai.io/install.sh | sh</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <code className="bg-background px-2 py-1 rounded">docker run -ti --name local-ai -p 8080:8080 localai/localai:latest</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <code className="bg-background px-2 py-1 rounded">local-ai run llama-3.2-1b-instruct:q4_k_m</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Models */}
      <Card className="card-terminal">
        <CardHeader className="terminal-header">
          <CardTitle className="flex items-center gap-2 font-mono">
            <Database className="h-5 w-5" />
            Available Models
          </CardTitle>
          <CardDescription className="font-mono text-sm">
            Download and run models locally
          </CardDescription>
        </CardHeader>
        <CardContent className="terminal-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedModel === model.id ? 'border-primary bg-primary/10' : 'hover:border-border'
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <h3 className="font-mono font-medium">{model.name}</h3>
                  </div>
                  <Badge 
                    variant={model.status === 'ready' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {model.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono mb-3">{model.size}</p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    runModel(model.id)
                  }}
                  disabled={model.status === 'downloading' || model.status === 'ready'}
                  className="w-full btn-terminal"
                  size="sm"
                >
                  {model.status === 'downloading' ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : model.status === 'ready' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Ready
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-2" />
                      Download & Run
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {selectedModel && isConnected && (
        <Card className="card-terminal">
          <CardHeader className="terminal-header">
            <CardTitle className="flex items-center gap-2 font-mono">
              <Zap className="h-5 w-5" />
              Chat with {models.find(m => m.id === selectedModel)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="terminal-content">
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto border rounded p-4 bg-muted">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground font-mono">
                    Start a conversation with your local AI model...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground ml-8' 
                            : 'bg-background border mr-8'
                        }`}
                      >
                        <div className="text-xs font-mono opacity-70 mb-1">
                          {message.role === 'user' ? 'You' : 'LocalAI'}
                        </div>
                        <div className="font-mono text-sm">{message.content}</div>
                      </div>
                    ))}
                    {isChatting && (
                      <div className="p-3 rounded bg-background border mr-8">
                        <div className="text-xs font-mono opacity-70 mb-1">LocalAI</div>
                        <div className="flex items-center gap-2 font-mono text-sm">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing...
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="input-terminal flex-1 font-mono text-sm min-h-[60px]"
                  disabled={isChatting}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || isChatting}
                  className="btn-terminal"
                >
                  {isChatting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
