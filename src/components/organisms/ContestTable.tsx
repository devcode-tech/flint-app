'use client'

import React, { useState } from 'react'
import { Eye, MoreVertical, Calendar, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ToggleSwitch } from '@/components/atoms/ToggleSwitch'
import { cn } from '@/lib/utils'
import type { Contest, ContestTableProps } from '@/types/contest'

export const ContestTable: React.FC<ContestTableProps> = ({
  contests,
  onStatusToggle,
  onView,
  onAction
}) => {
  const router = useRouter()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleDropdownToggle = (contestId: string) => {
    setActiveDropdown(activeDropdown === contestId ? null : contestId)
  }

  const handleActionClick = (contestId: string, action: string) => {
    onAction(contestId, action)
    setActiveDropdown(null)
  }

  const handleViewContest = (contestId: string) => {
    // Navigate to view page
    router.push(`/contests/${contestId}`)
  }

  const handleEditContest = (contestId: string) => {
    // Navigate to edit page
    router.push(`/contests/${contestId}/edit`)
  }

  return (
    <div className="flex flex-col items-start w-full bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Table Container with horizontal scroll on mobile */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-full">
          {/* Table Header */}
          <div className="flex items-center w-full">
            <div className="flex px-3 lg:px-5 py-3 lg:py-4 items-center gap-1 bg-[#F9FAFB] w-20 lg:w-24 flex-shrink-0">
              <div className="text-[#344051] text-xs lg:text-sm font-semibold leading-5">
                Status
              </div>
            </div>
            <div className="flex flex-1 px-3 lg:px-5 py-3 lg:py-4 items-center gap-1 bg-[#F9FAFB] min-w-[200px]">
              <div className="text-[#344051] text-xs lg:text-sm font-semibold leading-5">
                Name
              </div>
            </div>
            <div className="flex px-3 lg:px-5 py-3 lg:py-4 items-center gap-1 bg-[#F9FAFB] w-28 lg:w-32 flex-shrink-0">
              <div className="text-[#344051] text-xs lg:text-sm font-semibold leading-5">
                Created Date
              </div>
            </div>
            <div className="flex px-3 lg:px-5 py-3 lg:py-4 items-center gap-1 bg-[#F9FAFB] w-24 lg:w-28 flex-shrink-0">
              <div className="text-[#344051] text-xs lg:text-sm font-semibold leading-5">
                Impression
              </div>
            </div>
            <div className="flex px-3 lg:px-5 py-3 lg:py-4 items-center gap-1 bg-[#F9FAFB] w-24 lg:w-28 flex-shrink-0">
              <div className="text-[#344051] text-xs lg:text-sm font-semibold leading-5">
                Conversion
              </div>
            </div>
            <div className="flex px-3 lg:px-5 py-3 lg:py-4 items-center gap-1 bg-[#F9FAFB] w-28 lg:w-32 flex-shrink-0">
              <div className="text-[#344051] text-xs lg:text-sm font-semibold leading-5">
                Conversion %
              </div>
            </div>
            <div className="flex w-16 lg:w-20 px-3 lg:px-5 py-3 lg:py-4 justify-end items-center gap-1 bg-[#F9FAFB] flex-shrink-0">
              <div className="text-[#344051] text-xs lg:text-sm font-semibold leading-5">
                Actions
              </div>
            </div>
          </div>

          {/* Table Rows */}
          {contests.map((contest, index) => (
            <div key={contest.id} className={cn("flex items-center w-full relative hover:bg-[#F9FAFB] transition-colors", index % 2 === 0 ? "bg-white" : "bg-[#FAFBFC]")}>
              {/* Status Column */}
              <div className="flex w-20 lg:w-24 px-3 lg:px-5 py-4 lg:py-5 items-center gap-1.5 flex-shrink-0">
                <ToggleSwitch
                  checked={contest.status === 'active'}
                  onChange={(checked) => onStatusToggle(contest.id, checked)}
                  size="small"
                />
              </div>

              {/* Name Column */}
              <div className="flex flex-1 px-3 lg:px-5 py-4 lg:py-5 items-center gap-2.5 min-w-[200px]">
                <button
                  onClick={() => handleViewContest(contest.id)}
                  className="flex flex-col justify-center items-start min-w-0 text-left hover:opacity-80 transition-opacity"
                >
                  <div className="text-[#141C25] text-xs lg:text-sm font-semibold leading-5 truncate w-full hover:text-[#005EB8] transition-colors">
                    {contest.name}
                  </div>
                </button>
              </div>

              {/* Created Date Column */}
              <div className="flex w-28 lg:w-32 px-3 lg:px-5 py-4 lg:py-5 items-center gap-2.5 flex-shrink-0">
                <div className="flex flex-col justify-center items-start">
                  <div className="text-[#637083] text-xs lg:text-sm font-medium leading-5">
                    {contest.createdDate}
                  </div>
                </div>
              </div>

              {/* Impression Column */}
              <div className="flex w-24 lg:w-28 px-3 lg:px-5 py-4 lg:py-5 items-center gap-2.5 flex-shrink-0">
                <div className="flex flex-col justify-center items-start">
                  <div className="text-[#637083] text-xs lg:text-sm font-medium leading-5">
                    {contest.impression.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Conversion Column */}
              <div className="flex w-24 lg:w-28 px-3 lg:px-5 py-4 lg:py-5 items-center gap-2.5 flex-shrink-0">
                <div className="flex flex-col justify-center items-start">
                  <div className="text-[#637083] text-xs lg:text-sm font-medium leading-5">
                    {contest.conversion.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Conversion % Column */}
              <div className="flex w-28 lg:w-32 px-3 lg:px-5 py-4 lg:py-5 items-center gap-2.5 flex-shrink-0">
                <div className="flex flex-col justify-center items-start">
                  <div className="text-[#637083] text-xs lg:text-sm font-medium leading-5">
                    {contest.conversionRate}%
                  </div>
                </div>
              </div>

              {/* Actions Column */}
              <div className="flex w-16 lg:w-20 px-3 lg:px-5 py-4 lg:py-5 justify-end items-center gap-2 lg:gap-3 flex-shrink-0">
                <button
                  onClick={() => handleViewContest(contest.id)}
                  className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 text-[#637083] hover:text-[#344051] transition-colors"
                  title="View Contest"
                >
                  <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => handleDropdownToggle(contest.id)}
                    className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 text-[#637083] hover:text-[#344051] transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {activeDropdown === contest.id && (
                    <div className="absolute right-0 top-6 z-10 bg-white border border-[#E4E7EC] rounded-lg shadow-lg min-w-[160px]">
                      <button
                        onClick={() => handleEditContest(contest.id)}
                        className="flex w-full px-3 py-2 text-left text-sm text-[#344051] hover:bg-[#F9FAFB] items-center gap-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleActionClick(contest.id, 'duplicate')}
                        className="flex w-full px-3 py-2 text-left text-sm text-[#344051] hover:bg-[#F9FAFB] items-center gap-2"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleActionClick(contest.id, 'share')}
                        className="flex w-full px-3 py-2 text-left text-sm text-[#344051] hover:bg-[#F9FAFB] items-center gap-2"
                      >
                        Share URL
                      </button>
                      <button
                        onClick={() => handleActionClick(contest.id, 'variations')}
                        className="flex w-full px-3 py-2 text-left text-sm text-[#344051] hover:bg-[#F9FAFB] items-center gap-2"
                      >
                        Create Variations
                      </button>
                      <button
                        onClick={() => handleActionClick(contest.id, 'archive')}
                        className="flex w-full px-3 py-2 text-left text-sm text-[#344051] hover:bg-[#F9FAFB] items-center gap-2"
                      >
                        Archive
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
