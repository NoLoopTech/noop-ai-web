import { TabsContent } from "@/components/ui/tabs"
import { motion, Variants } from "motion/react"
import { IconDotsVertical } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useOnboardingStore } from "../../store/onboarding.store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FileDropzone from "@/components/FileDropzone"
import { convertBytesToUnits } from "@/utils"

interface TabFilesProps {
  motionVariants: Variants
}

const TabFiles = ({ motionVariants }: TabFilesProps) => {
  const { files, setFiles } = useOnboardingStore()

  function handleFileChange(selectedFiles: File[] | null) {
    if (!selectedFiles || selectedFiles.length === 0) return

    const entries = selectedFiles.map(file => ({
      name: file.name,
      size: file.size,
      raw: file
    }))

    setFiles([...(files || []), ...entries])
  }

  function handleDeleteFile(idx: number) {
    setFiles(files.filter((_, i) => i !== idx))
  }

  return (
    <TabsContent value="files" className="mt-4 h-96 rounded-md">
      <motion.div
        key="files-content"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motionVariants}
        className="h-full w-full"
      >
        <div className="mb-4 flex flex-col space-y-1">
          <h2 className="text-xl font-semibold text-zinc-950">
            Add your Files
          </h2>
          <p className="text-sm font-medium text-zinc-500">
            Upload documents to train your AI. Extract text from PDFs, DOCX, and
            TXT files.
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-19.4rem)] w-full pr-4">
          <Card className="relative border-zinc-300 bg-white p-0">
            <CardHeader className="px-3.5 pt-2.5 pb-2">
              <CardTitle className="text-lg font-semibold text-zinc-950">
                Add Files
              </CardTitle>
            </CardHeader>
            <CardContent className="h-56 px-3.5 pb-4">
              <FileDropzone onFileSelected={handleFileChange} />
            </CardContent>
          </Card>

          {/* TODO: Update this section's UI. need to confirm what we show here */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold text-zinc-950">
              File sources
            </h2>

            <div
              className={`mt-1 mb-2 flex h-10 items-center justify-between space-x-2 rounded-t-lg border-b border-zinc-300 bg-zinc-100 px-4 text-sm font-normal text-zinc-500`}
            >
              <p className="w-9/12 text-left">File Name</p>

              <p className="w-2/12 text-left">Size</p>

              <p className="w-1/12 cursor-pointer text-left">Action</p>
            </div>

            <div className="flex flex-col pb-5">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex h-12 items-center space-x-2 border-b border-zinc-200 px-4 text-sm font-normal"
                >
                  <p className="w-9/12 text-left">{file.name}</p>

                  <p className="w-2/12 text-left">
                    {convertBytesToUnits(file.size)}
                  </p>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-1/12 cursor-pointer">
                      <IconDotsVertical className="h-4 w-4 text-zinc-500" />
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
