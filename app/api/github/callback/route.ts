import { NextRequest, NextResponse } from 'next/server'
import { GitHubOAuth } from '@/lib/github'
import { getSql } from '@/lib/database'
import { verifyToken } from '@/lib/auth'

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

    // Get user from token (we'll need to extract user ID from the request)
    // For now, we'll store the token and let the frontend handle user association
    const accessToken = tokenData.access_token
    
    // Store the GitHub token in the database
    // This is a simplified approach - in production, you'd want to associate with the authenticated user
    const sql = getSql()
    
    // For now, return the token to the frontend
    // In production, you'd store this securely and associate with the user session
    return NextResponse.json({
      success: true,
      accessToken,
      tokenType: tokenData.token_type,
      scope: tokenData.scope
    })
    
  } catch (error) {
    console.error('GitHub callback error:', error)
    return NextResponse.json(
      { error: 'Failed to process GitHub callback' },
      { status: 500 }
    )
  }
}
