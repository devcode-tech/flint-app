'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const getVisiblePages = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className={cn('flex justify-between items-center', className)}>
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={cn(
          'flex p-2 items-center gap-0.5 rounded-lg transition-colors',
          currentPage === 1
            ? 'bg-[#F2F4F7] cursor-not-allowed'
            : 'bg-[#F2F4F7] hover:bg-[#E4E7EC]'
        )}
      >
        <ChevronLeft className="w-5 h-5 text-[#141C25]" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-start gap-2">
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="flex w-9 h-9 items-center justify-center text-[#637083] text-sm font-medium">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={cn(
                  'flex w-9 h-9 justify-center items-center rounded-lg text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-[#005EB8] text-white'
                    : 'text-[#637083] hover:bg-[#F2F4F7]'
                )}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={cn(
          'flex p-2 items-center gap-0.5 rounded-lg transition-colors',
          currentPage === totalPages
            ? 'bg-[#F2F4F7] cursor-not-allowed'
            : 'bg-[#F2F4F7] hover:bg-[#E4E7EC]'
        )}
      >
        <ChevronRight className="w-5 h-5 text-[#141C25]" />
      </button>
    </div>
  )
}
