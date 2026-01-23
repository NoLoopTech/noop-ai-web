import { InputWithLength } from "@/components/InputWithLength"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TabsContent } from "@/components/ui/tabs"
import { calculateTextSizeFromLength, convertBytesToUnits } from "@/utils"
import { IconDotsVertical } from "@tabler/icons-react"
import { motion, Variants } from "motion/react"
import { useOnboardingStore } from "../../store/onboarding.store"
import { useState } from "react"

interface TabQAndAProps {
  motionVariants: Variants
}

const TabQAndA = ({ motionVariants }: TabQAndAProps) => {
  const { qAndAs, setQAndAs } = useOnboardingStore()

  const [title, setTitle] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

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
    setQAndAs([...qAndAs, { title, question, answer, size }])
    setTitle("")
    setQuestion("")
    setAnswer("")
  }

  const handleDeleteQAndA = (idx: number) => {
    setQAndAs(qAndAs.filter((_, i) => i !== idx))
  }

  return (
    <TabsContent value="qanda" className="mt-4 h-96">
      <motion.div
        key="qanda-content"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motionVariants}
        className="h-full w-full"
      >
        <div className="mb-4 flex flex-col space-y-1">
          <h2 className="text-xl font-semibold text-zinc-950">Q&A</h2>
          <p className="text-sm font-medium text-zinc-500">
            Craft responses for key questions, ensuring your AI shares relevant
            info.
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-19.4rem)] w-full pr-4">
          <Card className="relative border-zinc-300 bg-white p-0">
            <CardHeader className="px-3.5 pt-2.5 pb-2">
              <CardTitle className="text-lg font-semibold text-zinc-950">
                Add Q&A
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3.5 pb-4">
              <div className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-zinc-900">Title</p>

                  <InputGroup className="rounded-md border-zinc-200 bg-white">
                    <InputGroupInput
                      name="title"
                      placeholder="Ex: Store policy"
                      value={title}
                      onChange={handleTitleChange}
                    />
                  </InputGroup>
                </div>

                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-zinc-900">Question</p>

                  <InputGroup className="rounded-md border-zinc-200 bg-white">
                    <InputGroupInput
                      name="question"
                      placeholder="Ex: What is the store policy?"
                      value={question}
                      onChange={handleQuestionChange}
                    />
                  </InputGroup>
                </div>

                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-zinc-900">Answer</p>

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

          {/* TODO: Update this section's UI. need to confirm what we show here */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold text-zinc-950">Q&A sources</h2>

            <div
              className={`mt-1 mb-2 flex h-10 items-center justify-between space-x-2 rounded-t-lg border-b border-zinc-300 bg-zinc-100 px-4 text-sm font-normal text-zinc-500`}
            >
              <p className="w-9/12 text-left">Title</p>

              <p className="w-2/12 text-left">Size</p>

              <p className="w-1/12 cursor-pointer text-left">Action</p>
            </div>

            <div className="flex flex-col pb-5">
              {qAndAs.map((qAndA, idx) => (
                <div
                  key={idx}
                  className="flex h-12 items-center space-x-2 border-b border-zinc-200 px-4 text-sm font-normal"
                >
                  <p className="w-9/12 text-left">{qAndA.title}</p>

                  <p className="w-2/12 text-left">
                    {convertBytesToUnits(qAndA.size)}
                  </p>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-1/12 cursor-pointer">
                      <IconDotsVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                      {/* TODO: implement editing functionality */}
                      <DropdownMenuItem onClick={() => handleDeleteQAndA(idx)}>
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

export default TabQAndA
