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
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl pencil-gradient pencil-glow flex items-center justify-center pencil-float">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold pencil-text-gradient">
                Welcome back, {user?.name}
              </h1>
              <p className="text-muted-foreground text-xl">Ready to create something amazing with AI?</p>
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
              className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 border-0 pencil-card animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-background/50 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
                  {isLoading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% this week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced AI Modes Grid */}
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700 delay-300">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">AI Modes</h2>
            <Badge variant="outline" className="animate-pulse">
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
                  className={`group hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:-translate-y-3 cursor-pointer border-0 pencil-card animate-in slide-in-from-bottom-4 ${mode.special ? "ring-2 ring-secondary/50 pencil-glow" : ""}`}
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="relative">
                      <div
                        className={`h-16 w-16 mx-auto mb-4 rounded-2xl bg-background/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${mode.iconColor}`}
                      >
                        <mode.icon className="h-8 w-8" />
                        {mode.special && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-ping" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{mode.title}</CardTitle>
                    <Badge variant={mode.special ? "secondary" : "outline"} className="animate-in fade-in-0 delay-500">
                      {mode.badge}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center group-hover:text-foreground/80 transition-colors">
                      {mode.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Enhanced Activity & Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700 delay-500">
          <Card className="border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <History className="h-5 w-5 text-primary" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity: any, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-in slide-in-from-left-4"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse"></div>
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
                <div className="text-center py-8 animate-in fade-in-0 delay-700">
                  <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm">
                    No recent activity yet. Start a conversation to see your activity here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Plus className="h-5 w-5 text-secondary" />
                </div>
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { href: "/chat?mode=chat", icon: MessageSquare, text: "Start New Chat", color: "hover:bg-blue-500/10" },
                { href: "/chat?mode=super", icon: Zap, text: "Try Super Mode", color: "hover:bg-secondary/10" },
                { href: "/projects", icon: Code, text: "View Projects", color: "hover:bg-green-500/10" },
              ].map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button
                    variant="outline"
                    className={`w-full justify-start bg-transparent border-0 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${action.color} animate-in slide-in-from-right-4`}
                    style={{ animationDelay: `${700 + index * 100}ms` }}
                  >
                    <action.icon className="h-4 w-4 mr-3" />
                    {action.text}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Usage Progress */}
        <Card className="border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-all duration-500 animate-in slide-in-from-bottom-8 delay-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              Monthly Usage
              <Badge variant="outline" className="ml-auto">
                Pro Plan
              </Badge>
            </CardTitle>
            <CardDescription>Your AI usage this month with intelligent insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  API Calls
                </span>
                <span className="font-mono">{stats.totalChats}/1000</span>
              </div>
              <Progress
                value={(stats.totalChats / 1000) * 100}
                className="h-3 bg-muted animate-in slide-in-from-left-4 delay-800"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  Super Mode Usage
                </span>
                <span className="font-mono">{stats.superModeUsage}/50</span>
              </div>
              <Progress
                value={(stats.superModeUsage / 50) * 100}
                className="h-3 bg-muted animate-in slide-in-from-left-4 delay-900"
              />
            </div>
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Peak usage: 2-4 PM</span>
                <span>Avg. session: 12 min</span>
                <span>Efficiency: 94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
