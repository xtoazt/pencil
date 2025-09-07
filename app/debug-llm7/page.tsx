"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Bug } from "lucide-react"

export default function DebugLLM7Page() {
  const [message, setMessage] = useState("Hello, can you respond?")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState("")

  const testLLM7 = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    setError("")
    setResponse("")
    setDebugInfo("")

    try {
      const res = await fetch('/api/debug-llm7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })

      const data = await res.json()

      if (res.ok) {
        setResponse(data.response)
        setDebugInfo(JSON.stringify(data.fullResponse, null, 2))
      } else {
        setError(data.error || 'Failed to get response')
        setDebugInfo(JSON.stringify(data, null, 2))
      }
    } catch (err: any) {
      setError(err.message)
      setDebugInfo(err.stack || 'No stack trace available')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="card-terminal">
          <CardHeader className="terminal-header">
            <CardTitle className="flex items-center gap-2 font-mono">
              <Bug className="h-5 w-5" />
              LLM7 Debug Interface
            </CardTitle>
            <CardDescription className="font-mono text-sm">
              Debug the LLM7 API to identify response issues
            </CardDescription>
          </CardHeader>
          <CardContent className="terminal-content">
            <div className="space-y-4">
              <div>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message to test LLM7..."
                  className="input-terminal font-mono text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && testLLM7()}
                />
              </div>
              
              <Button
                onClick={testLLM7}
                disabled={!message.trim() || isLoading}
                className="btn-terminal w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing LLM7...
                  </>
                ) : (
                  <>
                    <Bug className="h-4 w-4 mr-2" />
                    Test LLM7 API
                  </>
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                  <p className="font-mono text-sm text-red-500 font-semibold">Error:</p>
                  <p className="font-mono text-sm text-red-500">{error}</p>
                </div>
              )}

              {response && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                  <p className="font-mono text-sm text-green-500 font-semibold mb-2">Response:</p>
                  <p className="font-mono text-sm">{response}</p>
                </div>
              )}

              {debugInfo && (
                <div className="p-3 bg-muted border rounded">
                  <p className="font-mono text-sm font-semibold mb-2">Debug Info:</p>
                  <pre className="font-mono text-xs overflow-auto max-h-96 bg-background p-2 rounded border">
                    {debugInfo}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
