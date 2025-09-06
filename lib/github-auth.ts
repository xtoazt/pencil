import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'

// GitHub App Authentication
export class GitHubAppAuth {
  private static instance: GitHubAppAuth
  private auth: any
  private octokit: Octokit

  private constructor() {
    const privateKey = process.env.GITHUB_PRIVATE_KEY
    
    if (!privateKey) {
      throw new Error('GITHUB_PRIVATE_KEY environment variable is required')
    }

    // Clean up the private key format
    const cleanPrivateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/"/g, '')
      .trim()

    this.auth = createAppAuth({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: cleanPrivateKey,
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })

    this.octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: process.env.GITHUB_APP_ID!,
        privateKey: cleanPrivateKey,
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }
    })
  }

  public static getInstance(): GitHubAppAuth {
    if (!GitHubAppAuth.instance) {
      GitHubAppAuth.instance = new GitHubAppAuth()
    }
    return GitHubAppAuth.instance
  }

  // Get installation access token for a specific installation
  async getInstallationToken(installationId: number) {
    try {
      const { data } = await this.octokit.apps.createInstallationAccessToken({
        installation_id: installationId,
      })
      return data.token
    } catch (error) {
      console.error('Failed to create installation token:', error)
      throw error
    }
  }

  // Get app installation for a specific repository
  async getInstallation(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.apps.getRepoInstallation({
        owner,
        repo,
      })
      return data
    } catch (error) {
      console.error('Failed to get installation:', error)
      throw error
    }
  }

  // Create authenticated Octokit instance for a specific installation
  async getAuthenticatedOctokit(installationId: number) {
    const token = await this.getInstallationToken(installationId)
    return new Octokit({ auth: token })
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET!)
      .update(payload)
      .digest('hex')
    
    return `sha256=${expectedSignature}` === signature
  }

  // Get app information
  async getAppInfo() {
    try {
      const { data } = await this.octokit.apps.getAuthenticated()
      return data
    } catch (error) {
      console.error('Failed to get app info:', error)
      throw error
    }
  }

  // List installations
  async getInstallations() {
    try {
      const { data } = await this.octokit.apps.listInstallations()
      return data
    } catch (error) {
      console.error('Failed to get installations:', error)
      throw error
    }
  }
}

// Utility function to create GitHub client with app authentication
export async function createGitHubAppClient(owner: string, repo: string) {
  const auth = GitHubAppAuth.getInstance()
  const installation = await auth.getInstallation(owner, repo)
  return await auth.getAuthenticatedOctokit(installation.id)
}

// Utility function to create GitHub client with user token
export function createGitHubUserClient(accessToken: string) {
  return new Octokit({
    auth: accessToken,
    userAgent: 'Pencil-AI/1.0.0'
  })
}
