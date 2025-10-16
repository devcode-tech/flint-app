import React from 'react'
import { CreateContestPage } from '@/components/organisms/CreateContestPage'

export default function CreateContestFullscreenRoute() {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <CreateContestPage />
    </div>
  )
}
