"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { MessageSquare, Code, ImageIcon, Zap, Plus, History, BarChart3, Clock, Sparkles } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalChats: 0,
    totalProjects: 0,
    superModeUsage: 0,
    tokensUsed: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Ready to create something amazing with AI?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChats}</div>
              <p className="text-xs text-muted-foreground">Across all AI modes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Code Projects</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">Generated and saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Super Mode Uses</CardTitle>
              <Zap className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.superModeUsage}</div>
              <p className="text-xs text-muted-foreground">Enhanced AI responses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Usage</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tokensUsed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Tokens processed</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Modes Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">AI Modes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/chat?mode=chat">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <CardTitle>Smart Chat</CardTitle>
                  <Badge variant="outline">GPT-4</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Intelligent conversations and Q&A with advanced AI
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/chat?mode=code">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Code className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <CardTitle>Code Assistant</CardTitle>
                  <Badge variant="outline">Specialized</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Generate, debug, and optimize code in any language
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/chat?mode=image">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <CardTitle>Image Creator</CardTitle>
                  <Badge variant="outline">FLUX</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Create stunning images from text descriptions
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/chat?mode=super">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary">
                <CardHeader className="text-center">
                  <Zap className="h-12 w-12 mx-auto mb-2 text-secondary" />
                  <CardTitle>Super Mode</CardTitle>
                  <Badge variant="secondary">Multi-AI</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">Enhanced responses using multiple AI models</CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity: any, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-muted-foreground text-xs">{activity.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No recent activity yet. Start a conversation to see your activity here.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/chat?mode=chat">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </Link>
              <Link href="/chat?mode=super">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Zap className="h-4 w-4 mr-2" />
                  Try Super Mode
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Code className="h-4 w-4 mr-2" />
                  View Projects
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Usage Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Monthly Usage
            </CardTitle>
            <CardDescription>Your AI usage this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Calls</span>
                <span>{stats.totalChats}/1000</span>
              </div>
              <Progress value={(stats.totalChats / 1000) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Super Mode Usage</span>
                <span>{stats.superModeUsage}/50</span>
              </div>
              <Progress value={(stats.superModeUsage / 50) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
