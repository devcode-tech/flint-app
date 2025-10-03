'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  className
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className={cn('flex items-start', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={cn(
            'flex px-5 py-2.5 justify-center items-center gap-2 border-b-2 transition-colors',
            activeTab === tab.id
              ? 'border-[#141C25] text-[#141C25]'
              : 'border-[#E4E7EC] text-[#637083] hover:text-[#344051]'
          )}
        >
          <span className="text-center font-inter text-base font-medium leading-6">
            {tab.label}
          </span>
          {tab.count !== undefined && (
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              activeTab === tab.id
                ? 'bg-[#141C25] text-white'
                : 'bg-[#F2F4F7] text-[#637083]'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
