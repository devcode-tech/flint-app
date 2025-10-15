'use client'

import React, { useState } from 'react'
import { Edit, Pause } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/molecules/Breadcrumb'
import { ShareCampaign } from '@/components/organisms/ShareCampaign'
import { LeadsTable } from '@/components/organisms/LeadsTable'
import { AnalyticsView } from '@/components/organisms/AnalyticsView'
import { PickWinnersView } from '@/components/organisms/PickWinnersView'
import { cn } from '@/lib/utils'

interface ContestViewPageProps {
  contestId?: string
  className?: string
}

const tabs = [
  { id: 'preview', label: 'Preview' },
  { id: 'leads', label: 'Leads' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'pick-winners', label: 'Pick Winners' },
]

export const ContestViewPage: React.FC<ContestViewPageProps> = ({ 
  contestId = 'AR-24612474-53',
  className 
}) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('preview')

  const breadcrumbItems = [
    { label: 'Contests', href: '/contests' },
    { label: contestId, href: `/contests/${contestId}` },
  ]

  const handleEditClick = () => {
    router.push(`/contests/${contestId}/edit`)
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="bg-white border-b border-[#E4E7EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-6 lg:px-8 py-5">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#005EB8] text-[#005EB8] rounded-lg hover:bg-[#005EB8] hover:text-white transition-all duration-200 font-medium text-sm"
            >
              <Edit size={18} />
              <span>Edit</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#005EB8] text-white rounded-lg hover:bg-[#004A94] transition-all duration-200 font-medium text-sm shadow-sm">
              <Pause size={18} />
              <span>Pause</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-[#E4FFF5] border-b border-[#E4E7EC]">
        <div className="flex justify-center items-center py-2">
          <span className="text-[#0C8053] font-medium text-sm">
            This contest is Active
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#F9FAFB]">
        <div className="px-6 lg:px-8 py-6">
          {/* Tabs */}
          <div className="flex border-b border-[#E4E7EC] mb-6 bg-white rounded-t-xl px-6 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 relative',
                  activeTab === tab.id
                    ? 'text-[#005EB8] border-[#005EB8]'
                    : 'text-[#637083] border-transparent hover:text-[#141C25] hover:border-[#E4E7EC]'
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#005EB8] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-[#E4E7EC] min-h-[600px]">
            {activeTab === 'preview' ? (
              <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-[600px]">
                {/* Left Panel - Share Campaign */}
                <div className="w-full lg:w-[430px] lg:flex-shrink-0">
                  <ShareCampaign contestUrl={`https://example.com/contest/${contestId}`} />
                </div>

                {/* Right Panel - Contest Preview */}
                <div className="flex-1 min-w-0">
                  <ContestPreviewPanel />
                </div>
              </div>
            ) : activeTab === 'leads' ? (
              <div className="p-6">
                <LeadsTable />
              </div>
            ) : activeTab === 'analytics' ? (
              <div className="p-6">
                <AnalyticsView />
              </div>
            ) : activeTab === 'pick-winners' ? (
              <div className="p-6">
                <PickWinnersView />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-[#637083]">
                <p className="text-center">
                  Content for {tabs.find(tab => tab.id === activeTab)?.label} tab coming soon...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


// Contest Preview Panel Component
const ContestPreviewPanel: React.FC = () => {
  return (
    <div className="h-full p-6 border border-[#E4E7EC] rounded-xl bg-[#FAFBFC] flex flex-col items-center gap-6 shadow-sm">
      {/* Header Section */}
      <div className="w-full text-center mb-4">
        <h3 className="text-lg font-semibold text-[#141C25] mb-2">Contest Preview</h3>
        <p className="text-sm text-[#637083]">Preview how your contest will appear to participants</p>
      </div>
      
      {/* Header Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-[#E2F1FF] to-[#B8E0FF] rounded-xl flex-shrink-0 flex items-center justify-center border border-[#E4E7EC]">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/50 rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#005EB8]/20 rounded-full"></div>
          </div>
          <p className="text-[#637083] text-sm font-medium">Header Image</p>
        </div>
      </div>
      
      {/* Form Fields Placeholders */}
      <div className="w-full max-w-[500px] flex flex-col gap-4">
        <div className="text-center mb-2">
          <p className="text-sm font-medium text-[#637083]">Entry Form Fields</p>
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-full h-[42px] bg-white rounded-lg border border-[#E4E7EC] shadow-sm flex items-center px-4"
          >
            <div className="w-2 h-2 bg-[#E4E7EC] rounded-full mr-3"></div>
            <div className="w-full h-2 bg-[#F2F2F2] rounded-full"></div>
          </div>
        ))}
        
        {/* Submit Button Placeholder */}
        <div className="w-full h-[42px] bg-[#005EB8] rounded-lg flex items-center justify-center mt-2">
          <span className="text-white text-sm font-semibold">Submit Entry</span>
        </div>
      </div>
      
      {/* Footer Image Placeholder */}
      <div className="w-full h-[100px] bg-gradient-to-br from-[#E2F1FF] to-[#B8E0FF] rounded-xl flex-shrink-0 mt-auto flex items-center justify-center border border-[#E4E7EC]">
        <p className="text-[#637083] text-sm font-medium">Footer Content</p>
      </div>
    </div>
  )
}

export default ContestViewPage
