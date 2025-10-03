'use client'

import React from 'react'
import Link from 'next/link'
import { Ticket } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    icon?: React.ReactNode
  }>
  className?: string
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <div className={cn('flex items-center gap-2 lg:gap-3 p-0', className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1 lg:gap-1.5">
          {item.icon && (
            <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
          )}
          {item.href ? (
            <Link 
              href={item.href}
              className="text-[#141C25] font-inter text-sm lg:text-base font-medium leading-5 capitalize hover:text-[#005EB8] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#141C25] font-inter text-sm lg:text-base font-medium leading-5 capitalize">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
