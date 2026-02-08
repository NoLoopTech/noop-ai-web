import { TabsContent } from "@/components/ui/tabs"
import { motion, Variants } from "motion/react"
import {
  IconDotsVertical,
  IconTrash,
  IconZoomExclamation
} from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FileDropzone from "@/components/FileDropzone"
import { useBotSettingsFileSourcesStore } from "../../store/botSettingsFileSources.store"
import { convertBytesToUnits, truncateFromMiddle } from "@/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import useSearch from "@/hooks/useSearch"
import useStatusFilter from "@/hooks/useStatusFilter"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface TabFilesProps {
  motionVariants: Variants
}

const TabFiles = ({ motionVariants }: TabFilesProps) => {
  const {
    files,
    setFiles,
    trainedFilesToBeDeleted,
    setTrainedFilesToBeDeleted
  } = useBotSettingsFileSourcesStore()
  const [isConfirmSourceDeleteDialogOpen, setIsConfirmSourceDeleteDialogOpen] =
    useState(false)
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null
  )
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    filteredItems: searchedFiles
  } = useSearch(files || [], { keys: ["name"] })

  const {
    statusFilter,
    setStatusFilter,
    filteredItems: statusFilteredFiles
  } = useStatusFilter(searchedFiles, {
    allowedValues: ["default", "new", "trained"]
  })

  const filteredFiles = statusFilteredFiles

  function handleFileChange(selectedFiles: File[] | null) {
    if (!selectedFiles || selectedFiles.length === 0) return

    const entries = selectedFiles.map(file => ({
      name: file.name,
      size: file.size,
      raw: file,
      status: "new" as const
    }))

    setFiles([...(files || []), ...entries])
  }

  function handleDeleteFile(idx: number) {
    setFiles(files.filter((_, i) => i !== idx))
  }

  const openDeleteConfirmForIndex = (idx: number) => () => {
    setPendingDeleteIndex(idx)
    setIsConfirmSourceDeleteDialogOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsConfirmSourceDeleteDialogOpen(open)
    if (!open) setPendingDeleteIndex(null)
  }

  const confirmDelete = () => {
    if (pendingDeleteIndex !== null) {
      // INFO: if the file being deleted is already trained, queue it for deletion on "Train Agent" click
      const fileToDelete = files?.[pendingDeleteIndex]
      if (fileToDelete && fileToDelete.status === "trained") {
        const existing = trainedFilesToBeDeleted?.blobNames || []
        setTrainedFilesToBeDeleted({
          blobNames: [...existing, fileToDelete.name]
        })
      }

      handleDeleteFile(pendingDeleteIndex)
      setPendingDeleteIndex(null)
    }
    setIsConfirmSourceDeleteDialogOpen(false)
  }

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  return (
    <TabsContent value="files">
      <motion.div
        key="files-content"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={motionVariants}
        className="h-full w-full"
      >
        <div className="mb-4 flex flex-col space-y-2">
          <h2 className="text-foreground text-xl/3 font-semibold">Files</h2>
          <p className="text-sm font-medium text-zinc-500">
            Upload documents to train your AI. Extract text from PDFs, DOCX, and
            TXT files.
          </p>
        </div>

        <Separator className="mb-4 w-[calc(100%-16px)]" />

        <ScrollArea
          className="h-[calc(100vh-16.5rem)] w-full pr-4"
          scrollbarVariant="tiny"
        >
          <Card className="relative border-zinc-300 bg-white p-0 dark:border-slate-700 dark:bg-slate-950">
            <CardHeader className="px-3.5 pt-2.5 pb-2">
              <CardTitle className="text-foreground text-lg font-semibold">
                Add Files
              </CardTitle>
            </CardHeader>
            <CardContent className="h-56 px-3.5 pb-4">
              <FileDropzone onFileSelected={handleFileChange} />
            </CardContent>
          </Card>

          <div className="mt-5">
            <h2 className="text-foreground text-lg font-semibold">
              File sources
            </h2>

            <div className="mx-0.5 mt-1 mb-3 flex items-center justify-between space-x-2">
              <Input
                placeholder="Search by title"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                className="w-72"
              />

              <div className="flex items-center space-x-2">
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="h-10 w-32">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="trained">Trained</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div
              className={`mt-1 mb-2 flex h-10 items-center justify-between space-x-2 rounded-t-lg border-b border-zinc-300 bg-zinc-100 px-4 text-sm font-normal text-zinc-500 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-400`}
            >
              <p className="w-9/12 text-left">File Name</p>

              <p className="w-2/12 text-center">Status</p>

              <p className="w-3/12 text-center">Size</p>

              <p className="w-1/12 cursor-pointer text-left">{""}</p>
            </div>

            <div className="flex flex-col pb-5">
              {searchQuery && filteredFiles.length === 0 ? (
                <div className="my-5 flex w-full flex-col items-center space-y-2.5">
                  <IconZoomExclamation className="size-8 stroke-1 text-zinc-500" />

                  <p className="px-4 text-center text-sm text-zinc-500">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              ) : (
                filteredFiles.map((file, idx) => {
                  const originalIdx = (files || []).findIndex(
                    f => f.name === file.name && f.size === file.size
                  )
                  const actualIdx = originalIdx !== -1 ? originalIdx : idx

                  return (
                    <div
                      key={idx}
                      className="flex h-12 items-center space-x-2 border-b border-zinc-200 px-4 text-sm font-normal dark:border-slate-700"
                    >
                      <p className="w-9/12 text-left">
                        {truncateFromMiddle(file.name)}
                      </p>

                      <div className="flex w-2/12 items-center justify-center text-center">
                        {file.status === "trained" ? (
                          <p className="w-max rounded-md border border-gray-500 bg-gray-500/20 px-2 py-0.5 text-xs font-medium text-gray-500">
                            Trained
                          </p>
                        ) : (
                          <p className="w-max rounded-md border border-[#34C759] bg-[#34C759]/20 px-2 py-0.5 text-xs font-medium text-[#34C759]">
                            New
                          </p>
                        )}
                      </div>

                      <p className="w-3/12 text-center">
                        {convertBytesToUnits(file.size)}
                      </p>

                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-1/12 cursor-pointer">
                          <IconDotsVertical className="mx-auto h-4 w-4 text-zinc-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onClick={openDeleteConfirmForIndex(actualIdx)}
                            className="flex cursor-pointer items-center justify-between px-1.5 text-[#DC2626] hover:!text-[#DC2626]/80"
                          >
                            <p>Delete</p>

                            <IconTrash className="h-3.5 w-3.5" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </ScrollArea>
      </motion.div>

      <AlertDialog
        open={isConfirmSourceDeleteDialogOpen}
        onOpenChange={handleDialogOpenChange}
      >
        <AlertDialogContent className="py-5">
          {/* Add visually screen reader only title & description for accessibility. without AlertDialogTitle it shows a error */}
          <div className="sr-only">
            <AlertDialogTitle>Remove sources confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm removing source from current list
            </AlertDialogDescription>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex flex-col items-start justify-center space-y-2.5 text-left">
              <h3 className="text-foreground text-lg font-semibold">
                Delete this source from training?
              </h3>
              <p className="text-foreground text-sm/normal font-normal">
                This will remove the source from the training list. The original
                file or link won’t be deleted. The agent’s current behavior
                won’t change until you retrain it.
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end space-x-2.5">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="w-max bg-[#DC2626] p-3 text-white hover:bg-[#DC2626]/80"
            >
              Delete File
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  )
}

export default TabFiles
