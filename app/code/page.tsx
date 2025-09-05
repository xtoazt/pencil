"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code, Play, Copy, Download, Terminal, Brain, Zap, FileText, Settings, Monitor, Eye, Save, FolderOpen, RefreshCw, CheckCircle, AlertCircle, Loader2, Wand2, Cpu, Clock, Hash, Maximize2, Minimize2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getAvailableModels, getModelsByCategory, getRecommendedModel } from "@/lib/llm7"

const programmingLanguages = [
  { value: "javascript", label: "JavaScript", extension: ".js", icon: "🟨" },
  { value: "typescript", label: "TypeScript", extension: ".ts", icon: "🔷" },
  { value: "python", label: "Python", extension: ".py", icon: "🐍" },
  { value: "java", label: "Java", extension: ".java", icon: "☕" },
  { value: "cpp", label: "C++", extension: ".cpp", icon: "⚡" },
  { value: "csharp", label: "C#", extension: ".cs", icon: "🔷" },
  { value: "go", label: "Go", extension: ".go", icon: "🐹" },
  { value: "rust", label: "Rust", extension: ".rs", icon: "🦀" },
  { value: "php", label: "PHP", extension: ".php", icon: "🐘" },
  { value: "ruby", label: "Ruby", extension: ".rb", icon: "💎" },
  { value: "swift", label: "Swift", extension: ".swift", icon: "🦉" },
  { value: "kotlin", label: "Kotlin", extension: ".kt", icon: "🟣" },
  { value: "html", label: "HTML", extension: ".html", icon: "🌐" },
  { value: "css", label: "CSS", extension: ".css", icon: "🎨" },
  { value: "sql", label: "SQL", extension: ".sql", icon: "🗄️" },
]

const codeTemplates = [
  {
    title: "React Component",
    description: "Modern React component with TypeScript",
    language: "typescript",
    template: `import React from 'react';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const Component: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="component">
      <h2>{title}</h2>
      {children}
    </div>
  );
};`
  },
  {
    title: "API Endpoint",
    description: "REST API with error handling",
    language: "javascript",
    template: `const express = require('express');
const router = express.Router();

router.get('/api/endpoint', async (req, res) => {
  try {
    const result = await someAsyncOperation();
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;`
  },
  {
    title: "Database Model",
    description: "SQLAlchemy model with validation",
    language: "python",
    template: `from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Model(Base):
    __tablename__ = 'models'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Model {self.name}>'`
  },
  {
    title: "Utility Function",
    description: "Generic utility function",
    language: "javascript",
    template: `/**
 * Utility function description
 * @param {string} input - Input parameter
 * @returns {string} Processed output
 */
function utilityFunction(input) {
  if (!input) {
    throw new Error('Input is required');
  }
  
  return input.trim().toLowerCase();
}

module.exports = { utilityFunction };`
  }
]

export default function CodeStudioPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [selectedModel, setSelectedModel] = useState("codestral-2501")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")
  const [previewMode, setPreviewMode] = useState(false)
  const [codeHistory, setCodeHistory] = useState([])
  const [currentFile, setCurrentFile] = useState("main.js")
  const [availableModels, setAvailableModels] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    setAvailableModels(getAvailableModels())
  }, [])

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an expert ${selectedLanguage} developer. Generate clean, efficient, and well-commented code based on the user's request. Include proper error handling and best practices.`
            },
            {
              role: "user",
              content: `Generate ${selectedLanguage} code for: ${prompt}`
            }
          ],
          mode: "code",
          model: selectedModel
        }),
      })

      const data = await response.json()
      if (data.response) {
        setGeneratedCode(data.response)
        setCodeHistory(prev => [...prev, {
          id: Date.now(),
          prompt,
          code: data.response,
          language: selectedLanguage,
          model: selectedModel,
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error("Error generating code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const downloadCode = () => {
    const language = programmingLanguages.find(lang => lang.value === selectedLanguage)
    const filename = `${currentFile}${language?.extension || '.txt'}`
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const runCode = () => {
    // This would integrate with a code execution service
    console.log("Running code:", generatedCode)
  }

  const getRecommendedModelForLanguage = (language: string) => {
    const codingModels = getModelsByCategory("Coding Models")
    return codingModels[0] || "codestral-2501"
  }

  const getLanguageIcon = (lang: string) => {
    return programmingLanguages.find(l => l.value === lang)?.icon || "📄"
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
              <Terminal className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground monospace">CODE STUDIO</h1>
              <p className="text-muted-foreground">AI-powered code generation and development</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-accent border-accent">
              <Cpu className="h-3 w-3 mr-1" />
              {availableModels.length} Models
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
              {/* Input Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Code Generation
                  </CardTitle>
                  <CardDescription>
                    Describe what you want to build
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Language</Label>
                      <Select value={selectedLanguage} onValueChange={(value) => {
                        setSelectedLanguage(value)
                        setSelectedModel(getRecommendedModelForLanguage(value))
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {programmingLanguages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              <div className="flex items-center gap-2">
                                <span>{lang.icon}</span>
                                <span>{lang.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">AI Model</Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getModelsByCategory("Coding Models").map((model) => (
                            <SelectItem key={model} value={model}>
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{model}</span>
                                <Badge variant="outline" className="text-xs">Coding</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Code Description</Label>
                    <Textarea
                      placeholder="Describe the code you want to generate... (e.g., 'Create a function that validates email addresses with regex')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] monospace"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleGenerateCode} 
                      disabled={!prompt.trim() || isGenerating}
                      className="flex-1 button-minimal"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Code
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPrompt("")}
                      disabled={!prompt.trim()}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Code Output Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Generated Code
                    </div>
                    {generatedCode && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={downloadCode}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={runCode}>
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {getLanguageIcon(selectedLanguage)} {selectedLanguage.toUpperCase()} • {selectedModel}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedCode ? (
                    <div className="space-y-4">
                      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto monospace max-h-96">
                        <code>{generatedCode}</code>
                      </pre>
                      <div className="flex gap-2">
                        <Badge variant="outline">{selectedLanguage}</Badge>
                        <Badge variant="outline">{selectedModel}</Badge>
                        <Badge variant="outline">
                          <Hash className="h-3 w-3 mr-1" />
                          {generatedCode.split('\n').length} lines
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                      <div className="text-center">
                        <Code className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Generated code will appear here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preview Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Live Preview
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Real-time code preview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {previewMode && generatedCode ? (
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded min-h-48">
                        <div className="text-sm text-muted-foreground mb-2">Preview:</div>
                        <div className="text-sm">
                          {selectedLanguage === 'html' ? (
                            <div dangerouslySetInnerHTML={{ __html: generatedCode }} />
                          ) : (
                            <pre className="text-xs">{generatedCode}</pre>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                      <div className="text-center">
                        <Monitor className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Enable preview to see live results</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {codeTemplates.map((template, index) => (
                <Card key={index} className="card-minimal cursor-pointer hover:border-foreground/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="mb-3">
                      {getLanguageIcon(template.language)} {template.language.toUpperCase()}
                    </Badge>
                    <Button 
                      size="sm" 
                      className="w-full button-outline-minimal"
                      onClick={() => {
                        setSelectedLanguage(template.language)
                        setPrompt(template.template)
                        setActiveTab("generate")
                      }}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Code History
                </CardTitle>
                <CardDescription>
                  Your recent code generations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {codeHistory.length > 0 ? (
                  <div className="space-y-3">
                    {codeHistory.slice(0, 10).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border border-border rounded hover:bg-muted/50">
                        <div className="flex-shrink-0">
                          {getLanguageIcon(item.language)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.prompt}</p>
                          <p className="text-muted-foreground text-xs">
                            {item.language} • {item.model} • {item.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            setGeneratedCode(item.code)
                            setSelectedLanguage(item.language)
                            setSelectedModel(item.model)
                            setActiveTab("generate")
                          }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            navigator.clipboard.writeText(item.code)
                          }}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm">
                      No code history yet. Generate some code to see it here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Code Studio Settings
                </CardTitle>
                <CardDescription>
                  Customize your coding experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Default Settings</h3>
                    <div className="space-y-2">
                      <Label>Default Language</Label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {programmingLanguages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.icon} {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Default Model</Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="flex items-center gap-2">
                                <span>{model.name}</span>
                                <Badge variant="outline" className="text-xs">{model.provider}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-save generated code</span>
                        <Button size="sm" variant="outline">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Syntax highlighting</span>
                        <Button size="sm" variant="outline">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Code formatting</span>
                        <Button size="sm" variant="outline">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Live preview</span>
                        <Button size="sm" variant="outline">Enable</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}