"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Terminal, 
  Code, 
  Play, 
  Copy, 
  Download, 
  Upload,
  File,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Edit3,
  Save,
  Search,
  Filter,
  Settings,
  GitBranch,
  Github,
  ExternalLink,
  Package,
  Layers,
  Database,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronDown,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  Zap,
  Brain,
  Cpu,
  Clock,
  Hash,
  FileText,
  Wand2,
  RefreshCw,
  Bookmark,
  Star,
  Share2,
  History,
  Bug,
  TestTube,
  GitCommit,
  GitPullRequest,
  GitMerge,
  GitCompare,
  GitBranch as GitBranchIcon,
  GitCommit as GitCommitIcon,
  GitPullRequest as GitPullRequestIcon,
  GitMerge as GitMergeIcon,
  GitCompare as GitCompareIcon,
  GitBranch as GitBranchIcon2,
  GitCommit as GitCommitIcon2,
  GitPullRequest as GitPullRequestIcon2,
  GitMerge as GitMergeIcon2,
  GitCompare as GitCompareIcon2
} from "lucide-react"
import { GitHubIntegration } from "@/components/github-integration"

interface ProjectFile {
  id: string
  name: string
  content: string
  language: string
  path: string
  isOpen: boolean
  isModified: boolean
  lastModified: Date
  size: number
  lines: number
}

interface Project {
  id: string
  name: string
  description: string
  framework: string
  files: ProjectFile[]
  createdAt: Date
  lastModified: Date
  gitStatus?: {
    branch: string
    commits: number
    lastCommit: string
  }
}

interface CodeExecution {
  id: string
  language: string
  code: string
  output: string
  error?: string
  executionTime: number
  timestamp: Date
}

const programmingLanguages = [
  { value: "javascript", label: "JavaScript", extension: ".js", icon: "🟨", color: "#f7df1e", runtime: "node" },
  { value: "typescript", label: "TypeScript", extension: ".ts", icon: "🔷", color: "#3178c6", runtime: "ts-node" },
  { value: "python", label: "Python", extension: ".py", icon: "🐍", color: "#3776ab", runtime: "python" },
  { value: "java", label: "Java", extension: ".java", icon: "☕", color: "#ed8b00", runtime: "java" },
  { value: "cpp", label: "C++", extension: ".cpp", icon: "⚡", color: "#00599c", runtime: "g++" },
  { value: "csharp", label: "C#", extension: ".cs", icon: "🔷", color: "#239120", runtime: "dotnet" },
  { value: "go", label: "Go", extension: ".go", icon: "🐹", color: "#00add8", runtime: "go" },
  { value: "rust", label: "Rust", extension: ".rs", icon: "🦀", color: "#000000", runtime: "rustc" },
  { value: "php", label: "PHP", extension: ".php", icon: "🐘", color: "#777bb4", runtime: "php" },
  { value: "ruby", label: "Ruby", extension: ".rb", icon: "💎", color: "#cc342d", runtime: "ruby" },
  { value: "swift", label: "Swift", extension: ".swift", icon: "🦉", color: "#fa7343", runtime: "swift" },
  { value: "kotlin", label: "Kotlin", extension: ".kt", icon: "🟣", color: "#7f52ff", runtime: "kotlin" },
  { value: "html", label: "HTML", extension: ".html", icon: "🌐", color: "#e34f26", runtime: "browser" },
  { value: "css", label: "CSS", extension: ".css", icon: "🎨", color: "#1572b6", runtime: "browser" },
  { value: "scss", label: "SCSS", extension: ".scss", icon: "🎨", color: "#cf649a", runtime: "sass" },
  { value: "sql", label: "SQL", extension: ".sql", icon: "🗄️", color: "#336791", runtime: "sql" },
  { value: "json", label: "JSON", extension: ".json", icon: "📄", color: "#000000", runtime: "json" },
  { value: "yaml", label: "YAML", extension: ".yml", icon: "📄", color: "#cb171e", runtime: "yaml" },
  { value: "markdown", label: "Markdown", extension: ".md", icon: "📝", color: "#083fa1", runtime: "markdown" },
  { value: "dockerfile", label: "Dockerfile", extension: "Dockerfile", icon: "🐳", color: "#2496ed", runtime: "docker" }
]

const frameworks = [
  { value: "react", label: "React", icon: "⚛️", description: "Modern React with TypeScript", template: "react-ts" },
  { value: "nextjs", label: "Next.js", icon: "▲", description: "Full-stack React framework", template: "nextjs-ts" },
  { value: "vue", label: "Vue.js", icon: "💚", description: "Progressive JavaScript framework", template: "vue-ts" },
  { value: "angular", label: "Angular", icon: "🅰️", description: "Platform for building mobile and desktop web applications", template: "angular" },
  { value: "svelte", label: "Svelte", icon: "🧡", description: "Cybernetically enhanced web apps", template: "svelte" },
  { value: "express", label: "Express.js", icon: "🚀", description: "Fast, unopinionated web framework", template: "express" },
  { value: "fastapi", label: "FastAPI", icon: "⚡", description: "Modern Python web framework", template: "fastapi" },
  { value: "django", label: "Django", icon: "🎸", description: "High-level Python web framework", template: "django" },
  { value: "spring", label: "Spring Boot", icon: "🍃", description: "Java-based framework", template: "spring" },
  { value: "flutter", label: "Flutter", icon: "🦋", description: "UI toolkit for building natively compiled applications", template: "flutter" },
  { value: "vanilla", label: "Vanilla", icon: "🍦", description: "Pure JavaScript/HTML/CSS", template: "vanilla" }
]

export function CodeStudioPro() {
  // Core State
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Code Generation
  const [prompt, setPrompt] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [selectedModel, setSelectedModel] = useState("codestral-2501")
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Execution
  const [executions, setExecutions] = useState<CodeExecution[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionOutput, setExecutionOutput] = useState("")
  
  // GitHub Integration
  const [selectedGitHubRepo, setSelectedGitHubRepo] = useState<any>(null)
  const [gitStatus, setGitStatus] = useState<any>(null)
  
  // UI State
  const [previewMode, setPreviewMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectFramework, setNewProjectFramework] = useState("react")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  
  // Advanced Features
  const [availableModels, setAvailableModels] = useState<any[]>([])
  const [codeHistory, setCodeHistory] = useState<any[]>([])
  const [bookmarks, setBookmarks] = useState<ProjectFile[]>([])
  const [recentFiles, setRecentFiles] = useState<ProjectFile[]>([])

  const fileTreeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('code-projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
    
    // Load available models
    setAvailableModels([
      { id: "codestral-2501", name: "Codestral 25B", category: "Coding", provider: "Mistral" },
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", category: "General", provider: "Anthropic" },
      { id: "gpt-4o", name: "GPT-4o", category: "General", provider: "OpenAI" },
      { id: "gemini-pro", name: "Gemini Pro", category: "General", provider: "Google" }
    ])
  }, [])

  useEffect(() => {
    // Save projects to localStorage
    localStorage.setItem('code-projects', JSON.stringify(projects))
  }, [projects])

  const createNewProject = () => {
    if (!newProjectName.trim()) return

    const template = frameworks.find(f => f.value === newProjectFramework)
    const files: ProjectFile[] = template ? getTemplateFiles(template.template) : [{
      id: Math.random().toString(36).substr(2, 9),
      name: "index.js",
      content: "// Welcome to your new project!\nconsole.log('Hello, World!');",
      language: "javascript",
      path: "index.js",
      isOpen: false,
      isModified: false,
      lastModified: new Date(),
      size: 50,
      lines: 2
    }]

    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProjectName,
      description: newProjectDescription,
      framework: newProjectFramework,
      files,
      createdAt: new Date(),
      lastModified: new Date(),
      gitStatus: {
        branch: "main",
        commits: 0,
        lastCommit: "Initial commit"
      }
    }

    setProjects(prev => [newProject, ...prev])
    setCurrentProject(newProject)
    setSelectedFile(files[0])
    setShowNewProject(false)
    setNewProjectName("")
    setNewProjectDescription("")
    setActiveTab("editor")
  }

  const getTemplateFiles = (template: string): ProjectFile[] => {
    const templates: { [key: string]: ProjectFile[] } = {
      "react-ts": [
        {
          id: "1",
          name: "package.json",
          language: "json",
          content: JSON.stringify({
            name: "my-react-app",
            version: "1.0.0",
            private: true,
            dependencies: {
              "react": "^18.2.0",
              "react-dom": "^18.2.0",
              "typescript": "^4.9.5"
            },
            scripts: {
              "start": "react-scripts start",
              "build": "react-scripts build",
              "test": "react-scripts test"
            }
          }, null, 2),
          path: "package.json",
          isOpen: false,
          isModified: false,
          lastModified: new Date(),
          size: 300,
          lines: 15
        },
        {
          id: "2",
          name: "src/App.tsx",
          language: "typescript",
          content: `import React from 'react';
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

export default App;`,
          path: "src/App.tsx",
          isOpen: true,
          isModified: false,
          lastModified: new Date(),
          size: 250,
          lines: 15
        }
      ],
      "nextjs-ts": [
        {
          id: "1",
          name: "package.json",
          language: "json",
          content: JSON.stringify({
            name: "my-nextjs-app",
            version: "1.0.0",
            private: true,
            scripts: {
              "dev": "next dev",
              "build": "next build",
              "start": "next start"
            },
            dependencies: {
              "next": "^14.0.0",
              "react": "^18.2.0",
              "react-dom": "^18.2.0"
            }
          }, null, 2),
          path: "package.json",
          isOpen: false,
          isModified: false,
          lastModified: new Date(),
          size: 200,
          lines: 12
        },
        {
          id: "2",
          name: "pages/index.tsx",
          language: "typescript",
          content: `import { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <p>This is the home page.</p>
    </div>
  );
};

export default Home;`,
          path: "pages/index.tsx",
          isOpen: true,
          isModified: false,
          lastModified: new Date(),
          size: 180,
          lines: 10
        }
      ]
    }
    
    return templates[template] || []
  }

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      let targetFile = selectedFile
      if (!targetFile) {
        const newFile: ProjectFile = {
          id: `file-${Date.now()}`,
          name: `generated-${selectedLanguage}.${getFileExtension(selectedLanguage)}`,
          content: "",
          language: selectedLanguage,
          path: `/generated-${selectedLanguage}.${getFileExtension(selectedLanguage)}`,
          isOpen: true,
          isModified: false,
          lastModified: new Date(),
          size: 0,
          lines: 0
        }
        
        if (currentProject) {
          const updatedProject = {
            ...currentProject,
            files: [...currentProject.files, newFile]
          }
          setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p))
          setCurrentProject(updatedProject)
        } else {
          const newProject: Project = {
            id: `project-${Date.now()}`,
            name: "Generated Code",
            description: "AI Generated Code",
            framework: "vanilla",
            files: [newFile],
            createdAt: new Date(),
            lastModified: new Date()
          }
          setProjects(prev => [...prev, newProject])
          setCurrentProject(newProject)
        }
        
        setSelectedFile(newFile)
        targetFile = newFile
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an expert ${targetFile.language} developer. Generate clean, efficient, and well-commented code based on the user's request. Consider the existing code context and maintain consistency. Return only the code without explanations.`
            },
            {
              role: "user",
              content: `Generate ${targetFile.language} code for: ${prompt}. ${targetFile.content ? `Current file content:\n${targetFile.content}` : 'Create new code from scratch.'}`
            }
          ],
          mode: "code",
          model: selectedModel
        }),
      })

      const data = await response.json()
      if (data.content) {
        updateFile(targetFile.id, data.content)
        setPrompt("")
        
        // Add to code history
        setCodeHistory(prev => [{
          id: Date.now(),
          prompt,
          code: data.content,
          language: targetFile.language,
          timestamp: new Date()
        }, ...prev.slice(0, 49)])
      } else if (data.response) {
        updateFile(targetFile.id, data.response)
        setPrompt("")
      }
    } catch (error) {
      console.error("Error generating code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const executeCode = async () => {
    if (!selectedFile) return
    
    setIsExecuting(true)
    setExecutionOutput("")
    
    try {
      const response = await fetch("/api/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedFile.language,
          code: selectedFile.content
        }),
      })
      
      const data = await response.json()
      const execution: CodeExecution = {
        id: `exec-${Date.now()}`,
        language: selectedFile.language,
        code: selectedFile.content,
        output: data.output || "",
        error: data.error,
        executionTime: data.executionTime || 0,
        timestamp: new Date()
      }
      
      setExecutions(prev => [execution, ...prev.slice(0, 19)]) // Keep last 20
      setExecutionOutput(data.output || data.error || "No output")
    } catch (error) {
      setExecutionOutput(`Error: ${error}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const updateFile = (fileId: string, content: string) => {
    if (!currentProject) return

    const updatedProject = {
      ...currentProject,
      files: currentProject.files.map(file => 
        file.id === fileId 
          ? { 
              ...file, 
              content, 
              isModified: true, 
              lastModified: new Date(),
              size: content.length,
              lines: content.split('\n').length
            }
          : file
      ),
      lastModified: new Date()
    }

    setCurrentProject(updatedProject)
    updateProject(updatedProject)
  }

  const updateProject = (project: Project) => {
    setProjects(prev => prev.map(p => p.id === project.id ? project : p))
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
    
    // Add to recent files
    setRecentFiles(prev => {
      const filtered = prev.filter(f => f.id !== file.id)
      return [file, ...filtered.slice(0, 9)]
    })
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

  const toggleBookmark = (file: ProjectFile) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === file.id)
      if (exists) {
        return prev.filter(b => b.id !== file.id)
      } else {
        return [...prev, file]
      }
    })
  }

  const getFileExtension = (language: string): string => {
    const lang = programmingLanguages.find(l => l.value === language)
    return lang?.extension.replace('.', '') || 'txt'
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
                <div className="flex items-center gap-1">
                  {file.isModified && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBookmark(file)
                    }}
                  >
                    <Star className={`h-3 w-3 ${bookmarks.find(b => b.id === file.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Code Studio Pro
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentProject ? currentProject.name : "Professional AI-Powered Development Environment"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedGitHubRepo && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Github className="h-3 w-3 mr-1" />
              {selectedGitHubRepo.name}
            </Badge>
          )}
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
        <div className="w-80 border-r bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-2">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
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
                      onClick={() => {
                        setCurrentProject(project)
                        setSelectedFile(project.files[0])
                        setActiveTab("editor")
                      }}
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
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div ref={fileTreeRef} className="space-y-1">
                    {renderFileTree(currentProject.files)}
                  </div>
                  
                  {/* Recent Files */}
                  {recentFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Recent Files</h4>
                      <div className="space-y-1">
                        {recentFiles.slice(0, 5).map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer rounded hover:bg-muted/50"
                            onClick={() => openFile(file)}
                          >
                            <File className="h-3 w-3" />
                            <span className="flex-1 truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Bookmarks */}
                  {bookmarks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Bookmarks</h4>
                      <div className="space-y-1">
                        {bookmarks.slice(0, 5).map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer rounded hover:bg-muted/50"
                            onClick={() => openFile(file)}
                          >
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="flex-1 truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                      {availableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{model.name}</span>
                            <Badge variant="outline" className="text-xs">{model.category}</Badge>
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
                  disabled={!prompt.trim() || isGenerating}
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

            <TabsContent value="github" className="flex-1 p-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  <h3 className="font-medium">GitHub Integration</h3>
                </div>
                
                <GitHubIntegration
                  onRepoSelect={(repo) => {
                    setSelectedGitHubRepo(repo)
                    console.log('Selected repo:', repo)
                  }}
                  onCommit={(commitData) => {
                    console.log('Commit successful:', commitData)
                  }}
                  files={currentProject?.files.map(file => ({
                    path: file.path,
                    content: file.content
                  })) || []}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {currentProject && selectedFile ? (
            <>
              {/* File Tabs */}
              <div className="flex items-center border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
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
                  <div className="flex items-center justify-between p-2 border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <span style={{ color: getLanguageColor(selectedFile.language) }}>
                        {getLanguageIcon(selectedFile.language)}
                      </span>
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                      {selectedFile.isModified && (
                        <Badge variant="outline" className="text-xs">Modified</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {selectedFile.lines} lines
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={executeCode} disabled={isExecuting}>
                        {isExecuting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
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

                {/* Preview/Output Panel */}
                {previewMode && (
                  <div className="w-1/2 border-l flex flex-col">
                    <div className="flex items-center justify-between p-2 border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        <span className="text-sm font-medium">Output</span>
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
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-muted p-4 rounded">
                            <h4 className="font-medium mb-2">Execution Output:</h4>
                            <div className="bg-background p-3 rounded border">
                              <pre className="text-sm whitespace-pre-wrap">
                                {executionOutput || "No output yet. Click the play button to execute code."}
                              </pre>
                            </div>
                          </div>
                          
                          {/* Execution History */}
                          {executions.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium">Execution History</h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {executions.slice(0, 5).map((exec) => (
                                  <div key={exec.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium">{exec.language}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {exec.executionTime}ms
                                      </span>
                                    </div>
                                    <pre className="text-xs whitespace-pre-wrap">
                                      {exec.output || exec.error}
                                    </pre>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
                <h2 className="text-xl font-semibold mb-2">Welcome to Code Studio Pro</h2>
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
  )
}
