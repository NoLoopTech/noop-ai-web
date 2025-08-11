"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  orientation?: "horizontal" | "vertical"
  scrollbarVariant?: "no-scrollbar" | "tiny" | "default"
}

interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > {
  variant?: "no-scrollbar" | "tiny" | "default"
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      orientation = "vertical",
      scrollbarVariant = "default",
      ...props
    },
    ref
  ) => (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn(
          "h-full w-full rounded-[inherit]",
          orientation === "horizontal" && "overflow-x-auto!"
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation={orientation} variant={scrollbarVariant} />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
)
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(
  (
    { className, orientation = "vertical", variant = "default", ...props },
    ref
  ) => {
    let widthClass = ""
    if (orientation === "vertical") {
      if (variant === "no-scrollbar") {
        widthClass = "w-0"
      } else if (variant === "tiny") {
        widthClass =
          "w-1.5 content-center transition-all duration-200 hover:w-2.5"
      } else {
        widthClass = "w-2.5"
      }
    }

    let heightClass = ""
    if (orientation === "horizontal") {
      if (variant === "no-scrollbar") {
        heightClass = "h-0"
      } else if (variant === "tiny") {
        heightClass =
          "h-1.5 align-middle transition-all duration-200 hover:h-2.5"
      } else {
        heightClass = "h-2.5"
      }
    }

    return (
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={cn(
          "flex touch-none transition-colors select-none",
          orientation === "vertical" &&
            "h-full border-l border-l-transparent p-0.5 pb-2",
          orientation === "vertical" && widthClass,
          orientation === "horizontal" &&
            "flex-col border-t border-t-transparent p-0.5",
          orientation === "horizontal" && heightClass,
          className
        )}
        {...props}
      >
        <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
    )
  }
)
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
