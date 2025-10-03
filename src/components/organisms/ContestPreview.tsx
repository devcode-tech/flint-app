'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ContestPreviewProps {
  className?: string
}

export const ContestPreview: React.FC<ContestPreviewProps> = ({ className }) => {
  return (
    <div className={cn('flex h-[776px] p-4 flex-col items-center gap-3 rounded-xl bg-white', className)}>
      {/* Top Preview Section */}
      <div className="w-[626px] h-60 flex-shrink-0 rounded-xl bg-[#E2F1FF]" />
      
      {/* Middle Content Sections */}
      <div className="flex w-[580px] flex-col justify-center items-center gap-4">
        {Array.from({ length: 7 }, (_, index) => (
          <div 
            key={index}
            className="w-[580px] h-[38px] rounded-lg bg-[#F2F2F2]" 
          />
        ))}
      </div>
      
      {/* Bottom Preview Section */}
      <div className="w-[626px] h-[120px] flex-shrink-0 rounded-xl bg-[#E2F1FF]" />
    </div>
  )
}
