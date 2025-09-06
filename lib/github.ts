// GitHub App Integration for Pencil Code Mode
// Note: @octokit/rest will be installed when needed
// import { Octokit } from '@octokit/rest'
// import { createGitHubUserClient, createGitHubAppClient } from './github-auth'

// GitHub App Configuration
export const GITHUB_APP_CONFIG = {
  clientId: process.env.GITHUB_CLIENT_ID || 'Iv23liXMEm06Gc4ndGdU',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  appId: process.env.GITHUB_APP_ID || '1909450',
  privateKey: process.env.GITHUB_PRIVATE_KEY || '',
  webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
  redirectUri: process.env.GITHUB_REDIRECT_URI || 'https://pencilx.vercel.app/api/github/callback'
}

// GitHub API Client
export class GitHubClient {
  private octokit: any // Octokit
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
    // this.octokit = createGitHubUserClient(accessToken)
    this.octokit = null // Will be initialized when @octokit/rest is available
  }

  // Get authenticated user info
  async getUser() {
    const { data } = await this.octokit.users.getAuthenticated()
    return data
  }

  // List user repositories
  async getRepositories() {
    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100
    })
    return data
  }

  // Create a new repository
  async createRepository(repoData: {
    name: string
    description?: string
    private?: boolean
    autoInit?: boolean
  }) {
    const { data } = await this.octokit.repos.createForAuthenticatedUser({
      name: repoData.name,
      description: repoData.description || 'Created with Pencil AI Code Mode',
      private: repoData.private || false,
      auto_init: repoData.autoInit || true
    })
    return data
  }

  // Get repository contents
  async getRepositoryContents(owner: string, repo: string, path: string = '') {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path
      })
      return data
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  }

  // Create or update file
  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha?: string
  ) {
    const { data } = await this.octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha
    })
    return data
  }

  // Delete file
  async deleteFile(owner: string, repo: string, path: string, message: string) {
    const { data } = await this.octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message,
      sha: await this.getFileSha(owner, repo, path)
    })
    return data
  }

  // Get file SHA for updates
  private async getFileSha(owner: string, repo: string, path: string) {
    const content = await this.getRepositoryContents(owner, repo, path)
    if (content && 'sha' in content) {
      return content.sha
    }
    throw new Error('File not found')
  }

  // Create a commit with multiple files
  async createCommit(
    owner: string,
    repo: string,
    message: string,
    files: Array<{
      path: string
      content: string
      operation: 'create' | 'update' | 'delete'
    }>
  ) {
    const branch = 'main' // Default branch
    const tree = []
    const blobs = []

    // Create blobs for new/updated files
    for (const file of files) {
      if (file.operation !== 'delete') {
        const { data: blob } = await this.octokit.git.createBlob({
          owner,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64'
        })
        blobs.push({ path: file.path, sha: blob.sha, mode: '100644', type: 'blob' })
      }
    }

    // Get current tree
    const { data: ref } = await this.octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`
    })

    const { data: commit } = await this.octokit.git.getCommit({
      owner,
      repo,
      commit_sha: ref.object.sha
    })

    // Create new tree
    const { data: treeData } = await this.octokit.git.createTree({
      owner,
      repo,
      tree: blobs,
      base_tree: commit.tree.sha
    })

    // Create commit
    const { data: newCommit } = await this.octokit.git.createCommit({
      owner,
      repo,
      message,
      tree: treeData.sha,
      parents: [commit.sha]
    })

    // Update branch reference
    await this.octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha
    })

    return newCommit
  }

  // Get repository branches
  async getBranches(owner: string, repo: string) {
    const { data } = await this.octokit.repos.listBranches({
      owner,
      repo,
      per_page: 100
    })
    return data
  }

  // Create a new branch
  async createBranch(owner: string, repo: string, branchName: string, fromBranch: string = 'main') {
    const { data: ref } = await this.octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${fromBranch}`
    })

    const { data } = await this.octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha
    })

    return data
  }

  // Create a pull request
  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string = 'main',
    body?: string
  ) {
    const { data } = await this.octokit.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
      body
    })
    return data
  }

  // Get repository issues
  async getIssues(owner: string, repo: string) {
    const { data } = await this.octokit.issues.listForRepo({
      owner,
      repo,
      state: 'open'
    })
    return data
  }

  // Create an issue
  async createIssue(owner: string, repo: string, title: string, body?: string) {
    const { data } = await this.octokit.issues.create({
      owner,
      repo,
      title,
      body
    })
    return data
  }
}

// GitHub OAuth Helper
export class GitHubOAuth {
  static getAuthUrl(state?: string) {
    const params = new URLSearchParams({
      client_id: GITHUB_APP_CONFIG.clientId,
      redirect_uri: GITHUB_APP_CONFIG.redirectUri,
      scope: 'repo,user,read:org',
      state: state || 'pencil-github-auth'
    })
    
    return `https://github.com/login/oauth/authorize?${params.toString()}`
  }

  static async exchangeCodeForToken(code: string) {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_APP_CONFIG.clientId,
        client_secret: GITHUB_APP_CONFIG.clientSecret,
        code
      })
    })

    const data = await response.json()
    return data
  }
}

// GitHub Webhook Handler
export class GitHubWebhookHandler {
  static verifySignature(payload: string, signature: string) {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', GITHUB_APP_CONFIG.webhookSecret)
      .update(payload)
      .digest('hex')
    
    return `sha256=${expectedSignature}` === signature
  }

  static async handleWebhook(payload: any, event: string) {
    switch (event) {
      case 'push':
        return this.handlePushEvent(payload)
      case 'pull_request':
        return this.handlePullRequestEvent(payload)
      case 'issues':
        return this.handleIssueEvent(payload)
      default:
        console.log(`Unhandled webhook event: ${event}`)
    }
  }

  private static async handlePushEvent(payload: any) {
    // Handle push events - could trigger CI/CD, notifications, etc.
    console.log('Push event received:', payload.repository.full_name)
  }

  private static async handlePullRequestEvent(payload: any) {
    // Handle PR events - could trigger code review, automated testing, etc.
    console.log('Pull request event received:', payload.pull_request.title)
  }

  private static async handleIssueEvent(payload: any) {
    // Handle issue events - could trigger notifications, project management updates, etc.
    console.log('Issue event received:', payload.issue.title)
  }
}

// Utility functions
export const githubUtils = {
  // Extract owner and repo from GitHub URL
  parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (match) {
      return { owner: match[1], repo: match[2] }
    }
    return null
  },

  // Generate repository URL
  generateRepoUrl(owner: string, repo: string): string {
    return `https://github.com/${owner}/${repo}`
  },

  // Generate file URL
  generateFileUrl(owner: string, repo: string, path: string, branch: string = 'main'): string {
    return `https://github.com/${owner}/${repo}/blob/${branch}/${path}`
  },

  // Generate commit URL
  generateCommitUrl(owner: string, repo: string, sha: string): string {
    return `https://github.com/${owner}/${repo}/commit/${sha}`
  },

  // Generate pull request URL
  generatePullRequestUrl(owner: string, repo: string, number: number): string {
    return `https://github.com/${owner}/${repo}/pull/${number}`
  }
}
