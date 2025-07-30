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
  return (
    <Select.Root
      value={value === "" ? CLEAR_TOKEN : value}
      onValueChange={val => {
        onChange(val === CLEAR_TOKEN ? "" : val)
      }}
    >
      <Select.Trigger
        className={cn(
          "border rounded-md bg-background dark:bg-background w-full px-3 py-2 text-sm font-semibold flex items-center justify-between",
          className
        )}
        aria-label={placeholder}
      >
        <Select.Value placeholder={placeholder} />
        {/* Custom arrow icon */}
        <svg
          className="w-4 h-4 ml-2 text-gray-500"
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
        className="bg-background dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
      >
        <Select.Viewport className="max-h-48 overflow-y-auto">
          {/* Clear/placeholder item */}
          <Select.Item
            value={CLEAR_TOKEN}
            className={cn(
              "px-3 py-2 text-sm cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700",
              value === "" && "font-bold"
            )}
          >
            <Select.ItemText>{placeholder}</Select.ItemText>
          </Select.Item>
          {/* Only render options with non-empty value */}
          {options
            .filter(opt => opt.value !== "")
            .map(opt => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="px-3 py-2 cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  )
}
