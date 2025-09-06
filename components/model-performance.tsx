"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Cpu, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  TrendingUp,
  Activity,
  Brain,
  Target,
  Gauge
} from "lucide-react"

interface ModelPerformanceProps {
  models: Array<{
    id: string
    name: string
    status: "idle" | "processing" | "completed" | "error"
    progress?: number
    tokens?: number
    confidence?: number
    duration?: number
    error?: string
  }>
  overallProgress?: number
  isProcessing?: boolean
}

export function ModelPerformance({ models, overallProgress = 0, isProcessing = false }: ModelPerformanceProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    if (isProcessing) {
      // More accurate progress animation with faster updates
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          const diff = overallProgress - prev
          if (diff <= 0) return overallProgress
          // Faster, more realistic progress increments
          return prev + Math.min(diff * 0.3 + Math.random() * 2, diff)
        })
      }, 50) // Faster updates every 50ms
      return () => clearInterval(interval)
    } else {
      setAnimatedProgress(overallProgress)
    }
  }, [overallProgress, isProcessing])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Cpu className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "border-blue-200 bg-blue-50"
      case "completed":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const completedModels = models.filter(m => m.status === "completed").length
  const processingModels = models.filter(m => m.status === "processing").length
  const errorModels = models.filter(m => m.status === "error").length

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card className="card-minimal">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Model Processing Status
          </CardTitle>
          <CardDescription>
            Real-time performance monitoring across all AI models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(animatedProgress)}%</span>
            </div>
            <Progress value={animatedProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedModels}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{processingModels}</div>
              <div className="text-xs text-muted-foreground">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errorModels}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Model Status */}
      <div className="grid gap-3">
        {models.map((model, index) => (
          <Card key={model.id} className={`card-minimal border-l-4 ${getStatusColor(model.status)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(model.status)}
                  <div>
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {model.status === "processing" && model.progress !== undefined && (
                        <span>Processing... {Math.round(model.progress)}%</span>
                      )}
                      {model.status === "completed" && (
                        <span>
                          {model.tokens && `${model.tokens} tokens`}
                          {model.duration && ` • ${model.duration}ms`}
                          {model.confidence && ` • ${Math.round(model.confidence * 100)}% confidence`}
                        </span>
                      )}
                      {model.status === "error" && (
                        <span className="text-red-600">{model.error}</span>
                      )}
                      {model.status === "idle" && (
                        <span>Ready</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {model.status === "processing" && model.progress !== undefined && (
                    <div className="w-16">
                      <Progress value={model.progress} className="h-1" />
                    </div>
                  )}
                  
                  {model.status === "completed" && model.confidence && (
                    <Badge variant="outline" className="text-xs">
                      <Target className="h-3 w-3 mr-1" />
                      {Math.round(model.confidence * 100)}%
                    </Badge>
                  )}

                  {model.status === "completed" && model.tokens && (
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      {model.tokens}
                    </Badge>
                  )}
                </div>
              </div>

              {model.status === "processing" && model.progress !== undefined && (
                <div className="mt-2">
                  <Progress value={model.progress} className="h-1" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      {completedModels > 0 && (
        <Card className="card-minimal">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">
                  {models.reduce((acc, m) => acc + (m.tokens || 0), 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Math.round(models.reduce((acc, m) => acc + (m.duration || 0), 0) / completedModels)}ms
                </div>
                <div className="text-xs text-muted-foreground">Avg Duration</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Math.round(models.reduce((acc, m) => acc + (m.confidence || 0), 0) / completedModels * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Avg Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Math.round((completedModels / models.length) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Hook for managing model performance state
export function useModelPerformance() {
  const [models, setModels] = useState<Array<{
    id: string
    name: string
    status: "idle" | "processing" | "completed" | "error"
    progress?: number
    tokens?: number
    confidence?: number
    duration?: number
    error?: string
  }>>([])

  const [overallProgress, setOverallProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const addModel = (id: string, name: string) => {
    setModels(prev => [...prev, {
      id,
      name,
      status: "idle"
    }])
  }

  const updateModelStatus = (id: string, updates: Partial<{
    status: "idle" | "processing" | "completed" | "error"
    progress?: number
    tokens?: number
    confidence?: number
    duration?: number
    error?: string
  }>) => {
    setModels(prev => prev.map(model => 
      model.id === id ? { ...model, ...updates } : model
    ))
  }

  const startProcessing = (modelIds: string[]) => {
    setIsProcessing(true)
    setOverallProgress(0)
    modelIds.forEach(id => {
      updateModelStatus(id, { status: "processing", progress: 0 })
    })
  }

  const completeProcessing = () => {
    setIsProcessing(false)
    setOverallProgress(100)
  }

  const resetModels = () => {
    setModels([])
    setOverallProgress(0)
    setIsProcessing(false)
  }

  // Calculate overall progress based on individual model progress
  useEffect(() => {
    if (models.length === 0) {
      setOverallProgress(0)
      return
    }

    const totalProgress = models.reduce((acc, model) => {
      if (model.status === "completed") return acc + 100
      if (model.status === "processing") return acc + (model.progress || 0)
      return acc
    }, 0)

    setOverallProgress(totalProgress / models.length)
  }, [models])

  return {
    models,
    overallProgress,
    isProcessing,
    addModel,
    updateModelStatus,
    startProcessing,
    completeProcessing,
    resetModels
  }
}
