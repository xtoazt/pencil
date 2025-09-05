"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, MessageSquare, Code, ImageIcon, Zap, Sparkles } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-balance">Welcome back, {user.name}</h1>
            <p className="text-xl text-muted-foreground mb-8">Ready to create something amazing?</p>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by Multiple AI Models
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-balance">
            Meet <span className="text-primary">Pencil AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            The ultimate AI development platform that combines chat, code generation, image creation, and our
            revolutionary Super Mode for unparalleled AI assistance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Smart Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Engage in intelligent conversations with advanced AI models for any topic or question.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Code Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate, review, and optimize code in multiple programming languages with AI assistance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Image Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create stunning images and artwork from text descriptions using advanced AI models.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <CardTitle className="text-lg">Super Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our revolutionary mode that combines multiple AI models for enhanced, comprehensive responses.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
