'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, BarChart3, Store, Users, Mail, Calendar, Settings, HelpCircle, LogOut, Ticket } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/atoms/Avatar'
import { cn } from '@/lib/utils'
import type { NavigationItem } from '@/types/dashboard'

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', href: '/' },
  { id: 'stores', label: 'Stores', icon: 'Store', href: '/stores' },
]

const iconMap = {
  BarChart3,
  Store,
  Users,
  Mail,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Ticket,
}

interface SidebarProps {
  className?: string
  isCollapsed?: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ className, isCollapsed = false }) => {
  const pathname = usePathname()
  
  return (
    <div className={cn(
      'flex h-full p-3 lg:p-4 flex-col justify-between border-r border-[#E4E7EC] bg-white overflow-hidden',
      className
    )}>
      {/* Top Section */}
      <div className="flex flex-col gap-1 flex-1 min-h-0">
        {/* User Profile Section */}
        <div className="flex p-2 justify-between items-center rounded-lg">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-[#D7D7D7]/20">
                <div className="w-5 h-4 lg:w-6 lg:h-5 bg-[#297AFF] rounded-sm flex items-center justify-center">
                  <div className="w-3 h-2 lg:w-4 lg:h-3 bg-white rounded-[1px]" />
                </div>
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col justify-center items-start gap-0.5">
                <div className="text-[#141C25] text-sm font-normal leading-5 capitalize">
                  Acme Industries
                </div>
                <div className="text-[#344051] text-xs font-normal leading-4">
                  davidwilli@email.com
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && <ChevronDown className="w-5 h-5 text-[#637083]" />}
        </div>

        {/* Divider */}
        <div className="flex p-2 items-center gap-1.5 self-stretch">
          <div className="h-px flex-1 bg-[#E4E7EC]" />
        </div>

        {/* Navigation Items */}
        {navigationItems.map((item) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap]
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex p-2 items-center gap-1.5 self-stretch rounded-lg cursor-pointer transition-colors',
                isActive ? 'bg-[#EDF5FF]' : 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-1.5 flex-1">
                <div className={cn(
                  'flex w-6 h-6 justify-center items-center rounded-md',
                  isActive ? 'bg-[#005EB8]' : 'bg-[#F2F4F7]'
                )}>
                  {IconComponent && (
                    <IconComponent 
                      className={cn(
                        'w-4 h-4',
                        isActive ? 'text-white' : 'text-[#637083]'
                      )} 
                    />
                  )}
                </div>
                {!isCollapsed && (
                  <div className={cn(
                    'text-sm font-normal leading-5 capitalize',
                    isActive ? 'text-[#005EB8]' : 'text-[#344051]'
                  )}>
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          )
        })}

        {/* Contest Section */}
        <div className="flex flex-col items-start gap-2 self-stretch mt-6">
          {!isCollapsed && (
            <div className="text-[#637083] text-xs font-medium leading-4 uppercase tracking-wide">
              Contest
            </div>
          )}
          
          {/* Contest Item */}
          <Link 
            href="/contests"
            className={cn(
              'flex p-2 items-center gap-1.5 self-stretch rounded-lg transition-colors',
              pathname.startsWith('/contests') ? 'bg-[#EDF5FF]' : 'hover:bg-gray-50'
            )}
          >
            <div className="flex items-center gap-1.5 flex-1">
              <div className={cn(
                'flex w-6 h-6 justify-center items-center rounded-md',
                pathname.startsWith('/contests') ? 'bg-[#005EB8]' : 'bg-[#F2F4F7]'
              )}>
                <Ticket className={cn(
                  'w-4 h-4',
                  pathname.startsWith('/contests') ? 'text-white' : 'text-[#637083]'
                )} />
              </div>
              {!isCollapsed && (
                <div className={cn(
                  'text-sm font-normal leading-5 capitalize',
                  pathname.startsWith('/contests') ? 'text-[#005EB8]' : 'text-[#344051]'
                )}>
                  Contests
                </div>
              )}
            </div>
          </Link>

          {/* Coupons Item */}
          <div className="flex p-2 items-center gap-1.5 self-stretch rounded-lg">
            <div className="flex items-center gap-1.5 flex-1">
              <div className="flex w-6 h-6 justify-center items-center rounded-md bg-[#F2F4F7]">
                <Ticket className="w-4 h-4 text-[#637083]" />
              </div>
              {!isCollapsed && (
                <div className="text-[#344051] text-sm font-normal leading-5 capitalize">
                  Coupons
                </div>
              )}
            </div>
          </div>

          {/* Calendar Item */}
          <div className="flex p-2 items-center gap-1.5 self-stretch rounded-lg">
            <div className="flex items-center gap-1.5 flex-1">
              <div className="flex w-6 h-6 justify-center items-center rounded-md bg-[#F2F4F7]">
                <Calendar className="w-4 h-4 text-[#637083]" />
              </div>
              {!isCollapsed && (
                <div className="text-[#344051] text-sm font-normal leading-5 capitalize">
                  Calendar
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="flex flex-col items-start gap-2 self-stretch mt-6">
          {!isCollapsed && (
            <div className="text-[#637083] text-xs font-medium leading-4 uppercase tracking-wide">
              Users
            </div>
          )}
          
          {/* Email Item */}
          <div className="flex p-2 items-center gap-1.5 self-stretch rounded-lg">
            <div className="flex items-center gap-1.5 flex-1">
              <div className="flex w-6 h-6 justify-center items-center rounded-md bg-[#F2F4F7]">
                <Mail className="w-4 h-4 text-[#637083]" />
              </div>
              {!isCollapsed && (
                <div className="text-[#344051] text-sm font-normal leading-5 capitalize">
                  Email
                </div>
              )}
            </div>
          </div>

          {/* Users Item */}
          <div className="flex p-2 items-center gap-1.5 self-stretch rounded-lg">
            <div className="flex items-center gap-1.5 flex-1">
              <div className="flex w-6 h-6 justify-center items-center rounded-md bg-[#F2F4F7]">
                <Users className="w-4 h-4 text-[#637083]" />
              </div>
              {!isCollapsed && (
                <div className="text-[#344051] text-sm font-normal leading-5 capitalize">
                  Users
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-start gap-2 self-stretch">
        {/* Premium Plan */}
        {!isCollapsed && (
          <div className="flex flex-col items-start gap-2 self-stretch p-4 rounded-lg bg-gradient-to-b from-[#F9FAFB] to-[#F2F4F7]">
            <div className="text-[#141C25] text-sm font-medium leading-5">
              Premium Plan
            </div>
            <div className="text-[#637083] text-xs font-normal leading-4">
              150K OF 500K ENTRIES
            </div>
            <button className="text-[#005EB8] text-sm font-medium leading-5 underline">
              Upgrade Plan
            </button>
          </div>
        )}

        {/* Settings */}
        <div className="flex p-2 items-center gap-1.5 self-stretch rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-1.5 flex-1">
            <div className="flex w-6 h-6 justify-center items-center rounded-md bg-[#F2F4F7]">
              <Settings className="w-4 h-4 text-[#637083]" />
            </div>
            {!isCollapsed && (
              <div className="text-[#344051] text-sm font-normal leading-5 capitalize">
                Settings
              </div>
            )}
          </div>
        </div>

        {/* Support */}
        <div className="flex p-2 items-center gap-1.5 self-stretch rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-1.5 flex-1">
            <div className="flex w-6 h-6 justify-center items-center rounded-md bg-[#F2F4F7]">
              <HelpCircle className="w-4 h-4 text-[#637083]" />
            </div>
            {!isCollapsed && (
              <div className="text-[#344051] text-sm font-normal leading-5 capitalize">
                Support
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="flex p-2 items-center gap-1.5 self-stretch rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-1.5 flex-1">
            <div className="flex w-6 h-6 justify-center items-center rounded-md bg-[#F2F4F7]">
              <LogOut className="w-4 h-4 text-[#637083]" />
            </div>
            {!isCollapsed && (
              <div className="text-[#344051] text-sm font-normal leading-5 capitalize">
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
