"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Code, 
  ImageIcon, 
  Brain, 
  Download, 
  Trash2, 
  Eye, 
  Copy, 
  Star, 
  Archive, 
  RefreshCw, 
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  Grid,
  List,
  BarChart3,
  TrendingUp,
  Activity,
  Zap,
  Cpu,
  Hash
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface HistoryItem {
  id: string
  type: "chat" | "code" | "image" | "super"
  title: string
  content: string
  model: string
  tokens: number
  timestamp: Date
  duration: number
  favorite: boolean
  archived: boolean
  tags: string[]
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    type: "chat",
    title: "React Component Architecture Discussion",
    content: "How to structure React components for better maintainability...",
    model: "mistral-large-2411",
    tokens: 1250,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    duration: 1500,
    favorite: true,
    archived: false,
    tags: ["react", "architecture", "components"]
  },
  {
    id: "2",
    type: "code",
    title: "Python Data Processing Script",
    content: "def process_data(data):\n    # Process the data\n    return processed_data",
    model: "codestral-2501",
    tokens: 800,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    duration: 2000,
    favorite: false,
    archived: false,
    tags: ["python", "data-processing", "script"]
  },
  {
    id: "3",
    type: "image",
    title: "Abstract Art Generation",
    content: "A beautiful abstract painting with vibrant colors and geometric shapes",
    model: "pixtral-large",
    tokens: 600,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    duration: 3000,
    favorite: true,
    archived: false,
    tags: ["art", "abstract", "generation"]
  },
  {
    id: "4",
    type: "super",
    title: "Market Analysis for Q4 2024",
    content: "Comprehensive analysis of market trends and predictions...",
    model: "deepseek-r1",
    tokens: 2500,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    duration: 5000,
    favorite: false,
    archived: false,
    tags: ["analysis", "market", "trends"]
  },
  {
    id: "5",
    type: "chat",
    title: "JavaScript Best Practices",
    content: "Discussion about modern JavaScript patterns and best practices...",
    model: "gpt-4.1-nano",
    tokens: 900,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    duration: 1200,
    favorite: false,
    archived: true,
    tags: ["javascript", "best-practices", "patterns"]
  }
]

export default function HistoryPage() {
  const { user } = useAuth()
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory)
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>(mockHistory)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedModel, setSelectedModel] = useState("all")
  const [sortBy, setSortBy] = useState("timestamp")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [activeTab, setActiveTab] = useState("all")
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    filterHistory()
  }, [searchQuery, selectedType, selectedModel, sortBy, sortOrder, history])

  const filterHistory = () => {
    let filtered = [...history]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    // Filter by model
    if (selectedModel !== "all") {
      filtered = filtered.filter(item => item.model === selectedModel)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case "timestamp":
          aValue = a.timestamp.getTime()
          bValue = b.timestamp.getTime()
          break
        case "tokens":
          aValue = a.tokens
          bValue = b.tokens
          break
        case "duration":
          aValue = a.duration
          bValue = b.duration
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        default:
          aValue = a.timestamp.getTime()
          bValue = b.timestamp.getTime()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredHistory(filtered)
  }

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ))
  }

  const toggleArchive = (id: string) => {
    setHistory(prev => prev.map(item =>
      item.id === id ? { ...item, archived: !item.archived } : item
    ))
  }

  const deleteItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `history-export-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chat": return <MessageSquare className="h-4 w-4" />
      case "code": return <Code className="h-4 w-4" />
      case "image": return <ImageIcon className="h-4 w-4" />
      case "super": return <Brain className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "chat": return "bg-blue-100 text-blue-800"
      case "code": return "bg-green-100 text-green-800"
      case "image": return "bg-purple-100 text-purple-800"
      case "super": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  const getStats = () => {
    const total = history.length
    const favorites = history.filter(item => item.favorite).length
    const archived = history.filter(item => item.archived).length
    const totalTokens = history.reduce((sum, item) => sum + item.tokens, 0)
    const avgDuration = history.reduce((sum, item) => sum + item.duration, 0) / total

    return { total, favorites, archived, totalTokens, avgDuration }
  }

  const stats = getStats()

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
              <History className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground monospace">HISTORY</h1>
              <p className="text-muted-foreground">Your AI interaction history and analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportHistory}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="card-minimal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted">
                  <Hash className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-minimal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.favorites}</p>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-minimal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted">
                  <Archive className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.archived}</p>
                  <p className="text-sm text-muted-foreground">Archived</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-minimal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted">
                  <Cpu className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Tokens</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-minimal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</p>
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="super" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Super Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Filters */}
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search history..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="chat">Chat</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="super">Super Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Models</SelectItem>
                        <SelectItem value="mistral-large-2411">Mistral Large</SelectItem>
                        <SelectItem value="codestral-2501">Codestral</SelectItem>
                        <SelectItem value="pixtral-large">Pixtral Large</SelectItem>
                        <SelectItem value="deepseek-r1">DeepSeek R1</SelectItem>
                        <SelectItem value="gpt-4.1-nano">GPT-4.1 Nano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <div className="flex gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="timestamp">Date</SelectItem>
                          <SelectItem value="tokens">Tokens</SelectItem>
                          <SelectItem value="duration">Duration</SelectItem>
                          <SelectItem value="title">Title</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      >
                        {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History List */}
            <div className="space-y-4">
              {filteredHistory.length === 0 ? (
                <Card className="card-minimal">
                  <CardContent className="p-12 text-center">
                    <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No history found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || selectedType !== "all" || selectedModel !== "all"
                        ? "Try adjusting your filters to see more results."
                        : "Start using AI features to build your history."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredHistory.map((item) => (
                  <Card key={item.id} className="card-minimal">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {item.content}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimestamp(item.timestamp)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Cpu className="h-3 w-3" />
                                  {item.tokens} tokens
                                </span>
                                <span className="flex items-center gap-1">
                                  <Zap className="h-3 w-3" />
                                  {formatDuration(item.duration)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {item.model}
                                </Badge>
                              </div>

                              {item.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {item.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleFavorite(item.id)}
                              >
                                <Star className={`h-4 w-4 ${item.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleArchive(item.id)}
                              >
                                <Archive className={`h-4 w-4 ${item.archived ? 'text-gray-600' : ''}`} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleExpanded(item.id)}
                              >
                                {expandedItems.has(item.id) ? 
                                  <ChevronUp className="h-4 w-4" /> : 
                                  <ChevronDown className="h-4 w-4" />
                                }
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigator.clipboard.writeText(item.content)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {expandedItems.has(item.id) && (
                            <div className="mt-4 p-4 bg-muted/20 rounded border">
                              <h4 className="font-medium mb-2">Full Content</h4>
                              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {item.content}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
