"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

interface ToastProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  variant?: "error" | "success" | "warning" | "info"
  className?: string
  duration?: number // Duration in milliseconds
}

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  variant = "error",
  className,
  duration = 5000
}: ToastProps) {
  // Auto-dismiss timer
  React.useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [open, duration, onOpenChange])
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
      case "info":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
      case "error":
      default:
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
    }
  }

  const getTextStyles = () => {
    switch (variant) {
      case "success":
        return "text-green-700 dark:text-green-400"
      case "warning":
        return "text-yellow-700 dark:text-yellow-400"
      case "info":
        return "text-blue-700 dark:text-blue-400"
      case "error":
      default:
        return "text-red-700 dark:text-red-400"
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case "success":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "info":
        return "text-blue-400"
      case "error":
      default:
        return "text-red-400"
    }
  }

  const getIcon = () => {
    switch (variant) {
      case "success":
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "warning":
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "info":
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "error":
      default:
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )
    }
  }

  return (
    <ToastPrimitives.Provider swipeDirection="right" duration={duration}>
      <ToastPrimitives.Root
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full rounded-md border p-4 shadow-lg",
          getVariantStyles(),
          className
        )}
        open={open}
        onOpenChange={onOpenChange}
        duration={duration}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <div className={getIconColor()}>{getIcon()}</div>
          </div>
          <div className="ml-3">
            <ToastPrimitives.Title
              className={cn("text-sm font-medium", getTextStyles())}
            >
              {title}
            </ToastPrimitives.Title>
            <ToastPrimitives.Description
              className={cn("text-sm", getTextStyles())}
            >
              {description}
            </ToastPrimitives.Description>
          </div>
          <ToastPrimitives.Close className="ml-auto text-red-500 hover:text-red-700">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </ToastPrimitives.Close>
        </div>
      </ToastPrimitives.Root>
      <ToastPrimitives.Viewport className="fixed top-0 right-0 z-50 m-0 flex w-96 max-w-[100vw] list-none flex-col gap-2 p-6" />
    </ToastPrimitives.Provider>
  )
}
