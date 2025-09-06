"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Calendar, 
  Activity, 
  Settings, 
  Edit3, 
  Save, 
  X,
  Crown,
  Zap,
  Code,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  Clock,
  Award,
  TrendingUp
} from "lucide-react"

interface UserStats {
  totalMessages: number
  totalCodeGenerations: number
  totalImages: number
  totalSuperMode: number
  joinDate: string
  lastActive: string
  favoriteModel: string
  totalTokens: number
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<UserStats | null>(null)

  useEffect(() => {
    if (user) {
      setEditedName(user.name)
      fetchUserStats()
    }
  }, [user])

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/profile/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      })

      if (response.ok) {
        setIsEditing(false)
        // Refresh user data
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditedName(user?.name || "")
    setIsEditing(false)
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Please sign in to view your profile</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground monospace">PROFILE</h1>
            <p className="text-muted-foreground">Manage your account and view your activity</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your personal account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                          id="name"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Enter your name"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSave} disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Saving..." : "Save"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        <p className="text-muted-foreground">@{user.username}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">User ID</Label>
                    <p className="font-mono text-sm">{user.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Username</Label>
                    <p className="font-mono text-sm">@{user.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Activity Statistics
                </CardTitle>
                <CardDescription>Your usage and activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border border-border rounded">
                      <MessageSquare className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">{stats.totalMessages}</div>
                      <div className="text-xs text-muted-foreground">Messages</div>
                    </div>
                    <div className="text-center p-4 border border-border rounded">
                      <Code className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">{stats.totalCodeGenerations}</div>
                      <div className="text-xs text-muted-foreground">Code Generated</div>
                    </div>
                    <div className="text-center p-4 border border-border rounded">
                      <ImageIcon className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">{stats.totalImages}</div>
                      <div className="text-xs text-muted-foreground">Images Created</div>
                    </div>
                    <div className="text-center p-4 border border-border rounded">
                      <Crown className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                      <div className="text-2xl font-bold">{stats.totalSuperMode}</div>
                      <div className="text-xs text-muted-foreground">Super Mode</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading activity statistics...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Plan</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Free
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Access</span>
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    Full
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Tokens</span>
                      <span className="font-mono text-sm">{stats.totalTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Favorite Model</span>
                      <span className="text-sm">{stats.favoriteModel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Member Since</span>
                      <span className="text-sm">{new Date(stats.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Active</span>
                      <span className="text-sm">{new Date(stats.lastActive).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  View History
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
