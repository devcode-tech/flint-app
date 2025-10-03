import { ReactNode } from 'react'
import { DashboardLayout } from '@/components/organisms/DashboardLayout'

interface ContestLayoutProps {
  children: ReactNode
}

export default function ContestLayout({ children }: ContestLayoutProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
