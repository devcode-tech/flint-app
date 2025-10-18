'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
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
    // Load confetti animation from public CDN
    fetch('https://assets2.lottiefiles.com/packages/lf20_rovf9gzu.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load confetti animation:', err))
  }, [])

  return (
    <div className={cn('flex h-full flex-col rounded-xl bg-white overflow-auto p-4 lg:p-6', className)}>
      <h3 className="text-lg font-semibold text-[#141C25] mb-4">Thank You Preview</h3>
      
      <div className="flex-1 flex items-center justify-center">
        {hasContent ? (
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
            
            {/* Show actual thank you message */}
            <div className="relative z-20 bg-gradient-to-br rounded-2xl p-8 text-center space-y-4 border border-[#E4E7EC] shadow-lg">
              <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#005EB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {title && (
                <div 
                  className="prose prose-base max-w-none [&>*]:text-center [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-[#141C25] [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-[#141C25] [&>h2]:mb-3 [&>p]:text-[#637083] [&>p]:text-base [&>p]:leading-relaxed [&>p]:mb-2 [&>a]:text-blue-600 [&>a]:font-medium [&>a]:underline [&>strong]:font-bold [&>strong]:text-[#141C25] [&>em]:italic [&>ul]:text-left [&>ul]:mx-auto [&>ul]:max-w-xs [&>ol]:text-left [&>ol]:mx-auto [&>ol]:max-w-xs"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
            </div>
          </div>
        ) : (
          // Show SVG placeholder
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/List is empty 1.svg"
              alt="Empty preview"
              width={300}
              height={300}
              className="opacity-60"
            />
            <p className="text-[#97A1AF] text-sm mt-4 text-center">
              Your thank you message will appear here
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-[#F9FAFB] rounded-lg border border-[#E4E7EC]">
        <p className="text-xs text-[#637083] text-center">
          This is how participants will see the thank you message after submitting the contest form
        </p>
      </div>
    </div>
  )
}
