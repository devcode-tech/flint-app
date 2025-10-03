import React from 'react'
import { DashboardLayout } from '@/components/organisms/DashboardLayout'
import { CreateContestPage } from '@/components/organisms/CreateContestPage'

export default function CreateContestPageRoute() {
  return (
    <DashboardLayout>
      <CreateContestPage />
    </DashboardLayout>
  )
}
