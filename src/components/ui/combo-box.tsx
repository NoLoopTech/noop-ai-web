import * as React from "react"
import * as Select from "@radix-ui/react-select"
import ArrowDownIcon from "@/../public/assets/icons/arrow-down.svg"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className
}) => {
  const [search, setSearch] = React.useState("")
  const filtered = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearch(e.target.value)
  }

  const selectedLabel =
    value !== ""
      ? options.find(opt => opt.value === value)?.label ?? value
      : null

  return (
    <Select.Root
      value={value === "" ? "__placeholder__" : value}
      onValueChange={val => {
        onChange(val === "__placeholder__" ? "" : val)
      }}
    >
      <Select.Trigger
        className={`flex items-center justify-between border rounded-md px-3 py-2 text-sm font-semibold w-full text-left bg-background dark:bg-background ${
          className ?? ""
        }`}
        aria-label={placeholder}
      >
        <span className="flex-1 truncate">{selectedLabel ?? placeholder}</span>
        <Select.Icon>
          <ArrowDownIcon className="w-4 h-4 ml-2" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Content className="bg-background dark:bg-background border rounded shadow-lg mt-1">
        <div className="px-2 py-1">
          <input
            type="text"
            className="border-b px-2 py-1 text-sm font-semibold w-full mb-1"
            placeholder="Search..."
            value={search}
            autoFocus
            onChange={handleSearchChange}
          />
        </div>
        <div className="overflow-y-auto max-h-64">
          <Select.Group>
            <Select.Item
              value="__placeholder__"
              className={`px-2 py-1 text-sm cursor-pointer${
                value === "" ? " font-bold" : ""
              }`}
            >
              {placeholder}
            </Select.Item>
            {filtered.map(opt => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className={`px-2 py-1 text-sm cursor-pointer${
                  value === opt.value ? " font-bold" : ""
                }`}
              >
                {opt.label}
              </Select.Item>
            ))}
          </Select.Group>
        </div>
      </Select.Content>
    </Select.Root>
  )
}
