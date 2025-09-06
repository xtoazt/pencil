"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Github, 
  ExternalLink, 
  Plus, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  GitBranch,
  Folder,
  File,
  Eye,
  Copy
} from "lucide-react"

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  private: boolean
  html_url: string
  clone_url: string
  default_branch: string
  updated_at: string
}

interface GitHubIntegrationProps {
  onRepoSelect?: (repo: GitHubRepo) => void
  onCommit?: (commitData: any) => void
  files?: Array<{ path: string; content: string }>
}

export function GitHubIntegration({ onRepoSelect, onCommit, files = [] }: GitHubIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showCreateRepo, setShowCreateRepo] = useState(false)
  const [newRepoName, setNewRepoName] = useState("")
  const [newRepoDescription, setNewRepoDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [commitMessage, setCommitMessage] = useState("")
  const [isCommitting, setIsCommitting] = useState(false)

  useEffect(() => {
    // Check if user is already connected
    const savedToken = localStorage.getItem('github_access_token')
    if (savedToken) {
      setAccessToken(savedToken)
      setIsConnected(true)
      fetchRepositories(savedToken)
    }
  }, [])

  const connectToGitHub = async () => {
    try {
      const response = await fetch('/api/github/auth')
      const { authUrl } = await response.json()
      
      // Open GitHub OAuth in a popup
      const popup = window.open(
        authUrl,
        'github-auth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      )

      // Listen for the popup to close and handle the callback
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          // Try to get the token from the callback
          // In a real implementation, you'd handle this through the callback route
        }
      }, 1000)
    } catch (error) {
      setError('Failed to initiate GitHub connection')
    }
  }

  const handleTokenSubmit = async () => {
    if (!accessToken.trim()) return
    
    setIsLoading(true)
    setError("")
    
    try {
      await fetchRepositories(accessToken)
      setIsConnected(true)
      localStorage.setItem('github_access_token', accessToken)
    } catch (error) {
      setError('Invalid access token or failed to fetch repositories')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRepositories = async (token: string) => {
    const response = await fetch(`/api/github/repos?accessToken=${encodeURIComponent(token)}`)
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    setRepos(data.repos)
  }

  const createRepository = async () => {
    if (!newRepoName.trim() || !accessToken) return
    
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch('/api/github/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          name: newRepoName,
          description: newRepoDescription,
          private: isPrivate
        })
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Add the new repo to the list
      setRepos(prev => [data.repo, ...prev])
      setSelectedRepo(data.repo)
      setShowCreateRepo(false)
      setNewRepoName("")
      setNewRepoDescription("")
      
      if (onRepoSelect) {
        onRepoSelect(data.repo)
      }
    } catch (error) {
      setError('Failed to create repository')
    } finally {
      setIsLoading(false)
    }
  }

  const commitToGitHub = async () => {
    if (!selectedRepo || !commitMessage.trim() || !files.length) return
    
    setIsCommitting(true)
    setError("")
    
    try {
      const [owner, repoName] = selectedRepo.full_name.split('/')
      
      const response = await fetch('/api/github/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          owner,
          repo: repoName,
          message: commitMessage,
          files: files.map(file => ({
            path: file.path,
            content: file.content,
            operation: 'create' as const
          }))
        })
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setCommitMessage("")
      
      if (onCommit) {
        onCommit(data.commit)
      }
    } catch (error) {
      setError('Failed to commit to GitHub')
    } finally {
      setIsCommitting(false)
    }
  }

  const disconnect = () => {
    setAccessToken("")
    setIsConnected(false)
    setRepos([])
    setSelectedRepo(null)
    localStorage.removeItem('github_access_token')
  }

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Connect to GitHub
          </CardTitle>
          <CardDescription>
            Connect your GitHub account to create repositories and commit code directly from Pencil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="access-token">GitHub Access Token</Label>
            <Input
              id="access-token"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              You can generate a personal access token in your GitHub settings
            </p>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleTokenSubmit} 
              disabled={!accessToken.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={connectToGitHub}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              OAuth
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Connected to GitHub</span>
            </div>
            <Button variant="outline" size="sm" onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Repository Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Repository
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select 
              value={selectedRepo?.full_name || ""} 
              onValueChange={(value) => {
                const repo = repos.find(r => r.full_name === value)
                setSelectedRepo(repo || null)
                if (repo && onRepoSelect) {
                  onRepoSelect(repo)
                }
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a repository" />
              </SelectTrigger>
              <SelectContent>
                {repos.map((repo) => (
                  <SelectItem key={repo.id} value={repo.full_name}>
                    <div className="flex items-center gap-2">
                      <span>{repo.name}</span>
                      {repo.private && <Badge variant="outline" className="text-xs">Private</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateRepo(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {selectedRepo && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              <a 
                href={selectedRepo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {selectedRepo.full_name}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Repository Modal */}
      {showCreateRepo && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Repository</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repo-name">Repository Name</Label>
              <Input
                id="repo-name"
                placeholder="my-awesome-project"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repo-description">Description</Label>
              <Textarea
                id="repo-description"
                placeholder="A brief description of your project"
                value={newRepoDescription}
                onChange={(e) => setNewRepoDescription(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="private-repo"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <Label htmlFor="private-repo">Private repository</Label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={createRepository} 
                disabled={!newRepoName.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Repository
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateRepo(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commit Section */}
      {selectedRepo && files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Commit to GitHub
            </CardTitle>
            <CardDescription>
              Commit {files.length} file{files.length !== 1 ? 's' : ''} to {selectedRepo.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commit-message">Commit Message</Label>
              <Input
                id="commit-message"
                placeholder="Initial commit from Pencil AI"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Files to commit:</Label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <File className="h-3 w-3" />
                    <span className="flex-1 truncate">{file.path}</span>
                    <Badge variant="outline" className="text-xs">
                      {file.content.length} chars
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <Button 
              onClick={commitToGitHub} 
              disabled={!commitMessage.trim() || isCommitting}
              className="w-full"
            >
              {isCommitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Committing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Commit to GitHub
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
