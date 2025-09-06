"use client"

import { useState, useEffect, useRef } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Send, Bot, User, Settings, Brain, Zap, Copy, Download, RefreshCw, Loader2, Cpu, Clock, Hash, Maximize2, Minimize2, Eye, EyeOff, Volume2, VolumeX, Mic, MicOff, Paperclip, Smile, MoreHorizontal } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getAvailableModels, getModelsByCategory, getRecommendedModel } from "@/lib/llm7"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  model?: string
  tokens?: number
}

const chatPresets = [
  {
    title: "General Chat",
    description: "Casual conversation and Q&A",
    prompt: "Hello! I'm here to help with any questions or conversations you'd like to have.",
    model: "mistral-large-2411",
    icon: "💬"
  },
  {
    title: "Creative Writing",
    description: "Storytelling and creative content",
    prompt: "I'm a creative writing assistant. I can help you with stories, poems, scripts, and other creative content.",
    model: "roblox-rp",
    icon: "✍️"
  },
  {
    title: "Technical Analysis",
    description: "Deep technical discussions",
    prompt: "I'm a technical analysis expert. I can help with complex technical problems, research, and analysis.",
    model: "deepseek-r1",
    icon: "🔬"
  },
  {
    title: "Quick Answers",
    description: "Fast, concise responses",
    prompt: "I provide quick, accurate answers to your questions.",
    model: "nova-fast",
    icon: "⚡"
  },
  {
    title: "Learning Assistant",
    description: "Educational explanations",
    prompt: "I'm a learning assistant. I can explain complex topics in simple terms and help you understand new concepts.",
    model: "mistral-medium",
    icon: "🎓"
  },
  {
    title: "Problem Solver",
    description: "Step-by-step problem solving",
    prompt: "I'm a problem-solving expert. I can break down complex problems into manageable steps and guide you through solutions.",
    model: "mistral-large-2411",
    icon: "🧩"
  }
]

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [selectedModel, setSelectedModel] = useState("mistral-large-2411")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [availableModels, setAvailableModels] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showModelInfo, setShowModelInfo] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setAvailableModels(getAvailableModels())
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsGenerating(true)
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: "user", content: inputMessage }
          ],
          mode: "chat",
          model: selectedModel,
          conversationId: currentConversationId,
          saveToHistory: true
        }),
      })

      const data = await response.json()
      if (data.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          model: selectedModel,
          tokens: data.tokens
        }
        setMessages(prev => [...prev, assistantMessage])
        
        // Set conversation ID if this is a new conversation
        if (data.conversationId && !currentConversationId) {
          setCurrentConversationId(data.conversationId)
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsGenerating(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setCurrentConversationId(null)
  }

  const exportChat = () => {
    const chatData = {
      messages,
      timestamp: new Date().toISOString(),
      model: selectedModel
    }
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const getModelInfo = (modelId: string) => {
    return availableModels.find((model: any) => model.id === modelId)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground monospace">CHAT</h1>
              <p className="text-muted-foreground">Intelligent conversation with AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-accent border-accent">
              <Cpu className="h-3 w-3 mr-1" />
              {availableModels.length} Models
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
              {/* Chat Interface */}
              <div className={`${isFullscreen ? 'col-span-1' : 'lg:col-span-3'}`}>
                <Card className="card-minimal">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Conversation
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={clearChat}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={exportChat}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {messages.length} messages • {selectedModel}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Messages */}
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {messages.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Start a conversation with AI</p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  message.role === "user" 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-muted text-muted-foreground"
                                }`}>
                                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div className={`space-y-1 ${message.role === "user" ? "text-right" : "text-left"}`}>
                                  <div className={`p-3 rounded-lg ${
                                    message.role === "user"
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground"
                                  }`}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{message.timestamp.toLocaleTimeString()}</span>
                                    {message.model && (
                                      <>
                                        <span>•</span>
                                        <span>{message.model}</span>
                                      </>
                                    )}
                                    {message.tokens && (
                                      <>
                                        <span>•</span>
                                        <span>{message.tokens} tokens</span>
                                      </>
                                    )}
              <Button
                size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={() => copyMessage(message.content)}
                                    >
                                      <Copy className="h-3 w-3" />
              </Button>
                                  </div>
        </div>
                  </div>
                </div>
                          ))
                        )}
                        {isTyping && (
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
              </div>
            </div>
          )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Type your message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="min-h-[60px] resize-none"
                            disabled={isGenerating}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isGenerating}
                            className="button-minimal"
                          >
                            {isGenerating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Press Enter to send, Shift+Enter for new line</span>
                          <span>{inputMessage.length} characters</span>
              </div>
                </div>
                    </div>
                  </CardContent>
                </Card>
        </div>

              {/* Sidebar */}
              {!isFullscreen && (
                <div className="lg:col-span-1 space-y-4">
                  {/* Model Selection */}
                  <Card className="card-minimal">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cpu className="h-5 w-5" />
                        AI Model
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                          {availableModels.map((model: any) => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{model.name}</span>
                                <Badge variant="outline" className="text-xs">{model.provider}</Badge>
                              </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                      {showModelInfo && (
                        <div className="text-xs text-muted-foreground">
                          <p>{getModelInfo(selectedModel)?.description}</p>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowModelInfo(!showModelInfo)}
                        className="w-full"
                      >
                        {showModelInfo ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {showModelInfo ? "Hide" : "Show"} Info
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="card-minimal">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Chat
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Chat
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Chat Stats */}
                  <Card className="card-minimal">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Messages:</span>
                        <span>{messages.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Characters:</span>
                        <span>{messages.reduce((acc, msg) => acc + msg.content.length, 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tokens:</span>
                        <span>{messages.reduce((acc, msg) => acc + (msg.tokens || 0), 0)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chatPresets.map((preset, index) => (
                <Card key={index} className="card-minimal cursor-pointer hover:border-foreground/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{preset.icon}</span>
                      {preset.title}
                    </CardTitle>
                    <CardDescription>{preset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="mb-3">
                      {preset.model}
                    </Badge>
                    <Button 
                      size="sm" 
                      className="w-full button-outline-minimal"
                      onClick={() => {
                        setSelectedModel(preset.model)
                        setInputMessage(preset.prompt)
                        setActiveTab("chat")
                      }}
                    >
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Chat History
                </CardTitle>
                <CardDescription>
                  Your recent conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm">
                    Chat history will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Chat Settings
                </CardTitle>
                <CardDescription>
                  Customize your chat experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Model Settings</h3>
                    <div className="space-y-2">
                      <Label>Default Model</Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                          {availableModels.map((model: any) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Interface</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show model info</span>
                        <Button size="sm" variant="outline">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-scroll</span>
                        <Button size="sm" variant="outline">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Typing indicators</span>
                        <Button size="sm" variant="outline">Enable</Button>
                      </div>
                    </div>
                  </div>
                </div>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}