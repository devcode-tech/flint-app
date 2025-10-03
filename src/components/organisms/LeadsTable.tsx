'use client'

import React, { useState } from 'react'
import { Search, Calendar, Upload, Eye, MoreVertical, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Lead {
  id: string
  name: string
  email: string
  date: string
  time: string
  status: 'valid' | 'invalid'
  source: string
  sourceUrl: string
  details: string
}

interface LeadsTableProps {
  className?: string
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'joshua.619@icloud.com',
    date: '2025-08-28',
    time: '13:21',
    status: 'valid',
    source: 'Canada',
    sourceUrl: 'https://example.com',
    details: 'https://example.com'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'joshua.619@icloud.com',
    date: '2025-08-28',
    time: '13:21',
    status: 'valid',
    source: 'Canada',
    sourceUrl: 'https://example.com',
    details: 'https://example.com'
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'joshua.619@icloud.com',
    date: '2025-08-28',
    time: '13:21',
    status: 'valid',
    source: 'Canada',
    sourceUrl: 'https://example.com',
    details: 'https://example.com'
  },
  {
    id: '4',
    name: 'John Doe',
    email: 'joshua.619@icloud.com',
    date: '2025-08-28',
    time: '13:21',
    status: 'valid',
    source: 'Canada',
    sourceUrl: 'https://example.com',
    details: 'https://example.com'
  },
  {
    id: '5',
    name: 'John Doe',
    email: 'joshua.619@icloud.com',
    date: '2025-08-28',
    time: '13:21',
    status: 'valid',
    source: 'Canada',
    sourceUrl: 'https://example.com',
    details: 'https://example.com'
  },
  {
    id: '6',
    name: 'John Doe',
    email: 'joshua.619@icloud.com',
    date: '2025-08-28',
    time: '13:21',
    status: 'valid',
    source: 'Canada',
    sourceUrl: 'https://example.com',
    details: 'https://example.com'
  },
  {
    id: '7',
    name: 'John Doe',
    email: 'joshua.619@icloud.com',
    date: '2025-08-28',
    time: '13:21',
    status: 'valid',
    source: 'Canada',
    sourceUrl: 'https://example.com',
    details: 'https://example.com'
  },
  {
    id: '8',
    name: 'John Doe',
    email: 'joshua.619@icloud.com',
    date: '2025-08-28',
    time: '13:21',
    status: 'valid',
    source: 'Canada',
    sourceUrl: 'https://example.com',
    details: 'https://example.com'
  },
  {
    id: '9',
    name: 'John Doe',
    email: 'joshua.619@icloud.com',
    date: '2025-08-28',
    time: '13:21',
    status: 'valid',
    source: 'Canada',
    sourceUrl: 'https://example.com',
    details: 'https://example.com'
  },
  {
    id: '10',
    name: 'John Doe',
    email: 'joshua.619@icloud.com',
    date: '2025-08-28',
    time: '13:21',
    status: 'valid',
    source: 'Canada',
    sourceUrl: 'https://example.com',
    details: 'https://example.com'
  }
]

export const LeadsTable: React.FC<LeadsTableProps> = ({ className }) => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(mockLeads.map(lead => lead.id))
    } else {
      setSelectedLeads([])
    }
  }

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId])
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId))
    }
  }

  const isAllSelected = selectedLeads.length === mockLeads.length
  const isIndeterminate = selectedLeads.length > 0 && selectedLeads.length < mockLeads.length

  return (
    <div className={cn('flex w-full py-0 px-0 flex-col items-start gap-6 rounded-2xl', className)}>
      {/* Header */}
      <div className="flex justify-between items-start self-stretch">
        {/* Search Input */}
        <div className="flex w-[263px] flex-col items-start gap-2">
          <div className="flex py-1.5 px-3 justify-between items-center self-stretch rounded border border-[#E4E7EC] bg-white shadow-sm">
            <div className="flex py-0 px-0 items-center gap-2 flex-1">
              <div className="flex items-start">
                <Search className="w-6 h-6 text-[#637083]" />
              </div>
              <div className="flex py-0 px-0 items-center gap-2 flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-[#637083] text-base font-normal leading-6 outline-none placeholder:text-[#637083]"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button className="flex py-2 px-3 justify-center items-center gap-2 rounded border border-[#E4E7EC] bg-white shadow-sm hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4 text-[#344051]" />
            <div className="text-[#344051] text-center text-sm font-medium leading-5 capitalize">
              Last Month
            </div>
          </button>
          
          <button className="flex py-2 px-5 justify-center items-center gap-2 rounded bg-[#005EB8] shadow-sm hover:bg-[#004A94] transition-colors">
            <Upload className="w-5 h-5 text-white" />
            <div className="text-white text-center text-sm font-medium leading-5 capitalize">
              Export
            </div>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col items-start">
        {/* Table Header */}
        <div className="flex items-center">
          <div className="flex py-2.5 px-5 items-center gap-1 bg-[#F9FAFB]">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-5 h-5 rounded border-[1.5px] border-[#CED2DA] bg-white"
                />
              </div>
            </div>
          </div>
          <div className="flex w-[200px] py-2.5 px-5 items-center gap-1 bg-[#F9FAFB]">
            <div className="flex w-[260px] items-center gap-2 flex-shrink-0">
              <div className="text-[#344051] text-sm font-medium leading-5 capitalize">
                User
              </div>
            </div>
          </div>
          <div className="flex w-[120px] py-2.5 px-5 items-center gap-1 bg-[#F9FAFB]">
            <div className="flex w-[92px] items-center gap-2 flex-shrink-0">
              <div className="text-[#344051] text-sm font-medium leading-5 capitalize">
                Date
              </div>
            </div>
          </div>
          <div className="flex py-2.5 px-5 items-center gap-1 bg-[#F9FAFB]">
            <div className="flex w-[80px] items-center gap-2">
              <div className="text-[#344051] text-sm font-medium leading-5 capitalize">
                Status
              </div>
            </div>
          </div>
          <div className="flex w-[200px] py-2.5 px-5 items-center gap-1 bg-[#F9FAFB]">
            <div className="flex w-[80px] items-center gap-2 flex-shrink-0">
              <div className="text-[#344051] text-sm font-medium leading-5 capitalize">
                Source
              </div>
            </div>
          </div>
          <div className="flex w-[312px] py-2.5 px-5 items-center gap-1 bg-[#F9FAFB]">
            <div className="flex w-[80px] items-center gap-2 flex-shrink-0">
              <div className="text-[#344051] text-sm font-medium leading-5 capitalize">
                Details
              </div>
            </div>
          </div>
          <div className="flex w-[92px] py-2.5 px-5 justify-end items-center gap-1 rounded-tr-lg bg-[#F9FAFB]">
            <div className="flex items-center gap-2 flex-1">
              <div className="text-[#344051] text-sm font-medium leading-5 capitalize">
                Actions
              </div>
            </div>
          </div>
        </div>

        {/* Table Rows */}
        {mockLeads.map((lead) => (
          <div key={lead.id} className="flex items-center">
            <div className="flex h-[68px] py-5 px-5 items-center gap-1.5 border-b border-[#E4E7EC] bg-white">
              <input
                type="checkbox"
                checked={selectedLeads.includes(lead.id)}
                onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                className="w-5 h-5 rounded border-[1.5px] border-[#CED2DA] bg-white"
              />
            </div>
            <div className="flex w-[200px] py-3 px-5 items-center gap-2.5 border-b border-[#E4E7EC] bg-white">
              <div className="flex flex-col justify-center items-start gap-1">
                <div className="text-[#141C25] text-[13px] font-medium leading-5 capitalize">
                  {lead.name}
                </div>
                <div className="text-[#344051] text-[13px] font-normal leading-5">
                  {lead.email}
                </div>
              </div>
            </div>
            <div className="flex w-[120px] h-[68px] py-5 px-5 items-center gap-2.5 border-b border-[#E4E7EC] bg-white">
              <div className="flex flex-col justify-center items-start">
                <div className="text-[#344051] text-[13px] font-medium leading-5">
                  {lead.date}
                  <br />
                  {lead.time}
                </div>
              </div>
            </div>
            <div className="flex w-[120px] h-[68px] py-5 px-5 items-center gap-2.5 border-b border-[#E4E7EC] bg-white">
              <div className="flex py-0.5 px-2 pr-2 items-center gap-1.5 rounded-md bg-[#ECFDF5]">
                <CheckCircle className="w-4 h-4 text-[#10B978] fill-current" />
                <div className="text-[#344051] text-[13px] font-medium leading-5 capitalize">
                  Valid
                </div>
              </div>
            </div>
            <div className="flex w-[200px] h-[68px] py-5 px-5 items-center gap-2.5 border-b border-[#E4E7EC] bg-white">
              <div className="flex flex-col justify-center items-start">
                <div className="flex flex-col justify-center items-start gap-1">
                  <div className="text-[#141C25] text-[13px] font-medium leading-5 capitalize">
                    {lead.source}
                  </div>
                  <div className="text-[#344051] text-[13px] font-normal leading-5">
                    {lead.sourceUrl}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-[312px] h-[68px] py-5 px-5 items-center gap-2.5 border-b border-[#E4E7EC] bg-white">
              <div className="flex flex-col justify-center items-start">
                <div className="text-[#344051] text-[13px] font-medium leading-5">
                  {lead.details}
                </div>
              </div>
            </div>
            <div className="flex w-[92px] h-[68px] py-5 px-5 justify-end items-center gap-3 border-b border-[#E4E7EC] bg-white">
              <Eye className="w-5 h-5 flex-shrink-0 text-[#637083] cursor-pointer hover:text-[#344051] transition-colors" />
              <MoreVertical className="w-5 h-5 flex-shrink-0 text-[#637083] cursor-pointer hover:text-[#344051] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeadsTable
