"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SessionsViewActionsProps {
  row: {
    original: {
      id: string
      country: string
    }
    getValue: (key: string) => string
  }
}

export function SessionsViewActions({ row }: SessionsViewActionsProps) {
  const currentUrl = usePathname()

  return (
    <div className="flex items-center gap-1">
      <Link
        prefetch={false}
        href={`${currentUrl}${row.original.id}`}
        className="hover:text-primary w-[80px] font-semibold underline"
      >
        {row.getValue("userName")}
      </Link>
    </div>
  )
}
