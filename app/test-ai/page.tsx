"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MessageSquare } from "lucide-react"

export default function TestAIPage() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const testAI = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    setError("")
    setResponse("")

    try {
      const res = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })

      const data = await res.json()

      if (res.ok) {
        setResponse(data.response)
      } else {
        setError(data.error || 'Failed to get response')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="card-terminal">
          <CardHeader className="terminal-header">
            <CardTitle className="flex items-center gap-2 font-mono">
              <MessageSquare className="h-5 w-5" />
              AI Test Interface
            </CardTitle>
            <CardDescription className="font-mono text-sm">
              Test the AI functionality to ensure it's working properly
            </CardDescription>
          </CardHeader>
          <CardContent className="terminal-content">
            <div className="space-y-4">
              <div>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message to test the AI..."
                  className="input-terminal font-mono text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && testAI()}
                />
              </div>
              
              <Button
                onClick={testAI}
                disabled={!message.trim() || isLoading}
                className="btn-terminal w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing AI...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Test AI Response
                  </>
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                  <p className="font-mono text-sm text-red-500">Error: {error}</p>
                </div>
              )}

              {response && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                  <p className="font-mono text-sm text-green-500 mb-2">AI Response:</p>
                  <p className="font-mono text-sm">{response}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
