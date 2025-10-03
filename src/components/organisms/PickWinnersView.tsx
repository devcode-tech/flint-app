'use client'

import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Participant {
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

interface PickWinnersViewProps {
  className?: string
}

const mockParticipants: Participant[] = [
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
  }
]

export const PickWinnersView: React.FC<PickWinnersViewProps> = ({ className }) => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedParticipants(mockParticipants.map(p => p.id))
    } else {
      setSelectedParticipants([])
    }
  }

  const handleSelectParticipant = (participantId: string, checked: boolean) => {
    if (checked) {
      setSelectedParticipants(prev => [...prev, participantId])
    } else {
      setSelectedParticipants(prev => prev.filter(id => id !== participantId))
    }
  }

  const handlePickWinner = (participantId: string) => {
    // Handle picking a winner for a specific participant
    console.log('Picking winner:', participantId)
  }

  const handlePickRandomWinner = () => {
    // Handle picking a random winner from all valid participants
    console.log('Picking random winner')
  }

  const isAllSelected = selectedParticipants.length === mockParticipants.length
  const isIndeterminate = selectedParticipants.length > 0 && selectedParticipants.length < mockParticipants.length

  return (
    <div className={cn('flex w-full py-0 px-0 flex-col items-start gap-5 rounded-2xl', className)}>
      {/* Blue Banner Section */}
      <div className="flex py-3 px-3 flex-col justify-center items-start gap-2 self-stretch bg-[#EDF5FF] rounded-lg">
        <div className="flex justify-between items-center self-stretch">
          <div className="flex flex-col items-start gap-2">
            <div className="text-[#141C25] text-xl font-semibold leading-8 tracking-[-0.4px]">
              Pick a Random Winner
            </div>
          </div>
          <button 
            onClick={handlePickRandomWinner}
            className="flex py-2 px-5 justify-center items-center gap-2 rounded bg-[#005EB8] shadow-[0_1px_2px_0_rgba(20,28,37,0.04)] hover:bg-[#004A94] transition-colors"
          >
            <div className="text-white text-center text-sm font-medium leading-5 capitalize">
              Pick a Winner
            </div>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col items-start gap-6 self-stretch rounded-2xl">
        <div className="flex flex-col items-start">
          {/* Table Header */}
          <div className="flex items-center">
            <div className="flex py-2.5 px-5 items-center gap-1 bg-[#F9FAFB]">
              <div className="flex items-center gap-2">
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
            <div className="flex w-[244px] py-2.5 px-5 items-center gap-1 bg-[#F9FAFB]">
              <div className="flex w-[80px] items-center gap-2 flex-shrink-0">
                <div className="text-[#344051] text-sm font-medium leading-5 capitalize">
                  Details
                </div>
              </div>
            </div>
            <div className="flex w-[160px] py-2.5 px-5 justify-end items-center gap-1 rounded-tr-lg bg-[#F9FAFB]">
              <div className="flex items-center gap-2 flex-1">
                <div className="text-[#344051] text-sm font-medium leading-5 capitalize">
                  Actions
                </div>
              </div>
            </div>
          </div>

          {/* Table Rows */}
          {mockParticipants.map((participant) => (
            <div key={participant.id} className="flex items-center">
              <div className="flex h-[68px] py-5 px-5 items-center gap-1.5 border-b border-[#E4E7EC] bg-white">
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(participant.id)}
                  onChange={(e) => handleSelectParticipant(participant.id, e.target.checked)}
                  className="w-5 h-5 rounded border-[1.5px] border-[#CED2DA] bg-white"
                />
              </div>
              <div className="flex w-[200px] py-3 px-5 items-center gap-2.5 border-b border-[#E4E7EC] bg-white">
                <div className="flex flex-col justify-center items-start gap-1">
                  <div className="text-[#141C25] text-[13px] font-medium leading-5 capitalize">
                    {participant.name}
                  </div>
                  <div className="text-[#344051] text-[13px] font-normal leading-5">
                    {participant.email}
                  </div>
                </div>
              </div>
              <div className="flex w-[120px] h-[68px] py-5 px-5 items-center gap-2.5 border-b border-[#E4E7EC] bg-white">
                <div className="flex flex-col justify-center items-start">
                  <div className="text-[#344051] text-[13px] font-medium leading-5">
                    {participant.date}
                    <br />
                    {participant.time}
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
                      {participant.source}
                    </div>
                    <div className="text-[#344051] text-[13px] font-normal leading-5">
                      {participant.sourceUrl}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-[244px] h-[68px] py-5 px-5 items-center gap-2.5 border-b border-[#E4E7EC] bg-white">
                <div className="flex flex-col justify-center items-start">
                  <div className="text-[#344051] text-[13px] font-medium leading-5">
                    {participant.details}
                  </div>
                </div>
              </div>
              <div className="flex h-[68px] py-5 px-5 justify-end items-center gap-3 border-b border-[#E4E7EC] bg-white">
                <button 
                  onClick={() => handlePickWinner(participant.id)}
                  className="flex py-2 px-5 justify-center items-center gap-2 rounded bg-[#005EB8] shadow-[0_1px_2px_0_rgba(20,28,37,0.04)] hover:bg-[#004A94] transition-colors"
                >
                  <div className="text-white text-center text-sm font-medium leading-5 capitalize">
                    Pick Winner
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PickWinnersView
