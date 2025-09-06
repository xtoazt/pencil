"use client"

import { useEffect } from 'react'

interface AdComponentProps {
  className?: string
  style?: React.CSSProperties
}

export function AdComponent({ className = "", style }: AdComponentProps) {
  useEffect(() => {
    // Load Google AdSense script
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2612092132708362'
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    // Initialize ads when script loads
    script.onload = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        }
      } catch (error) {
        console.log('AdSense initialization error:', error)
      }
    }

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '120px', height: '120px' }}
        data-ad-client="ca-pub-2612092132708362"
        data-ad-slot="1915451273"
      />
    </div>
  )
}

// Terminal-styled ad component
export function TerminalAdComponent({ className = "", style }: AdComponentProps) {
  return (
    <div className={`terminal-window ${className}`} style={style}>
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="terminal-dot terminal-dot-red"></div>
          <div className="terminal-dot terminal-dot-yellow"></div>
          <div className="terminal-dot terminal-dot-green"></div>
          <span className="text-xs font-mono text-muted-foreground ml-2">Advertisement</span>
        </div>
      </div>
      <div className="terminal-content flex items-center justify-center p-4">
        <AdComponent />
      </div>
    </div>
  )
}
