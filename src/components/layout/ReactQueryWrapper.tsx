"use client"

/**
 * Use this on layout.tsx to add support for React Query hooks with having to make the entire layout / page client-side
 */

import { QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

import rtkQueryClient from "@/query"

const ReactQueryWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={rtkQueryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default ReactQueryWrapper
