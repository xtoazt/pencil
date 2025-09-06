import { NextRequest, NextResponse } from 'next/server'
import { GitHubOAuth } from '@/lib/github'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state') || 'pencil-github-auth'
    
    const authUrl = GitHubOAuth.getAuthUrl(state)
    
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('GitHub auth error:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    )
  }
}
