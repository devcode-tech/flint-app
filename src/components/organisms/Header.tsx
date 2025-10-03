'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bell, Home, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from './DashboardLayout'

interface HeaderProps {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const pathname = usePathname()
  
  const getBreadcrumbText = () => {
    if (pathname.startsWith('/contests')) {
      return 'Contests'
    }
    return 'Dashboard'
  }
  const { toggleSidebar } = useSidebar()
  
  return (
    <div className={cn(
      'flex px-4 lg:px-6 py-3 lg:py-4 justify-between items-center bg-white border-b border-[#E4E7EC]',
      className
    )}>
      {/* Left side - Menu toggle and Breadcrumbs */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Menu Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="flex p-2 justify-center items-center rounded-lg hover:bg-[#F9FAFB] transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-[#414E62]" />
        </button>
        
        <Link 
          href="/"
          className="flex items-center gap-1.5 text-[#141C25] hover:text-[#005EB8] transition-colors"
        >
          <Home className="w-5 h-5 lg:w-6 lg:h-6" />
          <span className="font-inter text-sm lg:text-base font-normal leading-5 capitalize">
            {getBreadcrumbText()}
          </span>
        </Link>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notifications */}
        <div className="flex justify-end items-center gap-2 lg:gap-3">
          {/* Search Icon Button */}
          <button className="flex p-2 justify-center items-center rounded-lg hover:bg-[#F9FAFB] transition-colors">
            <Search className="w-5 h-5 text-[#414E62]" />
          </button>

          {/* Notification Icon Button with Badge */}
          <button className="relative flex p-2 justify-center items-center rounded-lg hover:bg-[#F9FAFB] transition-colors">
            <Bell className="w-5 h-5 text-[#414E62]" />
            {/* Notification Badge */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-[#005EB8] border border-white rounded-full" />
          </button>
        </div>
      </div>
    </div>
  )
}
