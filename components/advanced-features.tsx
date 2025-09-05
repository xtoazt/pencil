"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { 
  Settings, 
  Palette, 
  Keyboard, 
  Mouse, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Zap, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Save, 
  Download, 
  Upload,
  Bell,
  BellOff,
  Shield,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Cpu,
  HardDrive,
  MemoryStick
} from "lucide-react"

interface AdvancedFeaturesProps {
  onSettingsChange?: (settings: any) => void
}

export function AdvancedFeatures({ onSettingsChange }: AdvancedFeaturesProps) {
  const [settings, setSettings] = useState({
    // Appearance
    theme: "light",
    fontSize: 14,
    lineHeight: 1.5,
    fontFamily: "monospace",
    showLineNumbers: true,
    showMinimap: true,
    wordWrap: true,
    
    // Performance
    enableAnimations: true,
    enableTransitions: true,
    enableHoverEffects: true,
    enableParallax: false,
    
    // Accessibility
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    
    // Audio
    enableSounds: false,
    soundVolume: 50,
    enableNotifications: true,
    notificationSound: true,
    
    // Advanced
    enableDebugMode: false,
    enableBetaFeatures: false,
    enableAnalytics: true,
    enableCrashReporting: true,
    
    // Security
    enableTwoFactor: false,
    sessionTimeout: 30,
    autoLogout: false,
    
    // Network
    offlineMode: false,
    syncFrequency: 5,
    enableCompression: true,
    
    // Hardware
    enableGPUAcceleration: true,
    enableHardwareAcceleration: true,
    maxMemoryUsage: 80,
  })

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("appearance")

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("advanced-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("advanced-settings", JSON.stringify(newSettings))
    onSettingsChange?.(newSettings)
  }

  const resetSettings = () => {
    const defaultSettings = {
      theme: "light",
      fontSize: 14,
      lineHeight: 1.5,
      fontFamily: "monospace",
      showLineNumbers: true,
      showMinimap: true,
      wordWrap: true,
      enableAnimations: true,
      enableTransitions: true,
      enableHoverEffects: true,
      enableParallax: false,
      highContrast: false,
      reduceMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      enableSounds: false,
      soundVolume: 50,
      enableNotifications: true,
      notificationSound: true,
      enableDebugMode: false,
      enableBetaFeatures: false,
      enableAnalytics: true,
      enableCrashReporting: true,
      enableTwoFactor: false,
      sessionTimeout: 30,
      autoLogout: false,
      offlineMode: false,
      syncFrequency: 5,
      enableCompression: true,
      enableGPUAcceleration: true,
      enableHardwareAcceleration: true,
      maxMemoryUsage: 80,
    }
    setSettings(defaultSettings)
    localStorage.setItem("advanced-settings", JSON.stringify(defaultSettings))
    onSettingsChange?.(defaultSettings)
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `advanced-settings-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
          localStorage.setItem("advanced-settings", JSON.stringify(importedSettings))
          onSettingsChange?.(importedSettings)
        } catch (error) {
          console.error("Failed to import settings:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "performance", label: "Performance", icon: Zap },
    { id: "accessibility", label: "Accessibility", icon: Eye },
    { id: "audio", label: "Audio", icon: Volume2 },
    { id: "security", label: "Security", icon: Shield },
    { id: "network", label: "Network", icon: Wifi },
    { id: "hardware", label: "Hardware", icon: Cpu },
  ]

  return (
    <Card className="card-minimal">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Features
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="outline" onClick={exportSettings}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={resetSettings}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Customize your experience with advanced settings
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Import Settings */}
          <div className="space-y-2">
            <Label>Import Settings</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="flex-1"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                size="sm"
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === "appearance" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={(value) => updateSetting("fontSize", value[0])}
                      min={10}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground">{settings.fontSize}px</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Line Height</Label>
                    <Slider
                      value={[settings.lineHeight]}
                      onValueChange={(value) => updateSetting("lineHeight", value[0])}
                      min={1}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground">{settings.lineHeight}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Show Line Numbers</Label>
                    <Switch
                      checked={settings.showLineNumbers}
                      onCheckedChange={(checked) => updateSetting("showLineNumbers", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Minimap</Label>
                    <Switch
                      checked={settings.showMinimap}
                      onCheckedChange={(checked) => updateSetting("showMinimap", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Word Wrap</Label>
                    <Switch
                      checked={settings.wordWrap}
                      onCheckedChange={(checked) => updateSetting("wordWrap", checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Enable Animations</Label>
                  <Switch
                    checked={settings.enableAnimations}
                    onCheckedChange={(checked) => updateSetting("enableAnimations", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enable Transitions</Label>
                  <Switch
                    checked={settings.enableTransitions}
                    onCheckedChange={(checked) => updateSetting("enableTransitions", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enable Hover Effects</Label>
                  <Switch
                    checked={settings.enableHoverEffects}
                    onCheckedChange={(checked) => updateSetting("enableHoverEffects", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enable Parallax</Label>
                  <Switch
                    checked={settings.enableParallax}
                    onCheckedChange={(checked) => updateSetting("enableParallax", checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === "accessibility" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>High Contrast</Label>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Reduce Motion</Label>
                  <Switch
                    checked={settings.reduceMotion}
                    onCheckedChange={(checked) => updateSetting("reduceMotion", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Screen Reader Support</Label>
                  <Switch
                    checked={settings.screenReader}
                    onCheckedChange={(checked) => updateSetting("screenReader", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Keyboard Navigation</Label>
                  <Switch
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => updateSetting("keyboardNavigation", checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === "audio" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Sounds</Label>
                  <Switch
                    checked={settings.enableSounds}
                    onCheckedChange={(checked) => updateSetting("enableSounds", checked)}
                  />
                </div>
                {settings.enableSounds && (
                  <div className="space-y-2">
                    <Label>Sound Volume</Label>
                    <Slider
                      value={[settings.soundVolume]}
                      onValueChange={(value) => updateSetting("soundVolume", value[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground">{settings.soundVolume}%</div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label>Enable Notifications</Label>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => updateSetting("enableNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Notification Sound</Label>
                  <Switch
                    checked={settings.notificationSound}
                    onCheckedChange={(checked) => updateSetting("notificationSound", checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Two-Factor Authentication</Label>
                  <Switch
                    checked={settings.enableTwoFactor}
                    onCheckedChange={(checked) => updateSetting("enableTwoFactor", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Slider
                    value={[settings.sessionTimeout]}
                    onValueChange={(value) => updateSetting("sessionTimeout", value[0])}
                    min={5}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">{settings.sessionTimeout} minutes</div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto Logout</Label>
                  <Switch
                    checked={settings.autoLogout}
                    onCheckedChange={(checked) => updateSetting("autoLogout", checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === "network" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Offline Mode</Label>
                  <Switch
                    checked={settings.offlineMode}
                    onCheckedChange={(checked) => updateSetting("offlineMode", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sync Frequency (minutes)</Label>
                  <Slider
                    value={[settings.syncFrequency]}
                    onValueChange={(value) => updateSetting("syncFrequency", value[0])}
                    min={1}
                    max={60}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">{settings.syncFrequency} minutes</div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enable Compression</Label>
                  <Switch
                    checked={settings.enableCompression}
                    onCheckedChange={(checked) => updateSetting("enableCompression", checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === "hardware" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>GPU Acceleration</Label>
                  <Switch
                    checked={settings.enableGPUAcceleration}
                    onCheckedChange={(checked) => updateSetting("enableGPUAcceleration", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Hardware Acceleration</Label>
                  <Switch
                    checked={settings.enableHardwareAcceleration}
                    onCheckedChange={(checked) => updateSetting("enableHardwareAcceleration", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Memory Usage (%)</Label>
                  <Slider
                    value={[settings.maxMemoryUsage]}
                    onValueChange={(value) => updateSetting("maxMemoryUsage", value[0])}
                    min={20}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">{settings.maxMemoryUsage}%</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
