import { useState, useEffect, useCallback } from 'react'

interface Deployment {
  id: string
  name: string
  description: string
  framework: string
  modelType: string
  status: 'building' | 'deployed' | 'failed' | 'stopped'
  subdomain: string
  url: string
  createdAt: Date
  updatedAt: Date
  buildLogs: string[]
  deploymentConfig: {
    environment: string
    buildCommand: string
    startCommand: string
    port: number
  }
}

interface DeploymentStats {
  total: number
  deployed: number
  building: number
  failed: number
  stopped: number
  remainingSlots: number
}

interface UseDeploymentsReturn {
  deployments: Deployment[]
  stats: DeploymentStats | null
  isLoading: boolean
  error: string | null
  createDeployment: (data: Partial<Deployment>) => Promise<Deployment | null>
  stopDeployment: (id: string) => Promise<boolean>
  updateDeployment: (id: string, data: Partial<Deployment>) => Promise<boolean>
  fetchDeploymentLogs: (id: string) => Promise<string[]>
  refreshDeployments: () => Promise<void>
}

export function useDeployments(): UseDeploymentsReturn {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [stats, setStats] = useState<DeploymentStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDeployments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/deployments')
      if (!response.ok) {
        throw new Error('Failed to fetch deployments')
      }
      
      const data = await response.json()
      setDeployments(data.deployments || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching deployments:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/deployments/status')
      if (!response.ok) {
        throw new Error('Failed to fetch deployment stats')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err: any) {
      console.error('Error fetching deployment stats:', err)
    }
  }, [])

  const createDeployment = useCallback(async (data: Partial<Deployment>): Promise<Deployment | null> => {
    try {
      setError(null)
      
      const response = await fetch('/api/deployments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create deployment')
      }

      const result = await response.json()
      const newDeployment = result.deployment
      
      setDeployments(prev => [newDeployment, ...prev])
      await fetchStats() // Refresh stats
      
      return newDeployment
    } catch (err: any) {
      setError(err.message)
      console.error('Error creating deployment:', err)
      return null
    }
  }, [fetchStats])

  const stopDeployment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/deployments/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to stop deployment')
      }

      setDeployments(prev => prev.map(d => 
        d.id === id ? { ...d, status: 'stopped' as const } : d
      ))
      await fetchStats() // Refresh stats
      
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error stopping deployment:', err)
      return false
    }
  }, [fetchStats])

  const updateDeployment = useCallback(async (id: string, data: Partial<Deployment>): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/deployments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update deployment')
      }

      const result = await response.json()
      const updatedDeployment = result.deployment
      
      setDeployments(prev => prev.map(d => 
        d.id === id ? updatedDeployment : d
      ))
      
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating deployment:', err)
      return false
    }
  }, [])

  const fetchDeploymentLogs = useCallback(async (id: string): Promise<string[]> => {
    try {
      const response = await fetch(`/api/deployments/${id}/logs`)
      if (!response.ok) {
        throw new Error('Failed to fetch deployment logs')
      }
      
      const data = await response.json()
      return data.logs || []
    } catch (err: any) {
      console.error('Error fetching deployment logs:', err)
      return []
    }
  }, [])

  const refreshDeployments = useCallback(async () => {
    await Promise.all([fetchDeployments(), fetchStats()])
  }, [fetchDeployments, fetchStats])

  useEffect(() => {
    refreshDeployments()
  }, [refreshDeployments])

  // Poll for status updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const hasBuildingDeployments = deployments.some(d => d.status === 'building')
      if (hasBuildingDeployments) {
        refreshDeployments()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [deployments, refreshDeployments])

  return {
    deployments,
    stats,
    isLoading,
    error,
    createDeployment,
    stopDeployment,
    updateDeployment,
    fetchDeploymentLogs,
    refreshDeployments
  }
}
