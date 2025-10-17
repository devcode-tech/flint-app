'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface PostCapturePreviewProps {
  title?: string
  description?: string
  url?: string
  className?: string
}

export const PostCapturePreview: React.FC<PostCapturePreviewProps> = ({
  title,
  description,
  url,
  className
}) => {
  const hasContent = title || description || url
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    // Load confetti animation from public folder
    fetch('/animations/confetti.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load confetti animation:', err))
  }, [])

  return (
    <div className={cn('flex h-full flex-col rounded-xl bg-white overflow-auto p-4 lg:p-6', className)}>
      <h3 className="text-lg font-semibold text-[#141C25] mb-4">Thank You Preview</h3>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md relative">
          {/* Lottie Confetti Animation */}
          {animationData && (
            <div className="absolute inset-0 pointer-events-none z-10 opacity-60">
              <Lottie
                animationData={animationData}
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
          
          {hasContent ? (
            // Show actual thank you message
            <div className="relative z-20 bg-gradient-to-br from-[#E2F1FF] to-[#B8E0FF] rounded-2xl p-8 text-center space-y-4 border border-[#E4E7EC] shadow-lg">
              <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#005EB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {title && (
                <h2 className="text-2xl font-bold text-[#141C25]">
                  {title}
                </h2>
              )}
              
              {description && (
                <p className="text-[#637083] text-base leading-relaxed">
                  {description}
                </p>
              )}
              
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-3 text-blue-600 font-medium"
                >
                  {url}
                </a>
              )}
            </div>
          ) : (
            // Show placeholder
            <div className="relative z-20 bg-gradient-to-br from-[#F9FAFB] to-[#E4E7EC] rounded-2xl p-8 text-center space-y-4 border-2 border-dashed border-[#C1C7CD]">
              <div className="w-16 h-16 bg-white/50 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#637083]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-xl font-semibold text-[#637083]">
                Thank You!
              </h2>
              
              <p className="text-[#97A1AF] text-sm">
                Your thank you message will appear here after form submission
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-[#F9FAFB] rounded-lg border border-[#E4E7EC]">
        <p className="text-xs text-[#637083] text-center">
          This is how participants will see the thank you message after submitting the contest form
        </p>
      </div>
    </div>
  )
}
