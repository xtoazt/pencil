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
        <div className="relative">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-foreground"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-foreground/20"></div>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
            <h1 className="text-3xl font-medium mb-4 text-balance">Welcome back, {user.username}</h1>
            <p className="text-muted-foreground mb-8">Ready to create something amazing?</p>
            <Link href="/dashboard">
              <Button className="gap-2 h-10 px-6 transition-all duration-300 hover:gap-3 hover:shadow-lg hover:shadow-foreground/10 active:scale-95">
                Go to Dashboard{" "}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
          <h1 className="text-6xl font-medium mb-6 text-balance tracking-tight animate-in fade-in duration-1000 slide-in-from-bottom-8">
            Pencil AI
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty leading-relaxed animate-in fade-in duration-1000 delay-200 slide-in-from-bottom-6">
            The AI development platform that combines intelligent chat, code generation, image creation, and our
            revolutionary Super Mode.
          </p>

          <div className="flex gap-3 justify-center mb-20 animate-in fade-in duration-1000 delay-400 slide-in-from-bottom-4">
            <Link href="/signup">
              <Button className="gap-2 h-11 px-8 transition-all duration-300 hover:gap-3 hover:shadow-lg hover:shadow-foreground/20 hover:scale-105 active:scale-95 group">
                Get Started{" "}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="h-11 px-8 bg-transparent transition-all duration-300 hover:bg-muted hover:shadow-md hover:scale-105 active:scale-95"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group animate-in fade-in duration-1000 delay-500 slide-in-from-bottom-4">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center transition-all duration-500 group-hover:bg-accent group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20 group-hover:-translate-y-1">
                <MessageSquare className="h-6 w-6 transition-all duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-medium mb-2 transition-colors duration-300 group-hover:text-foreground">
                Smart Chat
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                Intelligent conversations with advanced AI models
              </p>
            </div>

            <div className="text-center group animate-in fade-in duration-1000 delay-600 slide-in-from-bottom-4">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center transition-all duration-500 group-hover:bg-accent group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20 group-hover:-translate-y-1">
                <Code className="h-6 w-6 transition-all duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-medium mb-2 transition-colors duration-300 group-hover:text-foreground">
                Code Generation
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                Generate and optimize code in multiple languages
              </p>
            </div>

            <div className="text-center group animate-in fade-in duration-1000 delay-700 slide-in-from-bottom-4">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center transition-all duration-500 group-hover:bg-accent group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20 group-hover:-translate-y-1">
                <ImageIcon className="h-6 w-6 transition-all duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-medium mb-2 transition-colors duration-300 group-hover:text-foreground">
                Image Creation
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                Create stunning images from text descriptions
              </p>
            </div>

            <div className="text-center group animate-in fade-in duration-1000 delay-800 slide-in-from-bottom-4">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-foreground flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:-translate-y-1">
                <Zap className="h-6 w-6 text-background transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </div>
              <h3 className="font-medium mb-2 transition-colors duration-300 group-hover:text-foreground">
                Super Mode
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                Revolutionary multi-model AI for enhanced responses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
