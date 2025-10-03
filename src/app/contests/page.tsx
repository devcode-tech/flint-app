import React from 'react'
import { DashboardLayout } from '@/components/organisms/DashboardLayout'
import { ContestListing } from '@/components/organisms/ContestListing'

export default function ContestsPage() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
        <ContestListing />
      </div>
    </DashboardLayout>
  )
}
