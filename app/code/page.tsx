"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Play, Copy, Download, Terminal, Brain, Zap, FileText, Settings } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

const programmingLanguages = [
  { value: "javascript", label: "JavaScript", extension: ".js" },
  { value: "typescript", label: "TypeScript", extension: ".ts" },
  { value: "python", label: "Python", extension: ".py" },
  { value: "java", label: "Java", extension: ".java" },
  { value: "cpp", label: "C++", extension: ".cpp" },
  { value: "csharp", label: "C#", extension: ".cs" },
  { value: "go", label: "Go", extension: ".go" },
  { value: "rust", label: "Rust", extension: ".rs" },
  { value: "php", label: "PHP", extension: ".php" },
  { value: "ruby", label: "Ruby", extension: ".rb" },
  { value: "swift", label: "Swift", extension: ".swift" },
  { value: "kotlin", label: "Kotlin", extension: ".kt" },
]

const codeTemplates = [
  {
    title: "React Component",
    description: "Create a modern React component with TypeScript",
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
    description: "Create a REST API endpoint with error handling",
    language: "javascript",
    template: `const express = require('express');
const router = express.Router();

router.get('/api/endpoint', async (req, res) => {
  try {
    // Your logic here
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
    description: "Create a database model with validation",
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
  }
]

export default function CodeStudioPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")

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
          mode: "code"
        }),
      })

      const data = await response.json()
      if (data.response) {
        setGeneratedCode(data.response)
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
    const filename = `generated-code${language?.extension || '.txt'}`
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
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
              <p className="text-muted-foreground">AI-powered code generation and optimization</p>
            </div>
          </div>
          <Badge variant="outline" className="text-accent border-accent">
            <Brain className="h-3 w-3 mr-1" />
            LLM7 Powered
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="optimize" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Optimize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Code Generation
                  </CardTitle>
                  <CardDescription>
                    Describe what you want to build and let AI generate the code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Programming Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {programmingLanguages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Code Description</label>
                    <Textarea
                      placeholder="Describe the code you want to generate... (e.g., 'Create a function that validates email addresses')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] monospace"
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateCode} 
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full button-minimal"
                  >
                    {isGenerating ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4 mr-2" />
                        Generate Code
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Output Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
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
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedLanguage.toUpperCase()} code generated by AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedCode ? (
                    <pre className="bg-muted p-4 rounded text-sm overflow-x-auto monospace">
                      <code>{generatedCode}</code>
                    </pre>
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
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {codeTemplates.map((template, index) => (
                <Card key={index} className="card-minimal cursor-pointer hover:border-foreground/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="mb-3">
                      {template.language.toUpperCase()}
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

          <TabsContent value="optimize" className="space-y-6">
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Code Optimization
                </CardTitle>
                <CardDescription>
                  Paste your code to get AI-powered optimization suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Paste your code here for optimization suggestions..."
                    className="min-h-[200px] monospace"
                  />
                  <Button className="w-full button-minimal">
                    <Zap className="h-4 w-4 mr-2" />
                    Optimize Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
