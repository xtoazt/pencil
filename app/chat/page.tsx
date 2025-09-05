"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedChatMessage } from "@/components/enhanced-chat-message"
import {
  MessageSquare,
  Code,
  ImageIcon,
  Zap,
  Send,
  Loader2,
  Settings,
  Bot,
  Maximize2,
  AlignLeft,
  Paperclip,
  Mic,
  Palette,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  mode: string
  imageUrl?: string
  originalCode?: string
  reasoning?: string
  type?: string
}

const modeConfig = {
  chat: {
    icon: MessageSquare,
    title: "Smart Chat",
    description: "Intelligent conversations with GPT-4",
    color: "text-primary",
  },
  code: {
    icon: Code,
    title: "Code Assistant",
    description: "Generate and optimize code",
    color: "text-primary",
  },
  image: {
    icon: ImageIcon,
    title: "Image Creator",
    description: "Create images from text",
    color: "text-primary",
  },
  super: {
    icon: Zap,
    title: "Super Mode",
    description: "Enhanced multi-AI responses",
    color: "text-secondary",
  },
}

const codeLanguages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "c",
  "csharp",
  "php",
  "ruby",
  "go",
  "rust",
  "swift",
  "kotlin",
]

const responseStyles = [
  { value: "balanced", label: "Balanced" },
  { value: "creative", label: "Creative" },
  { value: "precise", label: "Precise" },
  { value: "detailed", label: "Detailed" },
]

const aiModels = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5", label: "GPT-3.5" },
  { value: "claude", label: "Claude" },
  { value: "gemini", label: "Gemini" },
]

export default function ChatPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "chat"
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [responseStyle, setResponseStyle] = useState("balanced")
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const config = modeConfig[mode as keyof typeof modeConfig] || modeConfig.chat
  const IconComponent = config.icon

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      mode,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          mode,
          language: selectedLanguage,
          model: selectedModel,
          style: responseStyle,
          history: messages.slice(-10),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
        mode,
        imageUrl: data.imageUrl,
        originalCode: data.originalCode,
        reasoning: data.reasoning,
        type: data.type,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        mode,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xl font-bold">
              <span className="bg-foreground text-background px-2 py-1 rounded">P</span>
              <span>E N C I L</span>
              <span className="text-orange-500">A I</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Palette className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center gap-2 mb-8">
          {Object.entries(modeConfig).map(([key, config]) => {
            const IconComponent = config.icon
            const isActive = mode === key
            return (
              <Button
                key={key}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => (window.location.href = `/chat?mode=${key}`)}
              >
                <IconComponent className="h-4 w-4" />
                {config.title}
              </Button>
            )
          })}
        </div>

        {/* Messages Area */}
        <div className="min-h-[60vh] mb-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-8">
                <IconComponent className={`h-16 w-16 mx-auto mb-4 ${config.color} opacity-50`} />
                <h2 className="text-2xl font-semibold mb-2 text-balance">
                  {mode === "super" ? "What's on your mind?" : `Ready to ${config.title.toLowerCase()}?`}
                </h2>
                <p className="text-muted-foreground text-pretty max-w-md mx-auto">{config.description}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((message) => (
              <EnhancedChatMessage key={message.id} message={message} />
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-secondary-foreground" />
                </div>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {mode === "super" ? "Processing with multiple AI models..." : "Thinking..."}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-4">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              {/* Model and Style Controls */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-24 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <Select value={responseStyle} onValueChange={setResponseStyle}>
                    <SelectTrigger className="w-28 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {responseStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {mode === "code" && (
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {codeLanguages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What's on your mind?"
                  disabled={loading}
                  className={`pr-32 ${isExpanded ? "min-h-24" : "h-12"} resize-none`}
                />

                {/* Input Controls */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    size="sm"
                    className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
