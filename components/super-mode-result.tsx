"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Zap, Brain, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, BarChart3, Lightbulb } from "lucide-react"

interface ProcessingStep {
  step: number
  description: string
  model: string
  duration: number
  status: "completed" | "processing" | "failed"
}

interface ModelUsage {
  model: string
  purpose: string
  tokens: number
  confidence: number
}

interface SuperModeResultProps {
  reasoning: string
  processingSteps: ProcessingStep[]
  modelUsage: ModelUsage[]
  confidence: number
  alternatives?: string[]
}

export function SuperModeResult({
  reasoning,
  processingSteps,
  modelUsage,
  confidence,
  alternatives,
}: SuperModeResultProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showAlternatives, setShowAlternatives] = useState(false)

  const totalDuration = processingSteps.reduce((acc, step) => acc + step.duration, 0)
  const totalTokens = modelUsage.reduce((acc, usage) => acc + usage.tokens, 0)

  return (
    <div className="space-y-4">
      {/* Super Mode Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <Zap className="h-3 w-3" />
          Super Mode Enhanced
        </Badge>
        <Badge variant="outline" className="gap-1">
          <BarChart3 className="h-3 w-3" />
          {Math.round(confidence * 100)}% Confidence
        </Badge>
      </div>

      {/* AI Reasoning */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-secondary" />
            AI Analysis & Reasoning
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{reasoning}</p>
        </CardContent>
      </Card>

      {/* Processing Details */}
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Processing Details ({processingSteps.length} steps, {totalDuration}ms)
            </div>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          {processingSteps.map((step) => (
            <Card key={step.step} className="bg-muted/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {step.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {step.status === "failed" && <AlertCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm font-medium">Step {step.step}</span>
                    <Badge variant="outline" className="text-xs">
                      {step.model}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{step.duration}ms</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Model Usage Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Model Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {modelUsage.map((usage, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{usage.model}</span>
                  <span className="text-muted-foreground">- {usage.purpose}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{usage.tokens} tokens</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(usage.confidence * 100)}%
                  </Badge>
                </div>
              </div>
              <Progress value={usage.confidence * 100} className="h-1" />
            </div>
          ))}
          <div className="pt-2 border-t text-xs text-muted-foreground">Total tokens used: {totalTokens}</div>
        </CardContent>
      </Card>

      {/* Alternative Perspectives */}
      {alternatives && alternatives.length > 0 && (
        <Collapsible open={showAlternatives} onOpenChange={setShowAlternatives}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center gap-2 text-sm">
                <Lightbulb className="h-4 w-4" />
                Alternative Perspectives ({alternatives.length})
              </div>
              {showAlternatives ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {alternatives.map((alt, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="p-3">
                  <p className="text-sm">{alt}</p>
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
