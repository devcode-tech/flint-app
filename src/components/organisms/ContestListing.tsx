'use client'

import React, { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Search, Calendar, Plus } from 'lucide-react'
import { Tabs } from '@/components/molecules/Tabs'
import { ContestTable } from '@/components/organisms/ContestTable'
import { Pagination } from '@/components/molecules/Pagination'
import { cn } from '@/lib/utils'
import type { Contest, ContestFilters } from '@/types/contest'

// Mock data - using deterministic status to avoid hydration mismatch
const mockContests: Contest[] = Array.from({ length: 50 }, (_, i) => ({
  id: `AR-24612474-${53 + i}`,
  name: `AR-24612474-${53 + i}`,
  status: i % 2 === 0 ? 'active' : 'inactive',
  createdDate: '03/25/24',
  impression: 10000,
  conversion: 9000,
  conversionRate: 90
}))

const tabs = [
  { id: 'active', label: 'Active', count: 32 },
  { id: 'completed', label: 'Completed', count: 18 },
  { id: 'drafts', label: 'Drafts', count: 5 },
  { id: 'scheduled', label: 'Scheduled', count: 3 }
]

export const ContestListing: React.FC = () => {
  const [filters, setFilters] = useState<ContestFilters>({
    tab: 'active',
    search: '',
    dateRange: 'Last Month'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const contestsPerPage = 10

  // Memoize filtered contests to avoid recalculation on every render
  const filteredContests = useMemo(() => {
    return mockContests.filter(contest => {
      const matchesTab = filters.tab === 'active' ? contest.status === 'active' : true
      const matchesSearch = contest.name.toLowerCase().includes(filters.search.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [filters.tab, filters.search])

  // Memoize pagination calculations
  const { totalPages, paginatedContests } = useMemo(() => {
    const total = Math.ceil(filteredContests.length / contestsPerPage)
    const paginated = filteredContests.slice(
      (currentPage - 1) * contestsPerPage,
      currentPage * contestsPerPage
    )
    return { totalPages: total, paginatedContests: paginated }
  }, [filteredContests, currentPage, contestsPerPage])

  // Memoize callbacks to prevent unnecessary re-renders
  const handleTabChange = useCallback((tabId: string) => {
    setFilters(prev => ({ ...prev, tab: tabId as ContestFilters['tab'] }))
    setCurrentPage(1)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
    setCurrentPage(1)
  }, [])

  const handleStatusToggle = useCallback((contestId: string, status: boolean) => {
    console.log(`Toggle contest ${contestId} to ${status ? 'active' : 'inactive'}`)
  }, [])

  const handleView = useCallback((contestId: string) => {
    console.log(`View contest ${contestId}`)
  }, [])

  const handleAction = useCallback((contestId: string, action: string) => {
    console.log(`Action ${action} on contest ${contestId}`)
  }, [])

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 gap-6">
      {/* Header with Title and Tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#141C25]">Contests</h1>
          <Link
            href="/contests/create"
            className="flex px-4 py-2.5 justify-center items-center gap-2 rounded-lg bg-[#005EB8] shadow-sm hover:bg-[#004A94] transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white text-center text-sm font-semibold">
              New Contest
            </span>
          </Link>
        </div>
        
        <Tabs
          tabs={tabs}
          defaultTab={filters.tab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Table Container */}
      <div className="flex flex-col flex-1 gap-6 min-h-0">
        {/* Filters Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center p-4 bg-[#F9FAFB] rounded-xl border border-[#E4E7EC]">
          {/* Search Input */}
          <div className="flex flex-col gap-2 w-full sm:w-80">
            <div className="flex px-4 py-3 items-center rounded-lg border border-[#E4E7EC] bg-white shadow-sm hover:border-[#005EB8] transition-colors focus-within:border-[#005EB8] focus-within:ring-2 focus-within:ring-[#005EB8]/10">
              <Search className="w-5 h-5 text-[#637083] mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search contests..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="text-[#141C25] text-sm font-normal bg-transparent border-none outline-none flex-1 placeholder:text-[#97A1AF]"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-3 border border-[#E4E7EC] rounded-lg bg-white shadow-sm hover:border-[#005EB8] transition-colors">
              <Calendar className="w-4 h-4 text-[#637083] flex-shrink-0" />
              <select 
                className="text-[#141C25] text-sm font-medium bg-transparent border-none outline-none cursor-pointer min-w-0"
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <option value="Last Month">Last Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last Year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contest Table */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ContestTable
            contests={paginatedContests}
            onStatusToggle={handleStatusToggle}
            onView={handleView}
            onAction={handleAction}
          />
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
