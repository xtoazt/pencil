"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Brain, 
  Cpu, 
  Server, 
  Globe, 
  Code, 
  Zap, 
  Shield, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

export default function OSSDocsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/oss" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to OSS Mode
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">OSS Mode Documentation</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Learn how to train and deploy your own PencilGPT models
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Start
            </CardTitle>
            <CardDescription>
              Get your PencilGPT model deployed in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Train Your Model</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with PencilGPT to generate at least 20 messages for training data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Create Deployment</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your framework and model type, then deploy your trained model
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Access Your Model</h3>
                  <p className="text-sm text-muted-foreground">
                    Your model gets a custom subdomain like pencilx.vercel.app/your-model
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Training Requirements
            </CardTitle>
            <CardDescription>
              What you need to know about training your PencilGPT model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Minimum Requirements
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    At least 20 user messages across all conversations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Messages from different conversation topics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Variety in message length and complexity
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  Training Tips
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Ask questions about different topics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Use various conversation modes (chat, code, image)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Provide feedback on responses
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Deployment Options
            </CardTitle>
            <CardDescription>
              Choose the right framework and model type for your needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Supported Frameworks</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 border rounded">
                  <span className="text-2xl">⚛️</span>
                  <div>
                    <div className="font-medium">React</div>
                    <div className="text-sm text-muted-foreground">Frontend applications</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <span className="text-2xl">▲</span>
                  <div>
                    <div className="font-medium">Next.js</div>
                    <div className="text-sm text-muted-foreground">Full-stack React apps</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <span className="text-2xl">💚</span>
                  <div>
                    <div className="font-medium">Vue.js</div>
                    <div className="text-sm text-muted-foreground">Progressive web apps</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-medium">FastAPI</div>
                    <div className="text-sm text-muted-foreground">Python APIs</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Model Types</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 border rounded">
                  <span className="text-2xl">🧠</span>
                  <div>
                    <div className="font-medium">Language Model</div>
                    <div className="text-sm text-muted-foreground">Text generation and conversation</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <span className="text-2xl">💻</span>
                  <div>
                    <div className="font-medium">Code Assistant</div>
                    <div className="text-sm text-muted-foreground">Code generation and analysis</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <div className="font-medium">Image Generation</div>
                    <div className="text-sm text-muted-foreground">AI image creation</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <div className="font-medium">Multimodal</div>
                    <div className="text-sm text-muted-foreground">Multiple input/output types</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limits and Pricing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Limits and Access
            </CardTitle>
            <CardDescription>
              Understanding deployment limits and access levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Deployment Limits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">3</Badge>
                    Maximum active deployments per user
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">20</Badge>
                    Minimum training messages required
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Unlimited</Badge>
                    Training conversations
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Access Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    Custom subdomain routing
                  </li>
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-green-600" />
                    Full API access
                  </li>
                  <li className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-green-600" />
                    Real-time deployment logs
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Troubleshooting
            </CardTitle>
            <CardDescription>
              Common issues and solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">"Training requirement not met"</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You need at least 20 messages to deploy your model.
                </p>
                <p className="text-sm">
                  <strong>Solution:</strong> Use the chat, code, or image modes to generate more conversations. Each user message counts toward your training data.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">"Deployment limit reached"</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You've reached the maximum of 3 active deployments.
                </p>
                <p className="text-sm">
                  <strong>Solution:</strong> Stop an existing deployment or wait for one to complete before creating a new one.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Deployment stuck in "building" status</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Your deployment is taking longer than expected.
                </p>
                <p className="text-sm">
                  <strong>Solution:</strong> Check the deployment logs for specific error messages. Most deployments complete within 5-10 minutes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Help */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Getting Help
            </CardTitle>
            <CardDescription>
              Resources and support for OSS Mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Documentation</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive guides and API references
                </p>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Docs
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Community Support</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get help from the PencilGPT community
                </p>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Discord
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
