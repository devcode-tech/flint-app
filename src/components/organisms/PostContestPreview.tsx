'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PostContestPreviewProps {
  content?: string
  className?: string
}

export const PostContestPreview: React.FC<PostContestPreviewProps> = ({
  content,
  className
}) => {
  const hasContent = content && content !== '<p></p>' && content.trim() !== ''

  return (
    <div className={cn('flex h-full flex-col rounded-xl bg-white overflow-auto p-4 lg:p-6', className)}>
      <h3 className="text-lg font-semibold text-[#141C25] mb-4">Post-Contest Preview</h3>
      
      <div className="flex-1 flex items-center justify-center">
        {hasContent ? (
          <div className="w-full max-w-md">
            {/* Show actual post-contest message */}
            <div className="relative z-20 rounded-2xl p-8 bg-white border border-[#E4E7EC] shadow-lg">
              <div className="w-16 h-16 bg-[#F9FAFB] rounded-full mx-auto flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#637083]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div 
                className="prose prose-base max-w-none [&>*]:text-center [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-[#141C25] [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-[#141C25] [&>h2]:mb-3 [&>p]:text-[#637083] [&>p]:text-base [&>p]:leading-relaxed [&>p]:mb-2 [&>a]:text-blue-600 [&>a]:font-medium [&>a]:underline [&>strong]:font-bold [&>strong]:text-[#141C25] [&>em]:italic [&>ul]:text-left [&>ul]:mx-auto [&>ul]:max-w-xs [&>ol]:text-left [&>ol]:mx-auto [&>ol]:max-w-xs"
                dangerouslySetInnerHTML={{ __html: content }}
              />
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
              Your post-contest message will appear here
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-[#F9FAFB] rounded-lg border border-[#E4E7EC]">
        <p className="text-xs text-[#637083] text-center">
          This is how participants will see the message after the contest has ended
        </p>
      </div>
    </div>
  )
}
