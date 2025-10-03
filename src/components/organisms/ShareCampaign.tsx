'use client'

import React, { useState } from 'react'
import { Share, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShareCampaignProps {
  contestUrl?: string
  className?: string
}

export const ShareCampaign: React.FC<ShareCampaignProps> = ({ 
  contestUrl = 'https://example.com',
  className 
}) => {
  const [url, setUrl] = useState(contestUrl)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  return (
    <div className={cn('h-full p-4 border border-[#E4E7EC] rounded-lg bg-white', className)}>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[#141C25] font-semibold text-xl leading-8 tracking-[-0.4px]">
            Share Campaign
          </h2>
          <p className="text-[#344051] text-sm leading-5 capitalize">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
          
          {/* Divider */}
          <div className="w-full h-px bg-[#E4E7EC] mt-2" />
        </div>

        {/* URL Input */}
        <div className="flex flex-col gap-2">
          <label className="text-[#141C25] font-medium text-sm leading-5">
            URL of the contest
          </label>
          
          <div className="flex items-center justify-between px-3 py-3 border border-[#E4E7EC] rounded bg-[#F2F2F2] shadow-sm">
            <input
              type="text"
              value={url}
              onChange={handleUrlChange}
              className="flex-1 bg-transparent text-[#97A1AF] text-base leading-6 outline-none placeholder:text-[#97A1AF]"
              placeholder="https://example.com"
            />
            
            <button
              onClick={handleShare}
              className={cn(
                "ml-2 p-1 rounded transition-colors",
                copied 
                  ? "bg-green-100 text-green-600" 
                  : "hover:bg-[#E4E7EC] text-[#141C25]"
              )}
              title={copied ? "Copied!" : "Copy URL"}
            >
              {copied ? (
                <Check size={20} />
              ) : (
                <Share size={20} />
              )}
            </button>
          </div>
          
          {copied && (
            <p className="text-green-600 text-xs mt-1">
              URL copied to clipboard!
            </p>
          )}
        </div>

        {/* Additional Actions */}
        <div className="flex flex-col gap-3 mt-4">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E4E7EC] rounded-lg text-[#344051] hover:bg-[#F9FAFB] transition-colors">
            <Copy size={16} />
            <span className="text-sm font-medium">Copy Link</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#005EB8] text-white rounded-lg hover:bg-[#004A94] transition-colors">
            <Share size={16} />
            <span className="text-sm font-medium">Share Campaign</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareCampaign
