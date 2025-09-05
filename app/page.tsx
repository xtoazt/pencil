"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MessageSquare, Code, ImageIcon, Zap } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-medium mb-4 text-balance">Welcome back, {user.username}</h1>
            <p className="text-muted-foreground mb-8">Ready to create something amazing?</p>
            <Link href="/dashboard">
              <Button className="gap-2 h-10 px-6">
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
      <div className="container mx-auto px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-medium mb-6 text-balance tracking-tight">Pencil AI</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty leading-relaxed">
            The AI development platform that combines intelligent chat, code generation, image creation, and our
            revolutionary Super Mode.
          </p>

          <div className="flex gap-3 justify-center mb-20">
            <Link href="/signup">
              <Button className="gap-2 h-11 px-8">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="h-11 px-8 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-medium mb-2">Smart Chat</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Intelligent conversations with advanced AI models
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="font-medium mb-2">Code Generation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generate and optimize code in multiple languages
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h3 className="font-medium mb-2">Image Creation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create stunning images from text descriptions
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                <Zap className="h-6 w-6 text-background" />
              </div>
              <h3 className="font-medium mb-2">Super Mode</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Revolutionary multi-model AI for enhanced responses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
