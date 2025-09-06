import { NextRequest, NextResponse } from 'next/server'
import { GitHubClient } from '@/lib/github'

export async function POST(request: NextRequest) {
  try {
    const { 
      accessToken, 
      owner, 
      repo, 
      message, 
      files 
    } = await request.json()
    
    if (!accessToken || !owner || !repo || !message || !files) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const github = new GitHubClient(accessToken)
    const commit = await github.createCommit(owner, repo, message, files)
    
    return NextResponse.json({ commit })
  } catch (error) {
    console.error('GitHub commit error:', error)
    return NextResponse.json(
      { error: 'Failed to create commit' },
      { status: 500 }
    )
  }
}
