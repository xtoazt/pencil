"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Zap, 
  Shield, 
  Activity,
  Cpu,
  Clock,
  TrendingUp,
  RotateCcw
} from "lucide-react"

interface ApiStatusProps {
  className?: string
}

export function ApiStatus({ className }: ApiStatusProps) {
  const [apiStatus, setApiStatus] = useState({
    currentKeyIndex: 0,
    totalKeys: 3,
    keyStatus: {},
    availableKeys: 3
  })
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchApiStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/status")
      if (response.ok) {
        const data = await response.json()
        setApiStatus(data.apiStatus)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch API status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApiStatus()
    // Refresh every 30 seconds
    const interval = setInterval(fetchApiStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getKeyStatusIcon = (keyIndex: number) => {
    const key = `key-${keyIndex}`
    const status = apiStatus.keyStatus[key]
    
    if (!status) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (status.exhausted) return <XCircle className="h-4 w-4 text-red-600" />
    if (status.errorCount > 0) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }

  const getKeyStatusColor = (keyIndex: number) => {
    const key = `key-${keyIndex}`
    const status = apiStatus.keyStatus[key]
    
    if (!status) return "border-green-200 bg-green-50"
    if (status.exhausted) return "border-red-200 bg-red-50"
    if (status.errorCount > 0) return "border-yellow-200 bg-yellow-50"
    return "border-green-200 bg-green-50"
  }

  const getKeyStatusText = (keyIndex: number) => {
    const key = `key-${keyIndex}`
    const status = apiStatus.keyStatus[key]
    
    if (!status) return "Active"
    if (status.exhausted) return "Exhausted"
    if (status.errorCount > 0) return `${status.errorCount} errors`
    return "Active"
  }

  return (
    <Card className={`card-minimal ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API Rotation System
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchApiStatus}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Intelligent API key rotation for maximum uptime and reliability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{apiStatus.availableKeys}</div>
            <div className="text-xs text-muted-foreground">Active Keys</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{apiStatus.currentKeyIndex + 1}</div>
            <div className="text-xs text-muted-foreground">Current Key</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{apiStatus.totalKeys}</div>
            <div className="text-xs text-muted-foreground">Total Keys</div>
          </div>
        </div>

        {/* API Keys Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">API Key Status</h4>
          {Array.from({ length: apiStatus.totalKeys }, (_, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 border rounded ${getKeyStatusColor(index)}`}
            >
              <div className="flex items-center gap-3">
                {getKeyStatusIcon(index)}
                <div>
                  <p className="text-sm font-medium">API Key {index + 1}</p>
                  <p className="text-xs text-muted-foreground">
                    {getKeyStatusText(index)}
                    {index === apiStatus.currentKeyIndex && " (Active)"}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {index === apiStatus.currentKeyIndex ? "Current" : "Standby"}
              </Badge>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">System Features</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Zap className="h-3 w-3 text-green-600" />
              Auto Rotation
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Shield className="h-3 w-3 text-blue-600" />
              Failover Protection
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Activity className="h-3 w-3 text-purple-600" />
              Real-time Monitoring
            </div>
            <div className="flex items-center gap-2 text-xs">
              <RotateCcw className="h-3 w-3 text-orange-600" />
              Auto Recovery
            </div>
          </div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="text-xs text-muted-foreground text-center">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
