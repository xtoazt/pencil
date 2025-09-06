import { NextRequest, NextResponse } from 'next/server'
import { GitHubClient } from '@/lib/github'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accessToken = searchParams.get('accessToken')
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      )
    }

    const github = new GitHubClient(accessToken)
    const repos = await github.getRepositories()
    
    return NextResponse.json({ repos })
  } catch (error) {
    console.error('GitHub repos error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, name, description, private: isPrivate } = await request.json()
    
    if (!accessToken || !name) {
      return NextResponse.json(
        { error: 'Access token and repository name required' },
        { status: 400 }
      )
    }

    const github = new GitHubClient(accessToken)
    const repo = await github.createRepository({
      name,
      description,
      private: isPrivate || false,
      autoInit: true
    })
    
    return NextResponse.json({ repo })
  } catch (error) {
    console.error('GitHub create repo error:', error)
    return NextResponse.json(
      { error: 'Failed to create repository' },
      { status: 500 }
    )
  }
}
