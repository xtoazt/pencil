"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function GitHubCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')

      if (error) {
        console.error('GitHub OAuth error:', error)
        // Close the popup and show error
        if (window.opener) {
          window.opener.postMessage({ error: 'GitHub OAuth failed' }, '*')
        }
        window.close()
        return
      }

      if (!code) {
        console.error('No authorization code received')
        if (window.opener) {
          window.opener.postMessage({ error: 'No authorization code received' }, '*')
        }
        window.close()
        return
      }

      try {
        // Exchange code for token
        const response = await fetch('/api/github/callback', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        // Store token temporarily and notify parent window
        localStorage.setItem('github_oauth_token', data.accessToken)
        
        if (window.opener) {
          window.opener.postMessage({ 
            success: true, 
            token: data.accessToken,
            user: data.user 
          }, '*')
        }

        // Close the popup
        window.close()
      } catch (error) {
        console.error('Error processing GitHub callback:', error)
        if (window.opener) {
          window.opener.postMessage({ error: 'Failed to process GitHub callback' }, '*')
        }
        window.close()
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
        <p className="text-muted-foreground">Processing GitHub authentication...</p>
      </div>
    </div>
  )
}
