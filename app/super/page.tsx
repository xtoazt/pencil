"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, Cpu, Clock, CheckCircle, AlertCircle, Loader2, Sparkles, Target, Layers } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface ProcessingStep {
  step: number
  description: string
  model: string
  duration: number
  status: "processing" | "completed" | "error"
}

interface ModelUsage {
  model: string
  purpose: string
  tokens: number
  confidence: number
}

interface SuperModeResult {
  type: string
  content: string
  reasoning: string
  processingSteps: ProcessingStep[]
  modelUsage: ModelUsage[]
  confidence: number
  alternatives?: string[]
}

export default function SuperModePage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<SuperModeResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")

  const handleSuperMode = async () => {
    if (!prompt.trim()) return

    setIsProcessing(true)
    setResult(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          mode: "super"
        }),
      })

      const data = await response.json()
      if (data.response) {
        setResult(data.response)
      }
    } catch (error) {
      console.error("Error in super mode:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const examplePrompts = [
    {
      title: "Complex Problem Solving",
      description: "Multi-step analysis and solution",
      prompt: "I need to build a scalable e-commerce platform. Help me design the architecture, choose the right technologies, and create a development roadmap."
    },
    {
      title: "Creative Writing",
      description: "Enhanced storytelling and content creation",
      prompt: "Write a compelling short story about a time traveler who discovers they can only travel to moments of great historical significance."
    },
    {
      title: "Technical Analysis",
      description: "Deep technical research and comparison",
      prompt: "Compare React, Vue, and Angular for building a large-scale enterprise application. Include performance, ecosystem, and team considerations."
    },
    {
      title: "Business Strategy",
      description: "Comprehensive business planning",
      prompt: "Create a business plan for a sustainable fashion startup, including market analysis, financial projections, and go-to-market strategy."
    },
    {
      title: "Code Architecture",
      description: "System design and implementation",
      prompt: "Design a microservices architecture for a social media platform with 10 million users, including database design and API specifications."
    },
    {
      title: "Research & Analysis",
      description: "In-depth research with multiple perspectives",
      prompt: "Analyze the impact of artificial intelligence on the job market over the next decade, considering different industries and skill sets."
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground monospace">SUPER MODE</h1>
              <p className="text-muted-foreground">Multi-model AI for complex tasks</p>
            </div>
          </div>
          <Badge variant="outline" className="text-accent border-accent">
            <Sparkles className="h-3 w-3 mr-1" />
            Advanced AI
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Super Mode Input
                  </CardTitle>
                  <CardDescription>
                    Describe your complex task for multi-model AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Task Description</label>
                    <Textarea
                      placeholder="Describe your complex task... (e.g., 'Design a complete mobile app architecture with backend, database, and deployment strategy')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>

                  <Button 
                    onClick={handleSuperMode} 
                    disabled={!prompt.trim() || isProcessing}
                    className="w-full button-minimal"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Start Super Mode
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Output Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Super Mode Result
                  </CardTitle>
                  <CardDescription>
                    Enhanced response from multiple AI models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{result.type}</Badge>
                        <Badge variant="outline">Confidence: {Math.round(result.confidence * 100)}%</Badge>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap">{result.content}</div>
                      </div>
                    </div>
                  ) : isProcessing ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse text-accent" />
                        <p className="text-muted-foreground">AI models are working together...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                      <div className="text-center">
                        <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Super mode result will appear here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Processing Steps */}
            {result && result.processingSteps && (
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Processing Steps
                  </CardTitle>
                  <CardDescription>
                    How the AI models worked together to solve your task
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.processingSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border border-border rounded">
                        <div className="flex-shrink-0">
                          {step.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-accent" />
                          ) : step.status === "error" ? (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          ) : (
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Step {step.step}</span>
                            <Badge variant="outline" className="text-xs">{step.model}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          {step.duration > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {step.duration}ms
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Model Usage */}
            {result && result.modelUsage && (
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Model Usage
                  </CardTitle>
                  <CardDescription>
                    AI models used and their contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.modelUsage.map((usage, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded">
                        <div>
                          <div className="font-medium">{usage.model}</div>
                          <div className="text-sm text-muted-foreground">{usage.purpose}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{usage.tokens} tokens</div>
                          <div className="text-xs text-muted-foreground">
                            Confidence: {Math.round(usage.confidence * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examplePrompts.map((example, index) => (
                <Card key={index} className="card-minimal cursor-pointer hover:border-foreground/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <CardDescription>{example.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{example.prompt}</p>
                    <Button 
                      size="sm" 
                      className="w-full button-outline-minimal"
                      onClick={() => {
                        setPrompt(example.prompt)
                        setActiveTab("generate")
                      }}
                    >
                      Use Example
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Super Mode Analysis
                </CardTitle>
                <CardDescription>
                  Understanding how Super Mode works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-border rounded">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <h3 className="font-medium mb-1">Multi-Model</h3>
                    <p className="text-sm text-muted-foreground">Uses multiple AI models for different aspects</p>
                  </div>
                  <div className="text-center p-4 border border-border rounded">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <h3 className="font-medium mb-1">Enhanced Quality</h3>
                    <p className="text-sm text-muted-foreground">Combines strengths of different models</p>
                  </div>
                  <div className="text-center p-4 border border-border rounded">
                    <Target className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <h3 className="font-medium mb-1">Task-Optimized</h3>
                    <p className="text-sm text-muted-foreground">Selects best models for each task type</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">How it works:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Analyzes your prompt to determine the best approach</li>
                    <li>Generates primary response using the most suitable model</li>
                    <li>Creates alternative perspectives with different models</li>
                    <li>Synthesizes all responses into a comprehensive answer</li>
                    <li>Provides confidence scores and processing details</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
