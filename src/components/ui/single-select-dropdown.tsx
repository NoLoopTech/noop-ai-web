import * as React from "react"
import * as Select from "@radix-ui/react-select"
import { cn } from "@/lib/utils"

const CLEAR_TOKEN = "__CLEAR__"

export interface SingleSelectOption {
  value: string
  label: string
}

interface SingleSelectDropdownProps {
  options: SingleSelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className
}) => {
  const handleValueChange = (val: string) => {
    onChange(val === CLEAR_TOKEN ? "" : val)
  }

  const renderedOptions = options
    .filter(opt => opt.value !== "")
    .map(opt => (
      <Select.Item
        key={opt.value}
        value={opt.value}
        className="cursor-pointer px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
      >
        <Select.ItemText>{opt.label}</Select.ItemText>
      </Select.Item>
    ))

  return (
    <Select.Root
      value={value === "" ? CLEAR_TOKEN : value}
      onValueChange={handleValueChange}
    >
      <Select.Trigger
        className={cn(
          "bg-background dark:bg-background flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-normal",
          className
        )}
        aria-label={placeholder}
      >
        <Select.Value placeholder={placeholder} />
        {/* Custom arrow icon */}
        <svg
          className="ml-2 h-4 w-4 text-gray-500"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 8L10 12L14 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Select.Trigger>
      <Select.Content
        side="bottom"
        align="start"
        position="popper"
        className="z-50 rounded-md border border-gray-200 shadow-lg dark:border-gray-700 dark:bg-gray-900"
      >
        <Select.Viewport className="max-h-48 overflow-y-auto">
          {/* Clear/placeholder item */}
          <Select.Item
            value={CLEAR_TOKEN}
            className={cn(
              "cursor-pointer px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700",
              value === "" && "font-bold"
            )}
          >
            <Select.ItemText>{placeholder}</Select.ItemText>
          </Select.Item>
          {/* Only render options with non-empty value */}
          {renderedOptions}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  )
}
