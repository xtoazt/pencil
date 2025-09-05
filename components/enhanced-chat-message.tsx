"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Bot } from "lucide-react"
import { CodeBlock } from "./code-block"
import { SuperModeResult } from "./super-mode-result"

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
  processingSteps?: any[]
  modelUsage?: any[]
  confidence?: number
  alternatives?: string[]
}

interface EnhancedChatMessageProps {
  message: Message
}

export function EnhancedChatMessage({ message }: EnhancedChatMessageProps) {
  const isUser = message.role === "user"

  // Detect if content contains code blocks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const hasCodeBlocks = codeBlockRegex.test(message.content)

  const renderContent = () => {
    if (message.type === "image" && message.imageUrl) {
      return (
        <div className="space-y-3">
          <p className="text-sm">{message.content}</p>
          <img
            src={message.imageUrl || "/placeholder.svg"}
            alt="Generated image"
            className="rounded-lg max-w-full h-auto"
          />
          {message.mode === "super" && message.reasoning && (
            <SuperModeResult
              reasoning={message.reasoning}
              processingSteps={message.processingSteps || []}
              modelUsage={message.modelUsage || []}
              confidence={message.confidence || 0.8}
              alternatives={message.alternatives}
            />
          )}
        </div>
      )
    }

    if (message.type === "code" && message.originalCode) {
      return (
        <div className="space-y-3">
          <p className="text-sm">{message.content}</p>
          <CodeBlock code={message.content} language="javascript" />
          {message.mode === "super" && message.reasoning && (
            <SuperModeResult
              reasoning={message.reasoning}
              processingSteps={message.processingSteps || []}
              modelUsage={message.modelUsage || []}
              confidence={message.confidence || 0.8}
              alternatives={message.alternatives}
            />
          )}
        </div>
      )
    }

    if (hasCodeBlocks && !isUser) {
      // Parse and render code blocks
      const parts = message.content.split(codeBlockRegex)
      const elements: React.ReactNode[] = []

      for (let i = 0; i < parts.length; i += 3) {
        const text = parts[i]
        const language = parts[i + 1]
        const code = parts[i + 2]

        if (text) {
          elements.push(
            <div key={`text-${i}`} className="whitespace-pre-wrap text-sm">
              {text}
            </div>,
          )
        }

        if (code) {
          elements.push(<CodeBlock key={`code-${i}`} code={code} language={language || "javascript"} />)
        }
      }

      return (
        <div className="space-y-3">
          {elements}
          {message.mode === "super" && message.reasoning && (
            <SuperModeResult
              reasoning={message.reasoning}
              processingSteps={message.processingSteps || []}
              modelUsage={message.modelUsage || []}
              confidence={message.confidence || 0.8}
              alternatives={message.alternatives}
            />
          )}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
        {message.mode === "super" && message.reasoning && !isUser && (
          <SuperModeResult
            reasoning={message.reasoning}
            processingSteps={message.processingSteps || []}
            modelUsage={message.modelUsage || []}
            confidence={message.confidence || 0.8}
            alternatives={message.alternatives}
          />
        )}
      </div>
    )
  }

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Bot className="h-4 w-4 text-secondary-foreground" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Card className={isUser ? "bg-primary text-primary-foreground" : ""}>
            <CardContent className="p-3">{renderContent()}</CardContent>
          </Card>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{message.timestamp.toLocaleTimeString()}</span>
            {message.mode && <Badge variant="outline">{message.mode.toUpperCase()}</Badge>}
            {message.confidence && (
              <Badge variant="secondary" className="text-xs">
                {Math.round(message.confidence * 100)}% confidence
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
