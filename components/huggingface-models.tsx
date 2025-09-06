"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Brain, 
  Download, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Zap,
  MessageSquare,
  Image,
  Code,
  FileText
} from "lucide-react"

interface HuggingFaceModel {
  id: string
  name: string
  type: 'text' | 'image' | 'code' | 'multimodal'
  size: string
  downloads: number
  tags: string[]
  description: string
  status: 'available' | 'downloading' | 'ready' | 'error'
}

const HUGGINGFACE_MODELS: HuggingFaceModel[] = [
  {
    id: "microsoft/DialoGPT-small",
    name: "DialoGPT Small",
    type: "text",
    size: "117MB",
    downloads: 8000000,
    tags: ["conversational", "gpt", "chat"],
    description: "Small conversational AI model for chat applications",
    status: "available"
  },
  {
    id: "microsoft/DialoGPT-medium",
    name: "DialoGPT Medium",
    type: "text",
    size: "345MB",
    downloads: 5000000,
    tags: ["conversational", "gpt", "chat"],
    description: "Medium conversational AI model for chat applications",
    status: "available"
  },
  {
    id: "Salesforce/codegen-350M-mono",
    name: "CodeGen 350M",
    type: "code",
    size: "1.3GB",
    downloads: 800000,
    tags: ["code-generation", "programming", "python"],
    description: "Code generation model for multiple programming languages",
    status: "available"
  },
  {
    id: "microsoft/CodeBERT-base",
    name: "CodeBERT Base",
    type: "code",
    size: "1.1GB",
    downloads: 1200000,
    tags: ["code-understanding", "bert", "nlp"],
    description: "BERT model trained on code for understanding programming languages",
    status: "available"
  },
  {
    id: "facebook/blenderbot-400M-distill",
    name: "BlenderBot 400M",
    type: "text",
    size: "1.5GB",
    downloads: 3000000,
    tags: ["conversational", "facebook", "chat"],
    description: "Facebook's conversational AI model",
    status: "available"
  },
  {
    id: "distilbert-base-uncased",
    name: "DistilBERT Base",
    type: "text",
    size: "267MB",
    downloads: 15000000,
    tags: ["bert", "nlp", "distilled"],
    description: "Distilled BERT model for general NLP tasks",
    status: "available"
  }
]

export function HuggingFaceModels() {
  const [models, setModels] = useState<HuggingFaceModel[]>(HUGGINGFACE_MODELS)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isChatting, setIsChatting] = useState(false)

  const filteredModels = models.filter(model => {
    const matchesType = selectedType === "all" || model.type === selectedType
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesType && matchesSearch
  })

  const downloadModel = async (modelId: string) => {
    setIsLoading(true)
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, status: 'downloading' } : model
    ))

    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setModels(prev => prev.map(model => 
        model.id === modelId ? { ...model, status: 'ready' } : model
      ))
    } catch (error) {
      setModels(prev => prev.map(model => 
        model.id === modelId ? { ...model, status: 'error' } : model
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const startChat = (modelId: string) => {
    setSelectedModel(modelId)
    setChatMessages([])
    setCurrentMessage("")
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || !selectedModel || isChatting) return

    const userMessage = { role: 'user' as const, content: currentMessage }
    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage("")
    setIsChatting(true)

    try {
      // Simulate API call to Hugging Face model
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: `This is a simulated response from ${selectedModel}. In a real implementation, this would call the Hugging Face Inference API or a local model endpoint.`
      }
      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = { 
        role: 'assistant' as const, 
        content: "Sorry, I encountered an error. Please try again."
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsChatting(false)
    }
  }

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'text': return <MessageSquare className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" />
      case 'code': return <Code className="h-4 w-4" />
      case 'multimodal': return <Brain className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <Download className="h-4 w-4" />
      case 'downloading': return <Loader2 className="h-4 w-4 animate-spin" />
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Download className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-blue-600 border-blue-600'
      case 'downloading': return 'text-yellow-600 border-yellow-600'
      case 'ready': return 'text-green-600 border-green-600'
      case 'error': return 'text-red-600 border-red-600'
      default: return 'text-gray-600 border-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono">Hugging Face Models</h2>
          <p className="text-muted-foreground font-mono">Browse and download AI models from Hugging Face</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Zap className="h-3 w-3 mr-1" />
          {models.filter(m => m.status === 'ready').length} Ready
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="font-mono">Search Models</Label>
          <Input
            id="search"
            placeholder="Search by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-terminal"
          />
        </div>
        <div className="w-48">
          <Label htmlFor="type-filter" className="font-mono">Model Type</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="input-terminal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="multimodal">Multimodal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <Card key={model.id} className="card-terminal">
            <CardHeader className="terminal-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getModelIcon(model.type)}
                  <CardTitle className="font-mono text-sm">{model.name}</CardTitle>
                </div>
                <Badge variant="outline" className={`text-xs ${getStatusColor(model.status)}`}>
                  {getStatusIcon(model.status)}
                  <span className="ml-1 capitalize">{model.status}</span>
                </Badge>
              </div>
              <CardDescription className="font-mono text-xs">
                {model.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="terminal-content">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">Size:</span>
                  <span className="font-mono">{model.size}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">Downloads:</span>
                  <span className="font-mono">{model.downloads.toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {model.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {model.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{model.tags.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => downloadModel(model.id)}
                    disabled={model.status === 'downloading' || model.status === 'ready'}
                    className="flex-1 btn-terminal"
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
                        Download
                      </>
                    )}
                  </Button>
                  {model.status === 'ready' && (
                    <Button
                      onClick={() => startChat(model.id)}
                      className="btn-terminal"
                      size="sm"
                    >
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="font-mono">No models found matching your criteria</p>
        </div>
      )}

      {/* Chat Interface */}
      {selectedModel && (
        <Card className="card-terminal mt-8">
          <CardHeader className="terminal-header">
            <CardTitle className="flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat with {models.find(m => m.id === selectedModel)?.name}
              </div>
              <Button
                onClick={() => setSelectedModel(null)}
                variant="outline"
                size="sm"
                className="btn-terminal"
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="terminal-content">
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto border rounded p-4 bg-muted">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground font-mono">
                    Start a conversation with the model...
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
                          {message.role === 'user' ? 'You' : 'Model'}
                        </div>
                        <div className="font-mono text-sm">{message.content}</div>
                      </div>
                    ))}
                    {isChatting && (
                      <div className="p-3 rounded bg-background border mr-8">
                        <div className="text-xs font-mono opacity-70 mb-1">Model</div>
                        <div className="flex items-center gap-2 font-mono text-sm">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Thinking...
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="input-terminal flex-1 font-mono text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
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
                    <MessageSquare className="h-4 w-4" />
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
