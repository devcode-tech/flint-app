'use client'

import React, { createContext, useContext, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a DashboardLayout')
  }
  return context
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <div className="h-screen bg-[#F2F2F2] flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar className={cn(
          "flex-shrink-0 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64 lg:w-72"
        )} isCollapsed={isCollapsed} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header className="flex-shrink-0" />
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <div className="h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
