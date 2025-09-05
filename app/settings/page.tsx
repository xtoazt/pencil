"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { User, Palette, Bell, Zap, Settings } from "lucide-react"
import { AdvancedFeatures } from "@/components/advanced-features"
import { NotificationControls } from "@/components/notification-system"

export default function SettingsPage() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState({
    defaultMode: "chat",
    theme: "light",
    notifications: true,
    autoSave: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/user/preferences")
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error)
    }
  }

  const updatePreferences = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error("Failed to update preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary flex items-center justify-center">
            <Settings className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground monospace">SETTINGS</h1>
            <p className="text-muted-foreground">Manage your account and application preferences</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card className="card-minimal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={user?.name || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} readOnly />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Pro Plan</Badge>
                <span className="text-sm text-muted-foreground">Unlimited AI conversations</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Preferences */}
          <Card className="card-minimal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Preferences
              </CardTitle>
              <CardDescription>Configure your AI interaction preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultMode">Default AI Mode</Label>
                <Select
                  value={preferences.defaultMode}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, defaultMode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chat">Smart Chat</SelectItem>
                    <SelectItem value="code">Code Assistant</SelectItem>
                    <SelectItem value="image">Image Creator</SelectItem>
                    <SelectItem value="super">Super Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save Conversations</Label>
                  <p className="text-sm text-muted-foreground">Automatically save your chat history</p>
                </div>
                <Switch
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, autoSave: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="card-minimal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="card-minimal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about your AI interactions</p>
                </div>
                <Switch
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, notifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notification System</Label>
                  <p className="text-sm text-muted-foreground">Control the in-app notification system</p>
                </div>
                <NotificationControls />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <AdvancedFeatures />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={updatePreferences} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
