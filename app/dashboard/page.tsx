"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  MessageSquare,
  Code,
  ImageIcon,
  Zap,
  Plus,
  History,
  BarChart3,
  Clock,
  Sparkles,
  TrendingUp,
  Users,
  Cpu,
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalChats: 0,
    totalProjects: 0,
    superModeUsage: 0,
    tokensUsed: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in-0 duration-700">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.name}
              </h1>
              <p className="text-muted-foreground">Ready to create something amazing with AI?</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Conversations",
              value: stats.totalChats,
              icon: MessageSquare,
              desc: "Across all AI modes",
              color: "text-blue-500",
            },
            {
              title: "Code Projects",
              value: stats.totalProjects,
              icon: Code,
              desc: "Generated and saved",
              color: "text-green-500",
            },
            {
              title: "Super Mode Uses",
              value: stats.superModeUsage,
              icon: Zap,
              desc: "Enhanced AI responses",
              color: "text-secondary",
            },
            {
              title: "API Usage",
              value: stats.tokensUsed.toLocaleString(),
              icon: BarChart3,
              desc: "Tokens processed",
              color: "text-purple-500",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="card-modern"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {isLoading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Modes Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">AI Modes</h2>
            <Badge variant="outline">
              <Cpu className="h-3 w-3 mr-1" />
              9 AI Models Available
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                href: "/chat?mode=chat",
                icon: MessageSquare,
                title: "Smart Chat",
                badge: "GPT-4",
                desc: "Intelligent conversations and Q&A with advanced AI",
                gradient: "from-blue-500/10 to-cyan-500/10",
                iconColor: "text-blue-500",
              },
              {
                href: "/chat?mode=code",
                icon: Code,
                title: "Code Assistant",
                badge: "Claude-3",
                desc: "Generate, debug, and optimize code in any language",
                gradient: "from-green-500/10 to-emerald-500/10",
                iconColor: "text-green-500",
              },
              {
                href: "/chat?mode=image",
                icon: ImageIcon,
                title: "Image Creator",
                badge: "FLUX",
                desc: "Create stunning images from text descriptions",
                gradient: "from-purple-500/10 to-pink-500/10",
                iconColor: "text-purple-500",
              },
              {
                href: "/chat?mode=super",
                icon: Zap,
                title: "Super Mode",
                badge: "9 Models",
                desc: "Enhanced responses using multiple AI models",
                gradient: "from-secondary/20 to-secondary/10",
                iconColor: "text-secondary",
                special: true,
              },
            ].map((mode, index) => (
              <Link key={index} href={mode.href}>
                <Card
                  className={`card-modern cursor-pointer ${mode.special ? "ring-2 ring-primary/20" : ""}`}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
                      <mode.icon className={`h-6 w-6 ${mode.iconColor}`} />
                    </div>
                    <CardTitle className="text-foreground">{mode.title}</CardTitle>
                    <Badge variant={mode.special ? "default" : "outline"}>
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
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
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
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
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

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Plus className="h-5 w-5 text-foreground" />
                </div>
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { href: "/chat?mode=chat", icon: MessageSquare, text: "Start New Chat" },
                { href: "/chat?mode=super", icon: Zap, text: "Try Super Mode" },
                { href: "/projects", icon: Code, text: "View Projects" },
              ].map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
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
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Sparkles className="h-5 w-5 text-foreground" />
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
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
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
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
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
      </div>
    </AppLayout>
  )
}
