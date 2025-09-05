"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Bell,
  BellOff,
  Settings
} from "lucide-react"

export interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
  duration?: number
  persistent?: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  isEnabled: boolean
  toggleNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Load notification preferences from localStorage
    const saved = localStorage.getItem("notifications-enabled")
    if (saved !== null) {
      setIsEnabled(JSON.parse(saved))
    }
  }, [])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    if (!isEnabled) return

    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      duration: notification.duration || 5000,
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-remove notification after duration (unless persistent)
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, newNotification.duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const toggleNotifications = () => {
    const newValue = !isEnabled
    setIsEnabled(newValue)
    localStorage.setItem("notifications-enabled", JSON.stringify(newValue))
    
    if (newValue) {
      addNotification({
        type: "success",
        title: "Notifications Enabled",
        message: "You'll now receive notifications for important events.",
        duration: 3000,
      })
    } else {
      clearAllNotifications()
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        isEnabled,
        toggleNotifications,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

function NotificationContainer() {
  const { notifications, removeNotification, clearAllNotifications, isEnabled } = useNotifications()

  if (!isEnabled || notifications.length === 0) {
    return null
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "info":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.length > 1 && (
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary" className="text-xs">
            {notifications.length} notifications
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearAllNotifications}
            className="h-6 px-2 text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
      
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`card-minimal border-l-4 ${getTypeColor(notification.type)} animate-in slide-in-from-right-full duration-300`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground">
                  {notification.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                
                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {notification.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={action.variant || "outline"}
                        onClick={action.action}
                        className="h-7 px-3 text-xs"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeNotification(notification.id)}
                className="h-6 w-6 p-0 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Notification Controls Component
export function NotificationControls() {
  const { isEnabled, toggleNotifications, addNotification } = useNotifications()

  const testNotification = () => {
    addNotification({
      type: "info",
      title: "Test Notification",
      message: "This is a test notification to verify the system is working.",
      duration: 3000,
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={toggleNotifications}
        className="flex items-center gap-2"
      >
        {isEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
        {isEnabled ? "Enabled" : "Disabled"}
      </Button>
      
      {isEnabled && (
        <Button
          size="sm"
          variant="ghost"
          onClick={testNotification}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Test
        </Button>
      )}
    </div>
  )
}

// Hook for easy notification creation
export function useNotificationHelpers() {
  const { addNotification } = useNotifications()

  const showSuccess = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: "success",
      title,
      message,
      ...options,
    })
  }

  const showError = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: "error",
      title,
      message,
      persistent: true,
      ...options,
    })
  }

  const showWarning = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: "warning",
      title,
      message,
      ...options,
    })
  }

  const showInfo = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: "info",
      title,
      message,
      ...options,
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
