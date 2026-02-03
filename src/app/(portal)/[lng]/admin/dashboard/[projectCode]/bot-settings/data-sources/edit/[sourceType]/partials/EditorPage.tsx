"use client"

import { InputWithLength } from "@/components/InputWithLength"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { calculateTextSizeFromLength, convertBytesToUnits } from "@/utils"
import { IconAlertTriangle, IconChevronLeft } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  DataSourcesTab,
  useBotSettingsFileSourcesStore
} from "../../../store/botSettingsFileSources.store"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EditorPageProps {
  sourceType: string
}

type EditableItem = {
  size?: number
  status?: "trained" | "new" | "edited"
  [key: string]: string | number | undefined
}

type EditorField = {
  key: string
  label: string
  placeholder?: string
  type: "text" | "textarea"
  required?: boolean
  useLengthCounter?: boolean
}

type SourceTypeConfig = {
  label: string
  tabValue: DataSourcesTab
  sizeField: string
  fields: EditorField[]
  items: EditableItem[]
  setItems: (items: EditableItem[]) => void
}

const EditorPage = ({ sourceType }: EditorPageProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    setActiveDataSourcesTab,
    qAndAs,
    setQAndAs,
    textSources,
    setTextSources
  } = useBotSettingsFileSourcesStore()

  const sourceConfigs: Record<string, SourceTypeConfig> = {
    qanda: {
      label: "Q&A",
      tabValue: "qanda",
      sizeField: "answer",
      fields: [
        {
          key: "title",
          label: "Title",
          placeholder: "Ex: Store policy",
          type: "text",
          required: true
        },
        {
          key: "question",
          label: "Question",
          placeholder: "Ex: What is the store policy?",
          type: "text",
          required: true
        },
        {
          key: "answer",
          label: "Answer",
          placeholder: "Enter your answer",
          type: "textarea",
          required: true,
          useLengthCounter: true
        }
      ],
      items: qAndAs as EditableItem[],
      setItems: setQAndAs as (items: EditableItem[]) => void
    },
    text: {
      label: "Text",
      tabValue: "text",
      sizeField: "description",
      fields: [
        {
          key: "title",
          label: "Title",
          placeholder: "Ex: What is the AGI?",
          type: "text",
          required: true
        },
        {
          key: "description",
          label: "Description",
          placeholder: "Enter your text snippet",
          type: "textarea",
          required: true,
          useLengthCounter: true
        }
      ],
      items: textSources as EditableItem[],
      setItems: setTextSources as (items: EditableItem[]) => void
    }
  }

  const sourceConfig = sourceConfigs[sourceType]

  const editIndex = useMemo(() => {
    const raw = searchParams.get("editIndex")
    if (!raw) return null
    const parsed = Number(raw)
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : null
  }, [searchParams])

  const currentItem =
    editIndex !== null && sourceConfig ? sourceConfig.items[editIndex] : null

  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [initializedIndex, setInitializedIndex] = useState<number | null>(null)

  const sourceTypeLabel = sourceConfig?.label ?? "Source"

  useEffect(() => {
    if (!sourceConfig || editIndex === null) return
    if (!currentItem) return
    if (initializedIndex === editIndex) return

    const nextValues = sourceConfig.fields.reduce<Record<string, string>>(
      (acc, field) => {
        const value = currentItem[field.key]
        acc[field.key] = typeof value === "string" ? value : ""
        return acc
      },
      {}
    )

    setEditValues(nextValues)
    setInitializedIndex(editIndex)
  }, [sourceConfig, editIndex, currentItem, initializedIndex])

  const handleBackClick = () => {
    if (sourceConfig) {
      setActiveDataSourcesTab(sourceConfig.tabValue)
    }

    const basePath = pathname.includes("/edit/")
      ? pathname.split("/edit/")[0]
      : pathname

    if (basePath === pathname) {
      router.back()
      return
    }

    router.push(basePath)
  }

  const handleSave = () => {
    if (!sourceConfig || editIndex === null || !currentItem) return
    const sizeBase = editValues[sourceConfig.sizeField] ?? ""
    const updatedSize = calculateTextSizeFromLength(sizeBase).bytes

    sourceConfig.setItems(
      sourceConfig.items.map((item, i) =>
        i === editIndex
          ? {
              ...item,
              ...editValues,
              size: updatedSize,
              status: item.status === "trained" ? "edited" : item.status
            }
          : item
      )
    )

    handleBackClick()
  }

  const handleFieldChange =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditValues(prev => ({ ...prev, [key]: e.target.value }))
    }

  const isSaveDisabled =
    !sourceConfig ||
    sourceConfig.fields.some(
      field =>
        field.required &&
        (!editValues[field.key] || editValues[field.key].trim() === "")
    )

  const sourceItems = sourceConfig?.items ?? []
  const totalSize = sourceItems.reduce((acc, curr) => acc + (curr.size ?? 0), 0)
  const statusLabel =
    currentItem?.status === "trained"
      ? "Trained"
      : currentItem?.status === "edited"
        ? "Edited"
        : currentItem?.status === "new"
          ? "New"
          : "Unknown"

  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      <div className="flex w-full flex-col justify-between border-r border-zinc-200 pt-3 pr-0 pb-3.5 pl-5 dark:border-inherit">
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-col pr-5">
            <button
              type="button"
              onClick={handleBackClick}
              className="text-foreground flex w-max cursor-pointer items-center space-x-1 px-0 py-2 text-sm font-medium transition-colors duration-300 ease-in-out hover:text-zinc-600 dark:hover:text-zinc-400"
            >
              <IconChevronLeft size={18} />
              <p>{`Back to ${sourceTypeLabel}`}</p>
            </button>

            <div className="mx-auto my-1 w-full space-y-1.5 self-start text-left">
              <h2 className="text-2xl font-semibold">
                {currentItem?.title
                  ? String(currentItem.title)
                  : `Editing ${sourceTypeLabel}`}
              </h2>
            </div>

            <Separator className="mt-1 w-full" />
          </div>

          <Card className="my-5 mr-5 p-0">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-foreground text-lg font-semibold">
                Edit source
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pr-1.5">
              <ScrollArea
                className="h-[calc(100vh-21rem)] w-full pr-3.5"
                scrollbarVariant="tiny"
              >
                <div className="mx-auto flex h-[calc(100vh-21rem)] w-full flex-1 flex-col space-y-7">
                  {sourceConfig ? (
                    editIndex === null || !currentItem ? (
                      <p className="text-sm font-medium text-zinc-500">
                        This source could not be found.
                      </p>
                    ) : (
                      <div className="flex min-h-0 w-full flex-1 flex-col space-y-5">
                        {sourceConfig.fields.map(field => (
                          <div
                            key={field.key}
                            className={
                              field.type === "textarea"
                                ? "flex min-h-0 flex-1 flex-col space-y-1"
                                : "flex flex-col space-y-1"
                            }
                          >
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-400">
                              {field.label}
                            </p>

                            {field.type === "textarea" ? (
                              <InputWithLength
                                value={editValues[field.key] ?? ""}
                                onChange={handleFieldChange(field.key)}
                                name={`edit-${field.key}`}
                                placeholder={field.placeholder}
                                type="textarea"
                                lengthType={
                                  field.useLengthCounter
                                    ? "bytes"
                                    : "characters"
                                }
                                textareaAddonAlignment="block-end"
                                rows={4}
                                className="h-full min-h-0 flex-1"
                                groupClassName="h-full flex-1 min-h-40 flex-col items-stretch"
                              />
                            ) : (
                              <InputGroup className="rounded-md border-zinc-200 bg-white dark:border-slate-700 dark:bg-slate-950">
                                <InputGroupInput
                                  name={`edit-${field.key}`}
                                  placeholder={field.placeholder}
                                  value={editValues[field.key] ?? ""}
                                  onChange={handleFieldChange(field.key)}
                                />
                              </InputGroup>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <p className="text-sm font-medium text-zinc-500">
                      Editing for this source type isn’t available yet.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end space-x-3 pr-5">
          <Button variant="outline" onClick={handleBackClick}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaveDisabled}>
            Update
          </Button>
        </div>
      </div>

      <div className="flex h-full w-md max-w-md flex-col bg-zinc-100 dark:bg-slate-900">
        <div className="mx-auto mt-6 flex w-full max-w-2xs flex-col space-y-5">
          <Card className="p-0">
            <CardHeader className="p-3 pb-1.5">
              <CardTitle className="text-foreground text-lg font-semibold">
                Source details
              </CardTitle>
            </CardHeader>
            <CardContent className="m-3 mt-2 space-y-3 rounded-lg border border-zinc-200 p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Size:
                </p>

                <p className="w-max text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                  {convertBytesToUnits(totalSize)}
                </p>
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Status:
                </p>

                <p className="w-max text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                  {statusLabel}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex w-full items-center space-x-2.5 rounded-lg border border-[#FF7C0A] bg-[#FF7C0A]/10 px-3 py-1.5">
            <IconAlertTriangle size={40} className="mt-1 text-[#FF7C0A]" />
            <p className="text-xs/relaxed font-medium text-zinc-600 dark:text-[#FF7C0A]/80">
              Changes made here won’t affect the agent until you click Train
              Agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorPage
