"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  Cpu, 
  Download, 
  Upload, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Code,
  Database,
  Zap,
  Brain,
  Layers,
  Terminal,
  FileText,
  Github,
  GitBranch,
  Package
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

const ossFrameworks = [
  {
    id: "llama",
    name: "Llama 2/3",
    description: "Meta's open-source language models",
    size: "7B-70B parameters",
    icon: "🦙",
    status: "ready"
  },
  {
    id: "mistral",
    name: "Mistral 7B",
    description: "High-performance 7B parameter model",
    size: "7B parameters",
    icon: "🌪️",
    status: "ready"
  },
  {
    id: "codellama",
    name: "Code Llama",
    description: "Specialized for code generation",
    size: "7B-34B parameters",
    icon: "💻",
    status: "ready"
  },
  {
    id: "phi",
    name: "Microsoft Phi",
    description: "Compact and efficient models",
    size: "1.3B-3.8B parameters",
    icon: "Φ",
    status: "ready"
  },
  {
    id: "gemma",
    name: "Google Gemma",
    description: "Google's open-source models",
    size: "2B-7B parameters",
    icon: "💎",
    status: "ready"
  }
]

const trainingPresets = [
  {
    name: "Code Assistant",
    description: "Fine-tune for code generation and debugging",
    framework: "codellama",
    epochs: 3,
    learningRate: 0.0001,
    dataset: "code-dataset"
  },
  {
    name: "Creative Writer",
    description: "Fine-tune for creative writing and storytelling",
    framework: "llama",
    epochs: 5,
    learningRate: 0.00005,
    dataset: "creative-dataset"
  },
  {
    name: "Technical Expert",
    description: "Fine-tune for technical documentation and analysis",
    framework: "mistral",
    epochs: 4,
    learningRate: 0.0001,
    dataset: "technical-dataset"
  }
]

export default function OSSModePage() {
  const { user } = useAuth()
  const [selectedFramework, setSelectedFramework] = useState("llama")
  const [selectedPreset, setSelectedPreset] = useState("")
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [trainingStatus, setTrainingStatus] = useState("idle")
  const [customConfig, setCustomConfig] = useState({
    epochs: 3,
    learningRate: 0.0001,
    batchSize: 4,
    maxLength: 2048
  })

  const handleStartTraining = async () => {
    setIsTraining(true)
    setTrainingStatus("preparing")
    setTrainingProgress(0)

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          setTrainingStatus("completed")
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 1000)

    // Update status during training
    setTimeout(() => setTrainingStatus("training"), 2000)
    setTimeout(() => setTrainingStatus("optimizing"), 5000)
    setTimeout(() => setTrainingStatus("finalizing"), 8000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "training": return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error": return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-lg">
            <Cpu className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">OSS Mode</h1>
            <p className="text-muted-foreground">Train and deploy open-source AI models</p>
          </div>
        </div>

        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ossFrameworks.map((framework) => (
                <Card key={framework.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{framework.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{framework.name}</CardTitle>
                          <CardDescription>{framework.description}</CardDescription>
                        </div>
                      </div>
                      {getStatusIcon(framework.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">{framework.size}</Badge>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedFramework(framework.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Training Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Training Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your PencilGPT training parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="framework">Base Model</Label>
                    <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select base model" />
                      </SelectTrigger>
                      <SelectContent>
                        {ossFrameworks.map((framework) => (
                          <SelectItem key={framework.id} value={framework.id}>
                            {framework.icon} {framework.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="preset">Training Preset</Label>
                    <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select training preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainingPresets.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            {preset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="epochs">Epochs</Label>
                      <Input
                        id="epochs"
                        type="number"
                        value={customConfig.epochs}
                        onChange={(e) => setCustomConfig(prev => ({ ...prev, epochs: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="learningRate">Learning Rate</Label>
                      <Input
                        id="learningRate"
                        type="number"
                        step="0.0001"
                        value={customConfig.learningRate}
                        onChange={(e) => setCustomConfig(prev => ({ ...prev, learningRate: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="batchSize">Batch Size</Label>
                      <Input
                        id="batchSize"
                        type="number"
                        value={customConfig.batchSize}
                        onChange={(e) => setCustomConfig(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxLength">Max Length</Label>
                      <Input
                        id="maxLength"
                        type="number"
                        value={customConfig.maxLength}
                        onChange={(e) => setCustomConfig(prev => ({ ...prev, maxLength: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleStartTraining}
                    disabled={isTraining}
                    className="w-full"
                  >
                    {isTraining ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Training PencilGPT...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Training PencilGPT
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Training Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Training Progress
                  </CardTitle>
                  <CardDescription>
                    Monitor your PencilGPT training session
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isTraining ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(trainingProgress)}%</span>
                        </div>
                        <Progress value={trainingProgress} className="w-full" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                          <span className="text-sm font-medium">Status: {trainingStatus}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Training PencilGPT on {selectedFramework} base model...
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No training session active</p>
                      <p className="text-sm text-muted-foreground">Start training to see progress</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Deploy PencilGPT
                  </CardTitle>
                  <CardDescription>
                    Deploy your trained PencilGPT model
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Model Name</Label>
                    <Input placeholder="my-pencilgpt-model" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Deployment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deployment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API Endpoint</SelectItem>
                        <SelectItem value="docker">Docker Container</SelectItem>
                        <SelectItem value="serverless">Serverless Function</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Deploy PencilGPT
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Model Management
                  </CardTitle>
                  <CardDescription>
                    Manage your deployed PencilGPT models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">PencilGPT-Code</p>
                        <p className="text-sm text-muted-foreground">Code generation model</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">PencilGPT-Creative</p>
                        <p className="text-sm text-muted-foreground">Creative writing model</p>
                      </div>
                      <Badge variant="outline">Training</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    Open Source
                  </CardTitle>
                  <CardDescription>
                    Contribute to the PencilGPT ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded">
                      <Github className="h-5 w-5" />
                      <div>
                        <p className="font-medium">PencilGPT Core</p>
                        <p className="text-sm text-muted-foreground">Main training framework</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded">
                      <GitBranch className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Model Zoo</p>
                        <p className="text-sm text-muted-foreground">Pre-trained PencilGPT models</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded">
                      <Package className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Training Tools</p>
                        <p className="text-sm text-muted-foreground">Utilities and scripts</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentation
                  </CardTitle>
                  <CardDescription>
                    Learn how to train and deploy PencilGPT
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Getting Started Guide
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Code className="h-4 w-4 mr-2" />
                      API Documentation
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Dataset Preparation
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Configuration Reference
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
