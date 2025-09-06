"use client"

import { useState, useEffect, useRef } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Code, 
  Play, 
  Copy, 
  Download, 
  Terminal, 
  Brain, 
  Zap, 
  FileText, 
  Settings, 
  Monitor, 
  Eye, 
  Save, 
  FolderOpen, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Wand2, 
  Cpu, 
  Clock, 
  Hash, 
  Maximize2, 
  Minimize2,
  Plus,
  Trash2,
  Edit3,
  Folder,
  File,
  GitBranch,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Package,
  Layers,
  Database,
  Globe,
  Smartphone,
  Tablet,
  Monitor
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getAvailableModels, getModelsByCategory, getRecommendedModel } from "@/lib/llm7"

interface ProjectFile {
  id: string
  name: string
  content: string
  language: string
  path: string
  isOpen: boolean
  isModified: boolean
  lastModified: Date
}

interface Project {
  id: string
  name: string
  description: string
  framework: string
  files: ProjectFile[]
  createdAt: Date
  lastModified: Date
}

const programmingLanguages = [
  { value: "javascript", label: "JavaScript", extension: ".js", icon: "🟨", color: "#f7df1e" },
  { value: "typescript", label: "TypeScript", extension: ".ts", icon: "🔷", color: "#3178c6" },
  { value: "python", label: "Python", extension: ".py", icon: "🐍", color: "#3776ab" },
  { value: "java", label: "Java", extension: ".java", icon: "☕", color: "#ed8b00" },
  { value: "cpp", label: "C++", extension: ".cpp", icon: "⚡", color: "#00599c" },
  { value: "csharp", label: "C#", extension: ".cs", icon: "🔷", color: "#239120" },
  { value: "go", label: "Go", extension: ".go", icon: "🐹", color: "#00add8" },
  { value: "rust", label: "Rust", extension: ".rs", icon: "🦀", color: "#000000" },
  { value: "php", label: "PHP", extension: ".php", icon: "🐘", color: "#777bb4" },
  { value: "ruby", label: "Ruby", extension: ".rb", icon: "💎", color: "#cc342d" },
  { value: "swift", label: "Swift", extension: ".swift", icon: "🦉", color: "#fa7343" },
  { value: "kotlin", label: "Kotlin", extension: ".kt", icon: "🟣", color: "#7f52ff" },
  { value: "html", label: "HTML", extension: ".html", icon: "🌐", color: "#e34f26" },
  { value: "css", label: "CSS", extension: ".css", icon: "🎨", color: "#1572b6" },
  { value: "scss", label: "SCSS", extension: ".scss", icon: "🎨", color: "#cf649a" },
  { value: "sql", label: "SQL", extension: ".sql", icon: "🗄️", color: "#336791" },
  { value: "json", label: "JSON", extension: ".json", icon: "📄", color: "#000000" },
  { value: "yaml", label: "YAML", extension: ".yml", icon: "📄", color: "#cb171e" },
  { value: "markdown", label: "Markdown", extension: ".md", icon: "📝", color: "#083fa1" },
  { value: "dockerfile", label: "Dockerfile", extension: "Dockerfile", icon: "🐳", color: "#2496ed" }
]

const frameworks = [
  { value: "react", label: "React", icon: "⚛️", description: "Modern React with TypeScript" },
  { value: "nextjs", label: "Next.js", icon: "▲", description: "Full-stack React framework" },
  { value: "vue", label: "Vue.js", icon: "💚", description: "Progressive JavaScript framework" },
  { value: "angular", label: "Angular", icon: "🅰️", description: "Platform for building mobile and desktop web applications" },
  { value: "svelte", label: "Svelte", icon: "🧡", description: "Cybernetically enhanced web apps" },
  { value: "express", label: "Express.js", icon: "🚀", description: "Fast, unopinionated web framework" },
  { value: "fastapi", label: "FastAPI", icon: "⚡", description: "Modern Python web framework" },
  { value: "django", label: "Django", icon: "🎸", description: "High-level Python web framework" },
  { value: "spring", label: "Spring Boot", icon: "🍃", description: "Java-based framework" },
  { value: "flutter", label: "Flutter", icon: "🦋", description: "UI toolkit for building natively compiled applications" },
  { value: "vanilla", label: "Vanilla", icon: "🍦", description: "Pure JavaScript/HTML/CSS" }
]

const projectTemplates = [
  {
    name: "React App",
    framework: "react",
    description: "Modern React application with TypeScript",
    files: [
      { name: "package.json", language: "json", content: `{
  "name": "my-react-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}` },
      { name: "src/App.tsx", language: "typescript", content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to React</h1>
        <p>Edit src/App.tsx and save to reload.</p>
      </header>
    </div>
  );
}

export default App;` },
      { name: "src/App.css", language: "css", content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}` },
      { name: "public/index.html", language: "html", content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>` }
    ]
  },
  {
    name: "Next.js App",
    framework: "nextjs",
    description: "Full-stack Next.js application",
    files: [
      { name: "package.json", language: "json", content: `{
  "name": "my-nextjs-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}` },
      { name: "pages/index.tsx", language: "typescript", content: `import { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <p>This is the home page.</p>
    </div>
  );
};

export default Home;` },
      { name: "pages/api/hello.ts", language: "typescript", content: `import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Hello from API!' });
}` }
    ]
  },
  {
    name: "Python API",
    framework: "fastapi",
    description: "FastAPI REST API with Python",
    files: [
      { name: "main.py", language: "python", content: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.post("/items/")
async def create_item(item: Item):
    return item` },
      { name: "requirements.txt", language: "text", content: `fastapi==0.104.1
uvicorn==0.24.0` }
    ]
  }
]

export default function CodeStudioPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null)
  const [prompt, setPrompt] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [selectedModel, setSelectedModel] = useState("codestral-2501")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("projects")
  const [previewMode, setPreviewMode] = useState(false)
  const [availableModels, setAvailableModels] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectFramework, setNewProjectFramework] = useState("react")
  const [newProjectDescription, setNewProjectDescription] = useState("")

  const fileTreeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setAvailableModels(getAvailableModels())
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('code-projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  useEffect(() => {
    // Save projects to localStorage
    localStorage.setItem('code-projects', JSON.stringify(projects))
  }, [projects])

  const createNewProject = () => {
    if (!newProjectName.trim()) return

    const template = projectTemplates.find(t => t.framework === newProjectFramework)
    const files: ProjectFile[] = template ? template.files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      content: file.content,
      language: file.language,
      path: file.name,
      isOpen: false,
      isModified: false,
      lastModified: new Date()
    })) : [{
      id: Math.random().toString(36).substr(2, 9),
      name: "index.js",
      content: "// Welcome to your new project!\nconsole.log('Hello, World!');",
      language: "javascript",
      path: "index.js",
      isOpen: true,
      isModified: false,
      lastModified: new Date()
    }]

    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProjectName,
      description: newProjectDescription,
      framework: newProjectFramework,
      files,
      createdAt: new Date(),
      lastModified: new Date()
    }

    setProjects(prev => [newProject, ...prev])
    setCurrentProject(newProject)
    setSelectedFile(files[0])
    setShowNewProject(false)
    setNewProjectName("")
    setNewProjectDescription("")
    setActiveTab("editor")
  }

  const openProject = (project: Project) => {
    setCurrentProject(project)
    setSelectedFile(project.files[0])
    setActiveTab("editor")
  }

  const createNewFile = () => {
    if (!currentProject) return

    const fileName = prompt("Enter file name:", "new-file.js")
    if (!fileName) return

    const language = programmingLanguages.find(lang => 
      fileName.endsWith(lang.extension)
    )?.value || "javascript"

    const newFile: ProjectFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: fileName,
      content: "",
      language,
      path: fileName,
      isOpen: true,
      isModified: false,
      lastModified: new Date()
    }

    const updatedProject = {
      ...currentProject,
      files: [...currentProject.files, newFile],
      lastModified: new Date()
    }

    setCurrentProject(updatedProject)
    setSelectedFile(newFile)
    updateProject(updatedProject)
  }

  const updateProject = (project: Project) => {
    setProjects(prev => prev.map(p => p.id === project.id ? project : p))
  }

  const updateFile = (fileId: string, content: string) => {
    if (!currentProject) return

    const updatedProject = {
      ...currentProject,
      files: currentProject.files.map(file => 
        file.id === fileId 
          ? { ...file, content, isModified: true, lastModified: new Date() }
          : file
      ),
      lastModified: new Date()
    }

    setCurrentProject(updatedProject)
    updateProject(updatedProject)
  }

  const openFile = (file: ProjectFile) => {
    setSelectedFile(file)
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        files: currentProject.files.map(f => 
          f.id === file.id ? { ...f, isOpen: true } : f
        )
      }
      setCurrentProject(updatedProject)
      updateProject(updatedProject)
    }
  }

  const closeFile = (fileId: string) => {
    if (!currentProject) return

    const updatedProject = {
      ...currentProject,
      files: currentProject.files.map(file => 
        file.id === fileId ? { ...file, isOpen: false } : file
      )
    }

    setCurrentProject(updatedProject)
    updateProject(updatedProject)

    if (selectedFile?.id === fileId) {
      const remainingOpenFiles = updatedProject.files.filter(f => f.isOpen)
      setSelectedFile(remainingOpenFiles[0] || null)
    }
  }

  const deleteFile = (fileId: string) => {
    if (!currentProject) return

    const updatedProject = {
      ...currentProject,
      files: currentProject.files.filter(file => file.id !== fileId)
    }

    setCurrentProject(updatedProject)
    updateProject(updatedProject)

    if (selectedFile?.id === fileId) {
      setSelectedFile(updatedProject.files[0] || null)
    }
  }

  const handleGenerateCode = async () => {
    if (!prompt.trim() || !selectedFile) return

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
              content: `You are an expert ${selectedFile.language} developer. Generate clean, efficient, and well-commented code based on the user's request. Consider the existing code context and maintain consistency.`
            },
            {
              role: "user",
              content: `Generate ${selectedFile.language} code for: ${prompt}. Current file content:\n${selectedFile.content}`
            }
          ],
          mode: "code",
          model: selectedModel
        }),
      })

      const data = await response.json()
      if (data.response) {
        updateFile(selectedFile.id, data.response)
        setPrompt("")
      }
    } catch (error) {
      console.error("Error generating code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const runCode = () => {
    if (!selectedFile) return
    
    // For HTML files, show in preview
    if (selectedFile.language === 'html') {
      setPreviewMode(true)
    } else {
      // For other languages, show in console or execute
      console.log("Running code:", selectedFile.content)
    }
  }

  const getLanguageIcon = (lang: string) => {
    return programmingLanguages.find(l => l.value === lang)?.icon || "📄"
  }

  const getLanguageColor = (lang: string) => {
    return programmingLanguages.find(l => l.value === lang)?.color || "#666"
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderFileTree = (files: ProjectFile[]) => {
    const groupedFiles = files.reduce((acc, file) => {
      const pathParts = file.path.split('/')
      const folder = pathParts.length > 1 ? pathParts[0] : 'root'
      if (!acc[folder]) acc[folder] = []
      acc[folder].push(file)
      return acc
    }, {} as Record<string, ProjectFile[]>)

    return (
      <div className="space-y-1">
        {Object.entries(groupedFiles).map(([folder, folderFiles]) => (
          <div key={folder}>
            {folder !== 'root' && (
              <div className="flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground">
                <ChevronRight className="h-3 w-3" />
                <Folder className="h-3 w-3" />
                {folder}
              </div>
            )}
            {folderFiles.map(file => (
              <div
                key={file.id}
                className={`flex items-center gap-2 px-2 py-1 text-sm cursor-pointer rounded hover:bg-muted/50 ${
                  selectedFile?.id === file.id ? 'bg-muted' : ''
                }`}
                onClick={() => openFile(file)}
              >
                <File className="h-3 w-3" />
                <span className="flex-1 truncate">{file.name}</span>
                {file.isModified && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded">
              <Terminal className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Code Studio</h1>
              <p className="text-sm text-muted-foreground">
                {currentProject ? currentProject.name : "AI-powered development environment"}
              </p>
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

        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-80 border-r bg-muted/20 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="generate">Generate</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="flex-1 p-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={() => setShowNewProject(true)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {showNewProject && (
                    <Card className="p-4">
                      <div className="space-y-3">
                        <Input
                          placeholder="Project name"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                        />
                        <Select value={newProjectFramework} onValueChange={setNewProjectFramework}>
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
                        <Textarea
                          placeholder="Project description"
                          value={newProjectDescription}
                          onChange={(e) => setNewProjectDescription(e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={createNewProject}>
                            Create
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowNewProject(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  <div className="space-y-2">
                    {filteredProjects.map((project) => (
                      <Card
                        key={project.id}
                        className="cursor-pointer hover:border-foreground/20"
                        onClick={() => openProject(project)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="h-4 w-4" />
                            <span className="font-medium">{project.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {frameworks.find(f => f.value === project.framework)?.icon} {project.framework}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {project.files.length} files
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="files" className="flex-1 p-2">
                {currentProject ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Files</h3>
                      <Button size="sm" onClick={createNewFile}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div ref={fileTreeRef} className="space-y-1">
                      {renderFileTree(currentProject.files)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No project selected</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="generate" className="flex-1 p-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Language</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Code Description</Label>
                    <Textarea
                      placeholder="Describe what you want to build..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateCode} 
                    disabled={!prompt.trim() || isGenerating || !selectedFile}
                    className="w-full"
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
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {currentProject && selectedFile ? (
              <>
                {/* File Tabs */}
                <div className="flex items-center border-b bg-muted/20">
                  {currentProject.files.filter(f => f.isOpen).map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-2 px-3 py-2 border-r cursor-pointer ${
                        selectedFile.id === file.id ? 'bg-background' : 'bg-muted/50'
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <span style={{ color: getLanguageColor(file.language) }}>
                        {getLanguageIcon(file.language)}
                      </span>
                      <span className="text-sm">{file.name}</span>
                      {file.isModified && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          closeFile(file.id)
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Editor and Preview */}
                <div className="flex-1 flex">
                  {/* Code Editor */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between p-2 border-b bg-muted/20">
                      <div className="flex items-center gap-2">
                        <span style={{ color: getLanguageColor(selectedFile.language) }}>
                          {getLanguageIcon(selectedFile.language)}
                        </span>
                        <span className="text-sm font-medium">{selectedFile.name}</span>
                        {selectedFile.isModified && (
                          <Badge variant="outline" className="text-xs">Modified</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={runCode}>
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(selectedFile.content)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 p-4">
                      <Textarea
                        value={selectedFile.content}
                        onChange={(e) => updateFile(selectedFile.id, e.target.value)}
                        className="w-full h-full min-h-[400px] font-mono text-sm resize-none border-0 focus:ring-0"
                        placeholder="Start coding..."
                      />
                    </div>
                  </div>

                  {/* Preview Panel */}
                  {previewMode && (
                    <div className="w-1/2 border-l flex flex-col">
                      <div className="flex items-center justify-between p-2 border-b bg-muted/20">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          <span className="text-sm font-medium">Preview</span>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Smartphone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Tablet className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Monitor className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex-1 p-4">
                        {selectedFile.language === 'html' ? (
                          <iframe
                            srcDoc={selectedFile.content}
                            className="w-full h-full border border-border rounded"
                            sandbox="allow-scripts allow-same-origin"
                            title="Code Preview"
                          />
                        ) : selectedFile.language === 'javascript' ? (
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded">
                              <h4 className="font-medium mb-2">JavaScript Output:</h4>
                              <div className="bg-background p-3 rounded border">
                                <iframe
                                  srcDoc={`
                                    <!DOCTYPE html>
                                    <html>
                                    <head>
                                      <title>JS Preview</title>
                                      <style>
                                        body { font-family: monospace; padding: 10px; }
                                        .output { background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0; }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="output" id="output"></div>
                                      <script>
                                        try {
                                          const result = eval(\`${selectedFile.content.replace(/`/g, '\\`')}\`);
                                          document.getElementById('output').innerHTML = '<strong>Result:</strong> ' + JSON.stringify(result, null, 2);
                                        } catch (error) {
                                          document.getElementById('output').innerHTML = '<strong>Error:</strong> ' + error.message;
                                        }
                                      </script>
                                    </body>
                                    </html>
                                  `}
                                  className="w-full h-64 border border-border rounded"
                                  sandbox="allow-scripts allow-same-origin"
                                  title="JavaScript Preview"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-muted p-4 rounded">
                            <h4 className="font-medium mb-2">Code Preview:</h4>
                            <pre className="text-sm bg-background p-3 rounded border overflow-auto">
                              {selectedFile.content}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Terminal className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h2 className="text-xl font-semibold mb-2">Welcome to Code Studio</h2>
                  <p className="text-muted-foreground mb-4">
                    Create a new project or open an existing one to start coding
                  </p>
                  <Button onClick={() => setShowNewProject(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}