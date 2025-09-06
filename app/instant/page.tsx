"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useInstantMode } from "@/hooks/use-instant-mode"
import { useState, useEffect } from "react"
import { 
  Zap, 
  Clipboard, 
  Eye, 
  EyeOff, 
  Play, 
  Pause, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Activity,
  Monitor,
  Smartphone,
  Gauge,
  Timer,
  Send,
  Type,
  MousePointer,
  Layers
} from "lucide-react"

export default function InstantModePage() {
  const {
    isActive,
    hasPermission,
    isProcessing,
    responses,
    settings,
    currentClipboard,
    currentTyping,
    clipboardResponse,
    typingResponse,
    finalResponse,
    toggleInstantMode,
    requestClipboardPermission,
    processClipboardContent,
    processTypingContent,
    processSendButton,
    updateSettings,
    handleTypingChange,
    clearContent
  } = useInstantMode()

  const [geminiStatus, setGeminiStatus] = useState({
    availableKeys: 0,
    averageResponseTime: 0,
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy'
  })

  const [userInput, setUserInput] = useState("")
  const [showSettings, setShowSettings] = useState(false)

  // Fetch Gemini status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/gemini/status')
        if (response.ok) {
          const data = await response.json()
          setGeminiStatus(data)
        }
      } catch (error) {
        console.error('Failed to fetch Gemini status:', error)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = async () => {
    if (!userInput.trim()) return
    
    await processSendButton(userInput.trim())
    setUserInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Remove Enter key functionality - only allow Send button
    if (e.key === 'Enter') {
      e.preventDefault()
      // Do nothing - user must click Send button
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500'
      case 'degraded': return 'bg-yellow-500'
      case 'unhealthy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'All Systems Operational'
      case 'degraded': return 'Some Delays Expected'
      case 'unhealthy': return 'Service Issues Detected'
      default: return 'Status Unknown'
    }
  }

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col h-full bg-background text-foreground">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Instant Mode</h1>
                  <p className="text-sm text-muted-foreground">Ultra-fast AI with 4-API system</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(geminiStatus.status)}`}></div>
                  <span className="text-xs text-muted-foreground">{getStatusText(geminiStatus.status)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* 4-API System Status */}
              <div className="p-6 border-b border-border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Clipboard className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">API 1: Clipboard</p>
                          <p className="text-xs text-muted-foreground">
                            {clipboardResponse ? 'Active' : 'Monitoring'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Type className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">API 2: Typing</p>
                          <p className="text-xs text-muted-foreground">
                            {typingResponse ? 'Active' : 'Monitoring'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <MousePointer className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">API 3: Send Button</p>
                          <p className="text-xs text-muted-foreground">Ready</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                          <Layers className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">API 4: Combine</p>
                          <p className="text-xs text-muted-foreground">
                            {finalResponse ? 'Active' : 'Standby'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Ultra-Fast AI Input</CardTitle>
                      <CardDescription>
                        Type your message and click Send (Enter key disabled for maximum speed)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={userInput}
                          onChange={(e) => {
                            setUserInput(e.target.value)
                            handleTypingChange(e.target.value)
                          }}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message here..."
                          className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!userInput.trim() || isProcessing}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {isProcessing && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted border-t-foreground"></div>
                          Processing with 4-API system...
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Responses Display */}
                  <div className="mt-6 space-y-4">
                    {clipboardResponse && (
                      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Clipboard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <CardTitle className="text-sm text-blue-800 dark:text-blue-200">Clipboard Response</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-blue-700 dark:text-blue-300">{clipboardResponse}</p>
                        </CardContent>
                      </Card>
                    )}

                    {typingResponse && (
                      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Type className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <CardTitle className="text-sm text-green-800 dark:text-green-200">Typing Response</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-green-700 dark:text-green-300">{typingResponse}</p>
                        </CardContent>
                      </Card>
                    )}

                    {finalResponse && (
                      <Card className="bg-primary/10 border-primary/20">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary" />
                            <CardTitle className="text-sm text-foreground">Final Combined Response</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-foreground">{finalResponse}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 border-l border-border bg-card/30">
              <div className="p-6 space-y-6">
                {/* Instant Mode Toggle */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Instant Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="instant-mode" className="text-foreground">
                        {isActive ? 'Active' : 'Inactive'}
                      </Label>
                      <Button
                        onClick={toggleInstantMode}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={isActive ? "bg-primary text-primary-foreground" : ""}
                      >
                        {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>

                    {!hasPermission && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Permission Required</p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300">Click to enable clipboard access</p>
                        </div>
                      </div>
                    )}

                    {hasPermission && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-xs font-medium text-green-800 dark:text-green-200">Always On</p>
                          <p className="text-xs text-green-700 dark:text-green-300">Clipboard monitoring active</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Clipboard Status */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Clipboard className="h-5 w-5" />
                      Clipboard Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Content Length:</span>
                      <Badge variant="outline" className="text-foreground border-border">
                        {currentClipboard.length} chars
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Updated:</span>
                      <span className="text-xs text-muted-foreground">
                        {currentClipboard ? new Date().toLocaleTimeString() : 'Never'}
                      </span>
                    </div>
                    {currentClipboard && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Current Content:</p>
                        <p className="text-xs text-foreground line-clamp-3">{currentClipboard}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Performance Stats */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Gauge className="h-5 w-5" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Available APIs:</span>
                      <Badge variant="outline" className="text-foreground border-border">
                        {geminiStatus.availableKeys}/12
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Response:</span>
                      <Badge variant="outline" className="text-foreground border-border">
                        {geminiStatus.averageResponseTime}ms
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge 
                        variant="outline" 
                        className={`border-border ${
                          geminiStatus.status === 'healthy' ? 'text-green-600 dark:text-green-400' :
                          geminiStatus.status === 'degraded' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {geminiStatus.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Responses */}
                {responses.length > 0 && (
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Responses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {responses.slice(0, 5).map((response) => (
                          <div key={response.id} className="p-2 bg-muted/30 rounded text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs border-border">
                                {response.source}
                              </Badge>
                              <span className="text-muted-foreground">{response.processingTime}ms</span>
                            </div>
                            <p className="text-foreground line-clamp-2">{response.content}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Clear Button */}
                <Button
                  onClick={clearContent}
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-muted"
                >
                  Clear All Content
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}