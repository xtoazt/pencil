"use client"

import { useEffect } from "react"

interface BottomAdComponentProps {
  className?: string
  style?: React.CSSProperties
}

export function BottomAdComponent({ className = "", style }: BottomAdComponentProps) {
  useEffect(() => {
    // Check if AdSense script is already loaded
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (error) {
        console.log('AdSense initialization error:', error)
      }
    } else {
      // Load Google AdSense script if not already loaded
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]')
      if (!existingScript) {
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
      }
    }
  }, [])

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '350px', height: '90px' }}
        data-ad-client="ca-pub-2612092132708362"
        data-ad-slot="6302538402"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Terminal-styled bottom ad component
export function TerminalBottomAdComponent({ className = "", style }: BottomAdComponentProps) {
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
        <BottomAdComponent />
      </div>
    </div>
  )
}
