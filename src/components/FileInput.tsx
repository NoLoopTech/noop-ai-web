"use client"

import { useRef } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BaseProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
  size?: "default" | "sm" | "lg" | "icon"
  display?: "icon-text" | "text" | "icon"
  accept?: string
  icon?: React.ReactNode
  label?: string
  showEmptyLabel?: boolean
}

interface MultipleProps extends BaseProps {
  multiple: true
  value?: FileList | null
  onChange?: (files: FileList | null) => void
}

interface SingleProps extends BaseProps {
  multiple?: false
  value?: File | null
  onChange?: (file: File | null) => void
}

type FileInputProps = MultipleProps | SingleProps

export function FileInput({
  value,
  onChange,
  variant = "outline",
  size = "default",
  display = "icon-text",
  accept,
  multiple = false,
  icon,
  label = "Select File",
  showEmptyLabel = false
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (multiple) {
      ;(onChange as (files: FileList | null) => void)?.(
        files && files.length > 0 ? files : null
      )
    } else {
      ;(onChange as (file: File | null) => void)?.(
        files && files.length > 0 ? files[0] : null
      )
    }
  }

  const truncateMiddle = (str: string, maxLength: number) => {
    if (str.length <= maxLength) return str
    const start = Math.floor(maxLength / 2) - 1
    const end = str.length - (maxLength - start - 3)
    return str.slice(0, start) + "..." + str.slice(end)
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />

      {!multiple ? (
        <div className="flex items-center gap-4">
          {value && value instanceof File ? (
            <span className="text-muted-foreground text-sm">
              {truncateMiddle(value.name, 30)}
            </span>
          ) : (
            showEmptyLabel && (
              <span className="text-muted-foreground text-sm">
                No file selected
              </span>
            )
          )}

          <Button
            type="button"
            variant={variant}
            size={size}
            onClick={handleBrowseClick}
            className={cn(
              buttonVariants({ variant, size }),
              "flex items-center gap-2"
            )}
          >
            {(display === "icon" || display === "icon-text") && icon}
            {(display === "text" || display === "icon-text") && label}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant={variant}
            size={size}
            onClick={handleBrowseClick}
            className={cn(
              buttonVariants({ variant, size }),
              "flex items-center gap-2"
            )}
          >
            {(display === "icon" || display === "icon-text") && icon}
            {(display === "text" || display === "icon-text") && label}
          </Button>

          {value && value instanceof FileList && value.length > 0 ? (
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              {Array.from(value).map((file, index) => (
                <li key={index} className="max-w-xs truncate">
                  {file.name}
                </li>
              ))}
            </ul>
          ) : (
            showEmptyLabel && (
              <span className="text-muted-foreground text-sm">
                No file selected
              </span>
            )
          )}
        </div>
      )}
    </div>
  )
}
