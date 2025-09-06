"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Cpu, 
  Github, 
  BookOpen, 
  Users, 
  Plus,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Settings,
  Monitor,
  Database,
  Globe,
  Terminal,
  Activity,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit3,
  Copy,
  Share2,
  Zap,
  Layers,
  Package,
  Code,
  Server,
  Cloud,
  Lock,
  Unlock,
  TrendingUp,
  Target,
  Lightbulb,
  Sparkles,
  Crown,
  Gem,
  Diamond,
  Star,
  Award,
  Trophy
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useDeployments } from "@/hooks/use-deployments"

interface Deployment {
  id: string
  name: string
  description: string
  framework: string
  modelType: string
  status: 'building' | 'deployed' | 'failed' | 'stopped'
  subdomain: string
  url: string
  createdAt: Date
  updatedAt: Date
  buildLogs: string[]
  deploymentConfig: {
    environment: string
    buildCommand: string
    startCommand: string
    port: number
  }
}

const frameworks = [
  { value: "react", label: "React", icon: "⚛️", description: "A JavaScript library for building user interfaces" },
  { value: "nextjs", label: "Next.js", icon: "▲", description: "Full-stack React framework" },
  { value: "vue", label: "Vue.js", icon: "💚", description: "Progressive JavaScript framework" },
  { value: "angular", label: "Angular", icon: "🅰️", description: "Platform for building mobile and desktop web applications" },
  { value: "svelte", label: "Svelte", icon: "🧡", description: "Cybernetically enhanced web apps" },
  { value: "express", label: "Express.js", icon: "🚀", description: "Fast, unopinionated web framework" },
  { value: "fastapi", label: "FastAPI", icon: "⚡", description: "Modern Python web framework" },
  { value: "django", label: "Django", icon: "🎸", description: "High-level Python web framework" },
  { value: "spring", label: "Spring Boot", icon: "🍃", description: "Java-based framework" },
  { value: "flutter", label: "Flutter", icon: "🦋", description: "UI toolkit for building natively compiled applications" }
]

const modelTypes = [
  { value: "llm", label: "Language Model", icon: "🧠", description: "Text generation and conversation" },
  { value: "image", label: "Image Generation", icon: "🎨", description: "AI image creation and editing" },
  { value: "code", label: "Code Assistant", icon: "💻", description: "Code generation and analysis" },
  { value: "audio", label: "Audio Processing", icon: "🎵", description: "Speech and audio generation" },
  { value: "video", label: "Video Generation", icon: "🎬", description: "Video creation and editing" },
  { value: "multimodal", label: "Multimodal", icon: "🌟", description: "Multiple input/output types" }
]

const deploymentTemplates = [
  {
    name: "PencilGPT Chat API",
    framework: "fastapi",
    modelType: "llm",
    description: "REST API for PencilGPT language model",
    template: {
      environment: "production",
      buildCommand: "pip install -r requirements.txt",
      startCommand: "uvicorn main:app --host 0.0.0.0 --port 3000",
      port: 3000
    }
  },
  {
    name: "PencilGPT Web Interface",
    framework: "nextjs",
    modelType: "llm",
    description: "Web interface for PencilGPT",
    template: {
      environment: "production",
      buildCommand: "npm run build",
      startCommand: "npm start",
      port: 3000
    }
  },
  {
    name: "PencilGPT Image API",
    framework: "express",
    modelType: "image",
    description: "Image generation API",
    template: {
      environment: "production",
      buildCommand: "npm install",
      startCommand: "node server.js",
      port: 3000
    }
  }
]

export default function OSSModePage() {
  const { user } = useAuth()
  const {
    deployments,
    stats,
    isLoading,
    error,
    createDeployment,
    stopDeployment,
    fetchDeploymentLogs
  } = useDeployments()
  
  const [activeTab, setActiveTab] = useState("overview")
  const [showNewDeployment, setShowNewDeployment] = useState(false)
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([])
  const [isCreatingDeployment, setIsCreatingDeployment] = useState(false)

  // New deployment form state
  const [newDeployment, setNewDeployment] = useState({
    name: "",
    description: "",
    framework: "react",
    modelType: "llm",
    deploymentConfig: {
      environment: "production",
      buildCommand: "npm run build",
      startCommand: "npm start",
      port: 3000
    }
  })

  const handleCreateDeployment = async () => {
    if (!newDeployment.name.trim()) return

    setIsCreatingDeployment(true)
    const result = await createDeployment(newDeployment)
    
    if (result) {
      setShowNewDeployment(false)
      setNewDeployment({
        name: "",
        description: "",
        framework: "react",
        modelType: "llm",
        deploymentConfig: {
          environment: "production",
          buildCommand: "npm run build",
          startCommand: "npm start",
          port: 3000
        }
      })
      setActiveTab("deployments")
    }
    setIsCreatingDeployment(false)
  }

  const handleStopDeployment = async (deploymentId: string) => {
    await stopDeployment(deploymentId)
  }

  const handleFetchLogs = async (deploymentId: string) => {
    const logs = await fetchDeploymentLogs(deploymentId)
    setDeploymentLogs(logs)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'building':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'deployed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'stopped':
        return <Pause className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'building':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'deployed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'stopped':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getFrameworkIcon = (framework: string) => {
    return frameworks.find(f => f.value === framework)?.icon || "📦"
  }

  const getModelTypeIcon = (modelType: string) => {
    return modelTypes.find(m => m.value === modelType)?.icon || "🤖"
  }

  const remainingDeployments = stats?.remainingSlots || 0

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Cpu className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4 text-balance tracking-tight">
            Open Source Mode
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Deploy and manage your PencilGPT models with full control over your open-source AI infrastructure.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-4">
              <Server className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{deployments.length}</div>
            <div className="text-sm text-muted-foreground">Total Deployments</div>
          </Card>
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold">
              {stats?.deployed || 0}
            </div>
            <div className="text-sm text-muted-foreground">Active Deployments</div>
          </Card>
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">
              {stats?.building || 0}
            </div>
            <div className="text-sm text-muted-foreground">Building</div>
          </Card>
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{remainingDeployments}</div>
            <div className="text-sm text-muted-foreground">Remaining Slots</div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center p-6 flex flex-col items-center justify-center">
                <Github className="h-12 w-12 text-foreground mb-4" />
                <CardTitle className="mb-2">GitHub Repository</CardTitle>
                <CardDescription className="mb-4">
                  Access the full source code and contribute to the project.
                </CardDescription>
                <Link href="https://github.com/xtoazt/pencil" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Github className="h-4 w-4" /> View on GitHub
                  </Button>
                </Link>
              </Card>

              <Card className="text-center p-6 flex flex-col items-center justify-center">
                <BookOpen className="h-12 w-12 text-foreground mb-4" />
                <CardTitle className="mb-2">Documentation</CardTitle>
                <CardDescription className="mb-4">
                  Dive deep into the architecture, APIs, and usage guides.
                </CardDescription>
                <Link href="/docs" target="_blank">
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" /> Read Docs
                  </Button>
                </Link>
              </Card>

              <Card className="text-center p-6 flex flex-col items-center justify-center">
                <Users className="h-12 w-12 text-foreground mb-4" />
                <CardTitle className="mb-2">Community Forum</CardTitle>
                <CardDescription className="mb-4">
                  Connect with other developers, ask questions, and share ideas.
                </CardDescription>
                <Link href="/community" target="_blank">
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" /> Join Community
                  </Button>
                </Link>
              </Card>
            </div>

            <div className="mt-16 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Why Open Source?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                PencilGPT embraces open source to foster transparency, collaboration, and innovation.
                By opening up core components, we empower developers to customize, extend, and
                contribute to the future of AI development.
              </p>
              <Button size="lg" className="gap-2" onClick={() => setActiveTab("deployments")}>
                Start Deploying <Crown className="h-5 w-5" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="deployments" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your Deployments</h2>
                <p className="text-muted-foreground">
                  Manage your PencilGPT model deployments
                </p>
              </div>
              <Button 
                onClick={() => setShowNewDeployment(true)}
                disabled={remainingDeployments <= 0}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Deployment
              </Button>
            </div>

            {showNewDeployment && (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Create New Deployment</CardTitle>
                  <CardDescription>
                    Deploy your PencilGPT model to a custom subdomain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Deployment Name</Label>
                      <Input
                        placeholder="my-pencilgpt-model"
                        value={newDeployment.name}
                        onChange={(e) => setNewDeployment(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Framework</Label>
                      <Select value={newDeployment.framework} onValueChange={(value) => 
                        setNewDeployment(prev => ({ ...prev, framework: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frameworks.map((framework) => (
                            <SelectItem key={framework.value} value={framework.value}>
                              <div className="flex items-center gap-2">
                                <span>{framework.icon}</span>
                                <span>{framework.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Model Type</Label>
                    <Select value={newDeployment.modelType} onValueChange={(value) => 
                      setNewDeployment(prev => ({ ...prev, modelType: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {modelTypes.map((modelType) => (
                          <SelectItem key={modelType.value} value={modelType.value}>
                            <div className="flex items-center gap-2">
                              <span>{modelType.icon}</span>
                              <span>{modelType.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe your PencilGPT model..."
                      value={newDeployment.description}
                      onChange={(e) => setNewDeployment(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateDeployment}
                      disabled={!newDeployment.name.trim() || isCreatingDeployment}
                      className="flex-1"
                    >
                      {isCreatingDeployment ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          Deploy Model
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowNewDeployment(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading deployments...</p>
              </div>
            ) : deployments.length === 0 ? (
              <Card className="text-center py-12">
                <Cloud className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No Deployments Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first PencilGPT deployment to get started
                </p>
                <Button onClick={() => setShowNewDeployment(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Deployment
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {deployments.map((deployment) => (
                  <Card key={deployment.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(deployment.status)}
                          <div>
                            <h3 className="font-semibold">{deployment.name}</h3>
                            <p className="text-sm text-muted-foreground">{deployment.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(deployment.status)}>
                          {deployment.status}
                        </Badge>
                        <Badge variant="outline">
                          {getFrameworkIcon(deployment.framework)} {deployment.framework}
                        </Badge>
                        <Badge variant="outline">
                          {getModelTypeIcon(deployment.modelType)} {deployment.modelType}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>pencilx.vercel.app/{deployment.subdomain}</span>
                        <span>Created {new Date(deployment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        {deployment.status === 'deployed' && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
                            </a>
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedDeployment(deployment)
                            handleFetchLogs(deployment.id)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Logs
                        </Button>
                        {deployment.status !== 'stopped' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStopDeployment(deployment.id)}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Deployment Templates</h2>
              <p className="text-muted-foreground">
                Quick-start templates for common PencilGPT deployments
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deploymentTemplates.map((template, index) => (
                <Card key={index} className="cursor-pointer hover:border-foreground/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>{getFrameworkIcon(template.framework)}</span>
                      {template.name}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <Badge variant="outline">
                        {getFrameworkIcon(template.framework)} {template.framework}
                      </Badge>
                      <Badge variant="outline">
                        {getModelTypeIcon(template.modelType)} {template.modelType}
                      </Badge>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        setNewDeployment({
                          name: template.name.toLowerCase().replace(/\s+/g, '-'),
                          description: template.description,
                          framework: template.framework,
                          modelType: template.modelType,
                          deploymentConfig: template.template
                        })
                        setShowNewDeployment(true)
                        setActiveTab("deployments")
                      }}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Join the PencilGPT Community</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Connect with developers, share your models, and contribute to the future of open-source AI.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <Github className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">GitHub</h3>
                  <p className="text-muted-foreground mb-4">
                    Contribute to the core PencilGPT codebase and submit your own models.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Github className="h-4 w-4 mr-2" />
                    View Repository
                  </Button>
                </Card>

                <Card className="p-6">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Discord</h3>
                  <p className="text-muted-foreground mb-4">
                    Join our Discord community for real-time discussions and support.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Join Discord
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Deployment Logs Modal */}
        {selectedDeployment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Deployment Logs</CardTitle>
                    <CardDescription>{selectedDeployment.name}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDeployment(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-auto">
                  {deploymentLogs.length === 0 ? (
                    <div className="text-gray-500">No logs available</div>
                  ) : (
                    deploymentLogs.map((log, index) => (
                      <div key={index} className="mb-1">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  )
}