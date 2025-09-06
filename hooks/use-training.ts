import { useState, useEffect, useCallback } from 'react'

interface TrainingStats {
  messageCount: number
  conversationCount: number
  isReadyForDeployment: boolean
  progress: number
  firstMessage: string | null
  lastMessage: string | null
  remainingMessages: number
}

interface UseTrainingReturn {
  stats: TrainingStats | null
  isLoading: boolean
  error: string | null
  validateTraining: () => Promise<boolean>
  refreshStats: () => Promise<void>
}

export function useTraining(): UseTrainingReturn {
  const [stats, setStats] = useState<TrainingStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrainingStats = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/training')
      if (!response.ok) {
        throw new Error('Failed to fetch training stats')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching training stats:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const validateTraining = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'validate_training' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to validate training')
      }
      
      const data = await response.json()
      return data.valid
    } catch (err: any) {
      console.error('Error validating training:', err)
      return false
    }
  }, [])

  const refreshStats = useCallback(async () => {
    await fetchTrainingStats()
  }, [fetchTrainingStats])

  useEffect(() => {
    fetchTrainingStats()
  }, [fetchTrainingStats])

  return {
    stats,
    isLoading,
    error,
    validateTraining,
    refreshStats
  }
}
