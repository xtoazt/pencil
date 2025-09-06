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
  Timer
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
    toggleInstantMode,
    requestClipboardPermission,
    processInstantRequest,
    updateSettings,
    handleTypingChange,
    clearContent
  } = useInstantMode()

  const [geminiStatus, setGeminiStatus] = useState({
    availableKeys: 0,
    averageResponseTime: 0,
    health: 'unknown'
  })

  useEffect(() => {
    const fetchGeminiStatus = async () => {
      try {
        const response = await fetch("/api/gemini/status")
        if (response.ok) {
          const data = await response.json()
          setGeminiStatus({
            availableKeys: data.status.availableKeys,
            averageResponseTime: data.health.averageResponseTime,
            health: data.health.status
          })
        }
      } catch (error) {
        console.error("Failed to fetch Gemini status:", error)
      }
    }

    fetchGeminiStatus()
    const interval = setInterval(fetchGeminiStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary flex items-center justify-center">
            <Zap className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground monospace">INSTANT MODE</h1>
            <p className="text-muted-foreground">Ultra-fast AI responses with clipboard monitoring and predictive typing</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gemini Status */}
            <Card className="card-minimal border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Gauge className="h-5 w-5" />
                  Ultra-Fast Gemini Engine
                </CardTitle>
                <CardDescription className="text-green-700">
                  Powered by 7 rotating Gemini API keys for maximum speed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{geminiStatus.availableKeys}/7</div>
                    <div className="text-xs text-green-700">Active Keys</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {geminiStatus.averageResponseTime < 1000 
                        ? `${Math.round(geminiStatus.averageResponseTime)}ms` 
                        : `${(geminiStatus.averageResponseTime / 1000).toFixed(1)}s`}
                    </div>
                    <div className="text-xs text-green-700">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {geminiStatus.health === 'healthy' ? '⚡' : 
                       geminiStatus.health === 'degraded' ? '⚠️' : '❌'}
                    </div>
                    <div className="text-xs text-green-700 capitalize">{geminiStatus.health}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Status Card */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Instant Mode Status
                </CardTitle>
                <CardDescription>Monitor and control your instant AI experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="font-medium">Instant Mode</span>
                  </div>
                  <Button
                    onClick={toggleInstantMode}
                    variant={isActive ? "destructive" : "default"}
                    className={isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                  >
                    {isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clipboard className="h-4 w-4" />
                    <span className="text-sm">Clipboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasPermission ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <Switch
                      checked={settings.clipboardEnabled}
                      onCheckedChange={(checked) => updateSettings({ clipboardEnabled: checked })}
                      disabled={isActive}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-sm">Predictive</span>
                  </div>
                  <Switch
                    checked={settings.typingEnabled}
                    onCheckedChange={(checked) => updateSettings({ typingEnabled: checked })}
                    disabled={isActive}
                  />
                </div>
                </div>

                {isProcessing && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                    Processing instant request...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Input Area */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Instant Input
                </CardTitle>
                <CardDescription>Type here for instant AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Clipboard Content</Label>
                  <div className="p-3 bg-muted rounded border min-h-20 max-h-32 overflow-auto">
                    {currentClipboard ? (
                      <p className="text-sm">{currentClipboard}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No clipboard content detected</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Type for Instant Analysis</Label>
                  <Input
                    placeholder="Start typing for instant AI responses..."
                    value={currentTyping}
                    onChange={(e) => handleTypingChange(e.target.value)}
                    className="min-h-20"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => processInstantRequest(currentClipboard || currentTyping, 'clipboard')}
                    disabled={!currentClipboard && !currentTyping}
                    size="sm"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Process Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearContent}
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Responses */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Instant Responses
                </CardTitle>
                <CardDescription>Your latest instant AI responses</CardDescription>
              </CardHeader>
              <CardContent>
                {responses.length > 0 ? (
                  <div className="space-y-3">
                    {responses.map((response) => (
                      <div key={response.id} className="p-3 border border-border rounded">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {response.source === 'clipboard' ? (
                                <>
                                  <Clipboard className="h-3 w-3 mr-1" />
                                  Clipboard
                                </>
                              ) : (
                                <>
                                  <Brain className="h-3 w-3 mr-1" />
                                  Typing
                                </>
                              )}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {response.processingTime}ms
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {response.model}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(response.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{response.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No instant responses yet</p>
                    <p className="text-sm text-muted-foreground">Start typing or copy something to clipboard</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Response Delay (ms)</Label>
                  <Input
                    type="number"
                    value={settings.responseDelay}
                    onChange={(e) => updateSettings({ responseDelay: parseInt(e.target.value) || 500 })}
                    min="100"
                    max="2000"
                    step="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Max Clipboard Length</Label>
                  <Input
                    type="number"
                    value={settings.maxClipboardLength}
                    onChange={(e) => updateSettings({ maxClipboardLength: parseInt(e.target.value) || 1000 })}
                    min="100"
                    max="5000"
                    step="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Max Typing Length</Label>
                  <Input
                    type="number"
                    value={settings.maxTypingLength}
                    onChange={(e) => updateSettings({ maxTypingLength: parseInt(e.target.value) || 500 })}
                    min="50"
                    max="2000"
                    step="50"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Auto Process</Label>
                  <Switch
                    checked={settings.autoProcess}
                    onCheckedChange={(checked) => updateSettings({ autoProcess: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Preview</Label>
                  <Switch
                    checked={settings.showPreview}
                    onCheckedChange={(checked) => updateSettings({ showPreview: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Clipboard Access</span>
                  {hasPermission ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                
                {!hasPermission && (
                  <Button
                    size="sm"
                    onClick={requestClipboardPermission}
                    className="w-full"
                  >
                    Grant Permission
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Responses</span>
                  <span className="font-mono">{responses.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Response Time</span>
                  <span className="font-mono text-green-600">
                    {responses.length > 0 
                      ? Math.round(responses.reduce((acc, r) => acc + r.processingTime, 0) / responses.length)
                      : 0}ms
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fastest Response</span>
                  <span className="font-mono text-green-600">
                    {responses.length > 0 
                      ? Math.min(...responses.map(r => r.processingTime))
                      : 0}ms
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Clipboard Responses</span>
                  <span className="font-mono">
                    {responses.filter(r => r.source === 'clipboard').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Typing Responses</span>
                  <span className="font-mono">
                    {responses.filter(r => r.source === 'typing').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Gemini Engine</span>
                  <span className="font-mono text-green-600">
                    {geminiStatus.health === 'healthy' ? '⚡ Optimal' : 
                     geminiStatus.health === 'degraded' ? '⚠️ Good' : '❌ Issues'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
