"use client"

import { useEffect, useState } from "react"
import { Brain, Heart, Info } from "lucide-react"

interface SubtleAdProps {
  className?: string
  showMessage?: boolean
}

export function SubtleAd({ className = "", showMessage = true }: SubtleAdProps) {
  const [showAd, setShowAd] = useState(false)
  const [adLoaded, setAdLoaded] = useState(false)

  useEffect(() => {
    // Only load ads on client side and after a delay
    const timer = setTimeout(() => {
      setShowAd(true)
      loadAdSense()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const loadAdSense = () => {
    try {
      // Load Google AdSense script
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2612092132708362'
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)

      script.onload = () => {
        // Initialize the ad
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
            setAdLoaded(true)
          } catch (error) {
            console.log('AdSense initialization failed:', error)
          }
        }
      }
    } catch (error) {
      console.log('AdSense loading failed:', error)
    }
  }

  if (!showAd) {
    return null
  }

  return (
    <div className={`mt-16 pt-8 border-t border-border/20 ${className}`}>
      <div className="flex items-center justify-center">
        <div className="text-center space-y-3 opacity-30 hover:opacity-50 transition-opacity">
          {showMessage && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Heart className="h-3 w-3" />
              <span>We display ads to keep Pencil AI free for everyone. Your support helps us maintain and improve our services.</span>
            </div>
          )}
          
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-border/30 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Info className="h-3 w-3" />
                Advertisement
              </div>
              
              {/* Placeholder for actual ad */}
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center border border-border/20 relative overflow-hidden">
                {/* Fallback design */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-xs font-medium text-foreground">AI-Powered</div>
                  <div className="text-xs text-muted-foreground">Solutions</div>
                </div>
                
                {/* Actual AdSense ad (hidden by default, shown when loaded) */}
                <div 
                  className={`absolute inset-0 ${adLoaded ? 'block' : 'hidden'}`}
                  style={{ opacity: adLoaded ? 1 : 0 }}
                >
                  <ins 
                    className="adsbygoogle"
                    style={{ display: 'inline-block', width: '128px', height: '128px' }}
                    data-ad-client="ca-pub-2612092132708362"
                    data-ad-slot="1915451273"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground/50">
            <span>Thank you for supporting free AI tools</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Alternative minimal version for other pages
export function MinimalAd({ className = "" }: { className?: string }) {
  const [showAd, setShowAd] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAd(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!showAd) {
    return null
  }

  return (
    <div className={`opacity-20 hover:opacity-30 transition-opacity ${className}`}>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Heart className="h-3 w-3" />
          <span>Ads help keep Pencil AI free</span>
        </div>
      </div>
    </div>
  )
}
