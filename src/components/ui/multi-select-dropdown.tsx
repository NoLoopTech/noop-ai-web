import * as React from "react"
import * as Popover from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[]
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  values,
  onChange,
  placeholder = "Select...",
  className
}) => {
  const [open, setOpen] = React.useState(false)

  const handleToggle = (value: string): void => {
    if (values.includes(value)) {
      onChange(values.filter(v => v !== value))
    } else {
      onChange([...values, value])
    }
  }

  function handleCheckboxChange(value: string) {
    return function () {
      handleToggle(value)
    }
  }

  const selectedLabels = options
    .filter(opt => values.includes(opt.value))
    .map(opt => opt.label)
    .join(", ")

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "border rounded-md bg-background dark:bg-background w-full px-3 py-2 text-sm font-semibold flex items-center justify-between",
            className
          )}
        >
          <span>{selectedLabels || placeholder}</span>
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
        </button>
      </Popover.Trigger>
      <Popover.Content
        className="bg-background dark:bg-background border rounded-md shadow-lg z-50 mt-2 w-full min-w-[180px]"
        align="start"
      >
        <div className="max-h-48 overflow-y-auto">
          {options.map(opt => (
            <label
              key={opt.value}
              className="flex items-center px-3 py-2 cursor-pointer text-sm"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  handleToggle(opt.value)
                }
              }}
            >
              <input
                type="checkbox"
                checked={values.includes(opt.value)}
                onChange={handleCheckboxChange(opt.value)}
                className="mr-2"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}
