import { NextRequest, NextResponse } from 'next/server'
import { GitHubOAuth } from '@/lib/github'
import { getSql } from '@/lib/database'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code not provided' },
        { status: 400 }
      )
    }

    // Exchange code for access token
    const tokenData = await GitHubOAuth.exchangeCodeForToken(code)
    
    if (tokenData.error) {
      return NextResponse.json(
        { error: tokenData.error_description || 'Failed to exchange code for token' },
        { status: 400 }
      )
    }

    const accessToken = tokenData.access_token
    
    // Get user info from GitHub to verify the token
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to verify GitHub token' },
        { status: 400 }
      )
    }
    
    const githubUser = await userResponse.json()
    
    // Store the GitHub token in the database associated with the user
    const sql = getSql()
    
    // For now, we'll return the token to the frontend with user info
    // In production, you'd store this securely and associate with the user session
    return NextResponse.json({
      success: true,
      accessToken,
      tokenType: tokenData.token_type,
      scope: tokenData.scope,
      user: {
        id: githubUser.id,
        login: githubUser.login,
        name: githubUser.name,
        avatar_url: githubUser.avatar_url
      }
    })
    
  } catch (error) {
    console.error('GitHub callback error:', error)
    return NextResponse.json(
      { error: 'Failed to process GitHub callback' },
      { status: 500 }
    )
  }
}
