import { InputWithLength } from "@/components/InputWithLength"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TabsContent } from "@/components/ui/tabs"
import {
  calculateTextSizeFromLength,
  convertBytesToUnits,
  truncateFromMiddle
} from "@/utils"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"
import { motion, Variants } from "motion/react"
import { useBotSettingsFileSourcesStore } from "../../store/botSettingsFileSources.store"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { usePathname, useRouter } from "next/navigation"

interface TabQAndAProps {
  motionVariants: Variants
}

const TabQAndA = ({ motionVariants }: TabQAndAProps) => {
  const { qAndAs, setQAndAs } = useBotSettingsFileSourcesStore()
  const [isConfirmSourceDeleteDialogOpen, setIsConfirmSourceDeleteDialogOpen] =
    useState(false)
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null
  )
  const [title, setTitle] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const router = useRouter()
  const pathname = usePathname()

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQuestion(e.target.value)
  }

  const handleAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAnswer(e.target.value)
  }

  const handleAddQAndA = () => {
    const size = calculateTextSizeFromLength(answer).bytes
    setQAndAs([
      ...qAndAs,
      { title, question, answer, size, status: "new" as const }
    ])
    setTitle("")
    setQuestion("")
    setAnswer("")
  }

  const handleDeleteQAndA = (idx: number) => {
    setQAndAs(qAndAs.filter((_, i) => i !== idx))
  }

  const openEditForIndex = (idx: number) => () => {
    const current = qAndAs[idx]
    if (!current) return
    router.push(`${pathname}/edit/qanda?editIndex=${idx}`)
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
      handleDeleteQAndA(pendingDeleteIndex)
      setPendingDeleteIndex(null)
    }
    setIsConfirmSourceDeleteDialogOpen(false)
  }

  return (
    <TabsContent value="qanda">
      <motion.div
        key="qanda-content"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={motionVariants}
        className="h-full w-full"
      >
        <div className="mb-4 flex flex-col space-y-2">
          <h2 className="text-foreground text-xl/3 font-semibold">Q&A</h2>
          <p className="text-sm font-medium text-zinc-500">
            Craft responses for key questions, ensuring your AI shares relevant
            info.
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
                Add Q&A
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3.5 pb-4">
              <div className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-400">
                    Title
                  </p>

                  <InputGroup className="rounded-md border-zinc-200 bg-white dark:border-slate-700 dark:bg-slate-950">
                    <InputGroupInput
                      name="title"
                      placeholder="Ex: Store policy"
                      value={title}
                      onChange={handleTitleChange}
                    />
                  </InputGroup>
                </div>

                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-400">
                    Question
                  </p>

                  <InputGroup className="rounded-md border-zinc-200 bg-white dark:border-slate-700 dark:bg-slate-950">
                    <InputGroupInput
                      name="question"
                      placeholder="Ex: What is the store policy?"
                      value={question}
                      onChange={handleQuestionChange}
                    />
                  </InputGroup>
                </div>

                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-400">
                    Answer
                  </p>

                  <InputWithLength
                    value={answer}
                    onChange={handleAnswerChange}
                    name="answer"
                    placeholder={"Enter your answer"}
                    type="textarea"
                    lengthType="bytes"
                    textareaAddonAlignment="block-end"
                    rows={2}
                  />
                </div>
              </div>

              <div className="mt-5 flex w-full justify-end">
                <Button onClick={handleAddQAndA} disabled={!title || !answer}>
                  Add Q&A
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-5">
            <h2 className="text-foreground text-lg font-semibold">
              Q&A sources
            </h2>

            <div
              className={`mt-1 mb-2 flex h-10 items-center justify-between space-x-2 rounded-t-lg border-b border-zinc-300 bg-zinc-100 px-4 text-sm font-normal text-zinc-500 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-400`}
            >
              <p className="w-9/12 text-left">Title</p>

              <p className="w-2/12 text-center">Status</p>

              <p className="w-3/12 text-center">Size</p>

              <p className="w-1/12 cursor-pointer text-left">{""}</p>
            </div>

            <div className="flex flex-col pb-5">
              {qAndAs.map((qAndA, idx) => (
                <div
                  key={idx}
                  className="flex h-12 items-center space-x-2 border-b border-zinc-200 px-4 text-sm font-normal dark:border-slate-700"
                >
                  <div className="w-9/12">
                    <button
                      type="button"
                      onClick={openEditForIndex(idx)}
                      className="text-left decoration-dashed hover:underline hover:underline-offset-4"
                    >
                      {truncateFromMiddle(qAndA.title)}
                    </button>
                  </div>

                  <div className="flex w-2/12 items-center justify-center text-center">
                    {qAndA.status === "trained" ? (
                      <p className="w-max rounded-md border border-gray-500 bg-gray-500/20 px-2 py-0.5 text-xs font-medium text-gray-500">
                        Trained
                      </p>
                    ) : qAndA.status === "edited" ? (
                      <p className="w-max rounded-md border border-[#FF7C0A] bg-[#FF7C0A]/10 px-2 py-0.5 text-xs font-medium text-[#FF7C0A]">
                        Edited
                      </p>
                    ) : (
                      <p className="w-max rounded-md border border-[#34C759] bg-[#34C759]/20 px-2 py-0.5 text-xs font-medium text-[#34C759]">
                        New
                      </p>
                    )}
                  </div>

                  <p className="w-3/12 text-center">
                    {convertBytesToUnits(qAndA.size)}
                  </p>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-1/12 cursor-pointer">
                      <IconDotsVertical className="mx-auto h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={openEditForIndex(idx)}
                        className="flex cursor-pointer items-center justify-between px-1.5"
                      >
                        <p>Edit</p>

                        <IconEdit className="h-3.5 w-3.5" />
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={openDeleteConfirmForIndex(idx)}
                        className="flex cursor-pointer items-center justify-between px-1.5 text-[#DC2626] hover:!text-[#DC2626]/80"
                      >
                        <p>Delete Text</p>

                        <IconTrash className="h-3.5 w-3.5" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
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
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  )
}

export default TabQAndA
