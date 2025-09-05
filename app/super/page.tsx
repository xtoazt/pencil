"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Brain, Loader2, CheckCircle, XCircle, Clock, Cpu, Zap, Settings, Maximize2, Minimize2, Eye, EyeOff, Download, Copy, RefreshCw, BarChart3, Target, Lightbulb, Layers, Sparkles, TrendingUp, Activity, AlertTriangle, Info, Star, Award, Trophy, Crown, Gem, Diamond } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getAvailableModels, getModelsByCategory, getRecommendedModel } from "@/lib/llm7"

interface ProcessingStep {
  step: number
  description: string
  model: string
  duration: number
  status: "processing" | "completed" | "failed"
  confidence?: number
  tokens?: number
}

interface ModelUsage {
  model: string
  purpose: string
  tokens: number
  confidence: number
  duration: number
}

interface SuperModeResult {
  type: "code" | "image" | "text" | "analysis" | "creative"
  content: string
  reasoning: string
  processingSteps: ProcessingStep[]
  modelUsage: ModelUsage[]
  confidence: number
  alternatives?: string[]
  insights?: string[]
  recommendations?: string[]
}

const superModePresets = [
  {
    title: "Market Analysis",
    description: "Comprehensive market research and analysis",
    prompt: "Analyze the current market trends for [industry] and provide strategic recommendations for growth.",
    models: ["deepseek-r1", "mistral-large-2411", "gpt-4.1-nano"],
    icon: "📊",
    category: "analysis"
  },
  {
    title: "Code Architecture",
    description: "Design and review software architecture",
    prompt: "Design a scalable architecture for [project type] with best practices and technology recommendations.",
    models: ["codestral-2501", "qwen2.5-coder", "mistral-large-2411"],
    icon: "🏗️",
    category: "code"
  },
  {
    title: "Creative Writing",
    description: "Multi-perspective creative content",
    prompt: "Create a compelling [content type] with multiple narrative perspectives and character development.",
    models: ["roblox-rp", "mistral-large-2411", "gpt-4.1-nano"],
    icon: "✍️",
    category: "creative"
  },
  {
    title: "Technical Research",
    description: "Deep technical investigation",
    prompt: "Conduct comprehensive research on [topic] with technical analysis and implementation strategies.",
    models: ["deepseek-r1", "mistral-large-2411", "gemini"],
    icon: "🔬",
    category: "analysis"
  },
  {
    title: "Problem Solving",
    description: "Multi-step problem resolution",
    prompt: "Solve this complex problem: [problem description] with step-by-step analysis and multiple solution approaches.",
    models: ["deepseek-r1", "mistral-large-2411", "nova-fast"],
    icon: "🧩",
    category: "analysis"
  },
  {
    title: "Content Strategy",
    description: "Comprehensive content planning",
    prompt: "Develop a complete content strategy for [brand/product] including audience analysis and content recommendations.",
    models: ["mistral-large-2411", "gpt-4.1-nano", "mistral-medium"],
    icon: "📝",
    category: "creative"
  }
]

export default function SuperModePage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [selectedPreset, setSelectedPreset] = useState("")
  const [responseContent, setResponseContent] = useState("")
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [modelUsage, setModelUsage] = useState<ModelUsage[]>([])
  const [overallConfidence, setOverallConfidence] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("generate")
  const [availableModels, setAvailableModels] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [customModels, setCustomModels] = useState([])
  const [processingTime, setProcessingTime] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)
  const [superModeHistory, setSuperModeHistory] = useState([])

  useEffect(() => {
    setAvailableModels(getAvailableModels())
  }, [])

  const handleSuperMode = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setResponseContent("")
    setProcessingSteps([])
    setModelUsage([])
    setOverallConfidence(0)
    setError(null)
    setProcessingTime(0)
    setTotalTokens(0)

    const startTime = Date.now()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          mode: "super",
        }),
      })

      const data = await response.json()
      if (data.response) {
        setResponseContent(data.response.content)
        setProcessingSteps(data.response.processingSteps || [])
        setModelUsage(data.response.modelUsage || [])
        setOverallConfidence(data.response.confidence * 100)
        setProcessingTime(Date.now() - startTime)
        setTotalTokens(data.response.modelUsage?.reduce((acc: number, usage: ModelUsage) => acc + usage.tokens, 0) || 0)
        
        setSuperModeHistory(prev => [...prev, {
          id: Date.now(),
          prompt,
          result: data.response,
          timestamp: new Date(),
          processingTime: Date.now() - startTime
        }])
      }
    } catch (err: any) {
      console.error("Super Mode error:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <Trophy className="h-4 w-4" />
    if (confidence >= 70) return <Award className="h-4 w-4" />
    return <AlertTriangle className="h-4 w-4" />
  }

  const copyResult = () => {
    navigator.clipboard.writeText(responseContent)
  }

  const downloadResult = () => {
    const resultData = {
      prompt,
      result: responseContent,
      processingSteps,
      modelUsage,
      confidence: overallConfidence,
      timestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(resultData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `super-mode-result-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent flex items-center justify-center">
              <Brain className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground monospace">SUPER MODE</h1>
              <p className="text-muted-foreground">Multi-model AI for complex tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-accent border-accent">
              <Crown className="h-3 w-3 mr-1" />
              Advanced AI
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
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
              {/* Input Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Super Mode Prompt
                  </CardTitle>
                  <CardDescription>
                    Describe your complex task or question
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Task Description</Label>
                    <Textarea
                      placeholder="Enter your complex task or question here (e.g., 'Analyze market trends for Q3 2024, predict future growth, and suggest a marketing strategy.')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  {showAdvanced && (
                    <div className="space-y-3 p-3 border border-border rounded">
                      <Label className="text-sm font-medium">Custom Model Selection</Label>
                      <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preset models" />
                        </SelectTrigger>
                        <SelectContent>
                          {superModePresets.map((preset) => (
                            <SelectItem key={preset.title} value={preset.title}>
                              {preset.icon} {preset.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSuperMode} 
                      disabled={!prompt.trim() || isLoading}
                      className="flex-1 button-minimal bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Activate Super Mode
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Steps */}
              {isLoading && processingSteps.length > 0 && (
                <Card className="card-minimal">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 animate-pulse" />
                      Processing Steps
                    </CardTitle>
                    <CardDescription>
                      Multi-model AI analysis in progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {processingSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border-l-2 border-accent bg-muted/20">
                        {step.status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {step.status === "processing" && <Loader2 className="h-5 w-5 animate-spin text-accent" />}
                        {step.status === "failed" && <XCircle className="h-5 w-5 text-red-600" />}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{step.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {step.model} {step.duration > 0 && `(${step.duration}ms)`}
                          </p>
                        </div>
                        {step.confidence && (
                          <Badge variant="outline" className="text-xs">
                            {step.confidence}%
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Results Panel */}
              {responseContent && (
                <Card className="card-minimal">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-accent" />
                        Super Mode Result
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={copyResult}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={downloadResult}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className={`${getConfidenceColor(overallConfidence)} border-current`}>
                          {getConfidenceIcon(overallConfidence)}
                          <span className="ml-1">Confidence: {overallConfidence.toFixed(1)}%</span>
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {processingTime}ms • {totalTokens} tokens
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-invert max-w-none text-foreground">
                      <p className="whitespace-pre-wrap">{responseContent}</p>
                    </div>
                    
                    {modelUsage.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-border">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <Layers className="h-5 w-5" />
                          Model Usage Analysis
                        </h3>
                        {modelUsage.map((usage, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded">
                            <div className="flex items-center gap-3">
                              <Cpu className="h-4 w-4 text-primary" />
                              <div>
                                <p className="font-medium text-sm">{usage.model}</p>
                                <p className="text-xs text-muted-foreground">{usage.purpose}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{usage.tokens} tokens</p>
                              <p className="text-xs text-muted-foreground">
                                {(usage.confidence * 100).toFixed(1)}% confidence
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {error && (
                <Card className="card-minimal border-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      Error
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-600">{error}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {superModePresets.map((preset, index) => (
                <Card key={index} className="card-minimal cursor-pointer hover:border-foreground/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{preset.icon}</span>
                      {preset.title}
                    </CardTitle>
                    <CardDescription>{preset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{preset.prompt}</p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{preset.category}</Badge>
                      <Badge variant="outline" className="text-xs">{preset.models.length} models</Badge>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full button-outline-minimal"
                      onClick={() => {
                        setPrompt(preset.prompt)
                        setActiveTab("generate")
                      }}
                    >
                      Use Preset
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Total Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{superModeHistory.length}</div>
                  <p className="text-sm text-muted-foreground">Super Mode uses</p>
                </CardContent>
              </Card>

              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Avg. Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {superModeHistory.length > 0 
                      ? Math.round(superModeHistory.reduce((acc: number, item: any) => acc + item.processingTime, 0) / superModeHistory.length)
                      : 0}ms
                  </div>
                  <p className="text-sm text-muted-foreground">Average time</p>
                </CardContent>
              </Card>

              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Models Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{availableModels.length}</div>
                  <p className="text-sm text-muted-foreground">Available models</p>
                </CardContent>
              </Card>

              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98%</div>
                  <p className="text-sm text-muted-foreground">Completion rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Super Mode History
                </CardTitle>
                <CardDescription>
                  Your advanced AI processing sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {superModeHistory.length > 0 ? (
                  <div className="space-y-3">
                    {superModeHistory.slice(0, 10).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border border-border rounded hover:bg-muted/50">
                        <div className="flex-shrink-0">
                          <Crown className="h-5 w-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.prompt}</p>
                          <p className="text-muted-foreground text-xs">
                            {item.timestamp.toLocaleTimeString()} • {item.processingTime}ms
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            setPrompt(item.prompt)
                            setActiveTab("generate")
                          }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            navigator.clipboard.writeText(item.result.content)
                          }}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Crown className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm">
                      No Super Mode history yet. Try a complex task to see it here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}