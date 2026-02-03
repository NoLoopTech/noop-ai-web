"use client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
} from "@/components/ui/input-group"
import { calculateTextSizeFromLength } from "@/utils"

interface InputWithLengthProps {
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onFocus?: () => void
  name?: string
  maxLength?: number
  showMaxLength?: boolean
  lengthType?: "characters" | "bytes" | "KB" | "MB"
  placeholder?: string
  type?: "text" | "textarea"
  rows?: number
  className?: string
  groupClassName?: string
  disabled?: boolean
  inputAddonAlignment?:
    | "inline-end"
    | "block-end"
    | "inline-start"
    | "block-start"
  textareaAddonAlignment?:
    | "inline-end"
    | "block-end"
    | "inline-start"
    | "block-start"
}

export function InputWithLength({
  value,
  onChange,
  onFocus,
  name,
  maxLength,
  showMaxLength,
  placeholder = "Type here...",
  type = "text",
  rows = 2,
  className,
  groupClassName,
  disabled,
  lengthType = "characters",
  inputAddonAlignment = "inline-end",
  textareaAddonAlignment = "block-end"
}: InputWithLengthProps) {
  const sizeInfo = calculateTextSizeFromLength(value)

  const getLengthDisplay = () => {
    switch (lengthType) {
      case "bytes":
        return sizeInfo.bytes
      case "KB":
        return sizeInfo.kb.toFixed(5)
      case "MB":
        return sizeInfo.mb.toFixed(5)
      case "characters":
      default:
        return value.length
    }
  }

  const getMaxLengthDisplay = () => {
    if (!maxLength) return null
    switch (lengthType) {
      case "bytes":
        return calculateTextSizeFromLength("a".repeat(maxLength)).bytes
      case "KB":
        return calculateTextSizeFromLength("a".repeat(maxLength)).kb.toFixed(5)
      case "MB":
        return calculateTextSizeFromLength("a".repeat(maxLength)).mb.toFixed(5)
      case "characters":
      default:
        return maxLength
    }
  }

  const renderInput = () => {
    switch (type) {
      case "text":
        return (
          <InputGroup
            className={
              "has-[[data-slot=input-group-control]:focus-visible]:border-input !bg-background border-slate-300 has-[[data-slot=input-group-control]:focus-visible]:ring-1 dark:border-slate-800 " +
              (groupClassName ?? "")
            }
          >
            <InputGroupInput
              name={name}
              placeholder={placeholder}
              value={value}
              maxLength={maxLength}
              onChange={onChange}
              disabled={disabled}
              onFocus={onFocus}
            />
            <InputGroupAddon align={inputAddonAlignment}>
              <InputGroupText className="ml-auto text-xs">
                <p>
                  {showMaxLength ? (
                    <span>
                      {getLengthDisplay()}
                      <span className="mx-0.5">/</span>
                      {getMaxLengthDisplay()}
                      {lengthType !== "characters" && (
                        <span className="ml-1">{lengthType}</span>
                      )}
                    </span>
                  ) : (
                    <span>
                      {getLengthDisplay()}
                      {lengthType !== "characters" && (
                        <span className="ml-1">{lengthType}</span>
                      )}
                    </span>
                  )}
                </p>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        )
      case "textarea":
        return (
          <InputGroup
            className={
              "has-[[data-slot=input-group-control]:focus-visible]:border-input !bg-background border-slate-300 has-[[data-slot=input-group-control]:focus-visible]:ring-1 dark:border-slate-800 " +
              (groupClassName ?? "")
            }
          >
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
            <InputGroupAddon align={textareaAddonAlignment}>
              <InputGroupText className="ml-auto text-xs">
                {showMaxLength ? (
                  <span>
                    {getLengthDisplay()}
                    <span className="mx-0.5">/</span>
                    {getMaxLengthDisplay()}
                    {lengthType !== "characters" && (
                      <span className="ml-1">{lengthType}</span>
                    )}
                  </span>
                ) : (
                  <span>
                    {getLengthDisplay()}
                    {lengthType !== "characters" && (
                      <span className="ml-1">{lengthType}</span>
                    )}
                  </span>
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
