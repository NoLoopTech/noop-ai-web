import { TabsContent } from "@/components/ui/tabs"
import { motion, Variants } from "motion/react"
import { IconDotsVertical } from "@tabler/icons-react"
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
import { truncateFromMiddle } from "@/utils"

interface TabFilesProps {
  motionVariants: Variants
}

const TabFiles = ({ motionVariants }: TabFilesProps) => {
  const { files, setFiles } = useBotSettingsFileSourcesStore()

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

        <ScrollArea
          className="h-[calc(100vh-15.5rem)] w-full pr-4"
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

            <div
              className={`mt-1 mb-2 flex h-10 items-center justify-between space-x-2 rounded-t-lg border-b border-zinc-300 bg-zinc-100 px-4 text-sm font-normal text-zinc-500 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-400`}
            >
              <p className="w-9/12 text-left">File Name</p>

              <p className="w-2/12 text-center">Status</p>

              <p className="w-3/12 text-center">
                Size<span className="text-xs text-zinc-500/75"> (bytes)</span>
              </p>

              <p className="w-1/12 cursor-pointer text-left">{""}</p>
            </div>

            <div className="flex flex-col pb-5">
              {files.map((file, idx) => (
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

                  <p className="w-3/12 text-center">{file.size} bytes</p>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-1/12 cursor-pointer">
                      <IconDotsVertical className="mx-auto h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                      {/* TODO: implement editing functionality */}
                      <DropdownMenuItem onClick={() => handleDeleteFile(idx)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </TabsContent>
  )
}

export default TabFiles
