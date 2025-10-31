"use client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
} from "@/components/ui/input-group"

interface InputWithLengthProps {
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onFocus?: () => void
  name?: string
  maxLength?: number
  showMaxLength?: boolean
  placeholder?: string
  type?: "text" | "textarea"
  rows?: number
  className?: string
  disabled?: boolean
}

export function InputWithLength({
  value,
  onChange,
  onFocus,
  name,
  maxLength = 20,
  showMaxLength = true,
  placeholder = "Type here...",
  type = "text",
  rows = 2,
  className,
  disabled
}: InputWithLengthProps) {
  const renderInput = () => {
    switch (type) {
      case "text":
        return (
          <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:border-input !bg-background border-slate-300 has-[[data-slot=input-group-control]:focus-visible]:ring-1 dark:border-slate-800">
            <InputGroupInput
              name={name}
              placeholder={placeholder}
              value={value}
              maxLength={maxLength}
              onChange={onChange}
              disabled={disabled}
              onFocus={onFocus}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText className="ml-auto text-xs">
                <p>
                  {showMaxLength ? (
                    <span>
                      {value.length}
                      <span className="mx-0.5">/</span>
                      {maxLength}
                    </span>
                  ) : (
                    <span>{value.length}</span>
                  )}
                </p>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        )
      case "textarea":
        return (
          <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:border-input !bg-background border-slate-300 has-[[data-slot=input-group-control]:focus-visible]:ring-1 dark:border-slate-800">
            <InputGroupTextarea
              name={name}
              placeholder={placeholder}
              value={value}
              maxLength={maxLength}
              onChange={onChange}
              rows={rows}
              className={className}
              disabled={disabled}
            />
            <InputGroupAddon align="block-end">
              <InputGroupText className="ml-auto text-xs">
                {showMaxLength ? (
                  <span>
                    {value.length}
                    <span className="mx-0.5">/</span>
                    {maxLength}
                  </span>
                ) : (
                  <span>{value.length}</span>
                )}
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        )
      default:
        return null
    }
  }

  return renderInput()
}
