"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { getAvailableModels } from "@/lib/llm7"
import { TerminalAdComponent } from "@/components/ad-component"
import {
  MessageSquare,
  Terminal,
  ImageIcon,
  Brain,
  Plus,
  History,
  BarChart3,
  Clock,
  Cpu,
  TrendingUp,
  Users,
  Code,
  Palette,
  Settings,
  Zap
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalChats: 0,
    totalProjects: 0,
    superModeUsage: 0,
    totalTokens: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])
  const [availableModels, setAvailableModels] = useState([])

  useEffect(() => {
    fetchStats()
    fetchRecentActivity()
    setAvailableModels(getAvailableModels())
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/conversations/recent")
      if (response.ok) {
        const data = await response.json()
        setRecentActivity(data)
      }
    } catch (error) {
      console.error("Failed to fetch recent activity:", error)
    }
  }

  const aiModes = [
    {
      title: "Chat",
      description: "General conversation and Q&A",
      icon: MessageSquare,
      href: "/chat",
      badge: "GPT-4.1",
      iconColor: "text-foreground",
      special: false,
    },
    {
      title: "Code Studio",
      description: "AI-powered code generation",
      icon: Terminal,
      href: "/code",
      badge: "Codestral",
      iconColor: "text-foreground",
      special: true,
    },
    {
      title: "Image Lab",
      description: "AI image generation and editing",
      icon: ImageIcon,
      href: "/image",
      badge: "RTIST",
      iconColor: "text-foreground",
      special: false,
    },
    {
      title: "Super Mode",
      description: "Multi-model AI for complex tasks",
      icon: Brain,
      href: "/super",
      badge: "Advanced",
      iconColor: "text-accent",
      special: true,
    },
  ]

  const quickActions = [
    { href: "/chat", icon: MessageSquare, text: "Start New Chat" },
    { href: "/code", icon: Terminal, text: "Open Code Studio" },
    { href: "/super", icon: Brain, text: "Try Super Mode" },
  ]

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground monospace">
                WELCOME, {user?.name?.toUpperCase()}
              </h1>
              <p className="text-muted-foreground">Ready to create with AI?</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Chats",
              value: stats.totalChats,
              desc: "Conversations",
              icon: MessageSquare,
              color: "text-foreground",
            },
            {
              title: "Code Sessions",
              value: stats.totalProjects,
              desc: "Generated",
              icon: Terminal,
              color: "text-foreground",
            },
            {
              title: "Super Mode",
              value: stats.superModeUsage,
              desc: "Complex tasks",
              icon: Brain,
              color: "text-accent",
            },
            {
              title: "Tokens Used",
              value: stats.totalTokens,
              desc: "This month",
              icon: Cpu,
              color: "text-foreground",
            },
          ].map((stat, index) => (
            <Card key={index} className="card-minimal">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 bg-muted ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {isLoading ? <div className="h-8 w-16 bg-muted animate-pulse" /> : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Modes Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground monospace">AI TOOLS</h2>
            <Badge variant="outline" className="text-accent border-accent">
              <Cpu className="h-3 w-3 mr-1" />
              {availableModels.length} Models Available
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiModes.map((mode, index) => (
              <Link key={index} href={mode.href}>
                <Card className={`card-minimal cursor-pointer transition-all hover:border-foreground/30 ${mode.special ? "accent-border" : ""}`}>
                  <CardHeader className="text-center pb-4">
                    <div className="h-12 w-12 mx-auto mb-4 bg-muted flex items-center justify-center">
                      <mode.icon className={`h-6 w-6 ${mode.iconColor}`} />
                    </div>
                    <CardTitle className="text-foreground font-bold">{mode.title}</CardTitle>
                    <Badge variant={mode.special ? "default" : "outline"} className={mode.special ? "bg-accent text-accent-foreground" : ""}>
                      {mode.badge}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-muted-foreground">
                      {mode.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity & Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-minimal">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-muted">
                  <History className="h-5 w-5 text-foreground" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity: any, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-2 h-2 bg-accent"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
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
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm">
                    No recent activity yet. Start a conversation to see your activity here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-minimal">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-muted">
                  <Plus className="h-5 w-5 text-foreground" />
                </div>
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full justify-start button-outline-minimal"
                  >
                    <action.icon className="h-4 w-4 mr-3" />
                    {action.text}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Usage Progress */}
        <Card className="card-minimal">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-muted">
                <BarChart3 className="h-5 w-5 text-foreground" />
              </div>
              Monthly Usage
              <Badge variant="outline" className="ml-auto">
                Free Plan
              </Badge>
            </CardTitle>
            <CardDescription>Your AI usage this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary"></div>
                  API Calls
                </span>
                <span className="font-mono">{stats.totalChats}/1000</span>
              </div>
              <Progress
                value={(stats.totalChats / 1000) * 100}
                className="h-2"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent"></div>
                  Super Mode Usage
                </span>
                <span className="font-mono">{stats.superModeUsage}/50</span>
              </div>
              <Progress
                value={(stats.superModeUsage / 50) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ad Section */}
        <div className="flex justify-center">
          <TerminalAdComponent />
        </div>
      </div>
    </AppLayout>
  )
}