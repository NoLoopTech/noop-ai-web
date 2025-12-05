import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TabsContent } from "@/components/ui/tabs"
import { motion, Variants } from "motion/react"
import { useOnboardingStore } from "../../store/onboarding.store"
import { InputWithLength } from "@/components/InputWithLength"
import { useState } from "react"
import { calculateTextSizeFromLength } from "@/utils"
import { IconDotsVertical } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface TabTextProps {
  motionVariants: Variants
}

const TabText = ({ motionVariants }: TabTextProps) => {
  const { textSources, setTextSources } = useOnboardingStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleAddText = () => {
    const size = calculateTextSizeFromLength(description).bytes
    setTextSources([...textSources, { title, description, size }])
    setTitle("")
    setDescription("")
  }

  const handleDeleteText = (idx: number) => {
    setTextSources(textSources.filter((_, i) => i !== idx))
  }

  return (
    <TabsContent value="text" className="mt-4 h-96 rounded-md">
      <motion.div
        key="text-content"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motionVariants}
        className="h-full w-full"
      >
        <div className="mb-4 flex flex-col space-y-1">
          <h2 className="text-xl font-semibold text-zinc-950">Add your Text</h2>
          <p className="text-sm font-medium text-zinc-500">
            Add plain text-based sources to train your AI Agent with precise
            information.
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-19.4rem)] w-full pr-4">
          <Card className="relative border-zinc-300 bg-white p-0">
            <CardHeader className="px-3.5 pt-2.5 pb-2">
              <CardTitle className="text-lg font-semibold text-zinc-950">
                Add text snippet
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3.5 pb-4">
              <div className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-zinc-900">Title</p>

                  <InputGroup className="rounded-md border-zinc-200 bg-white">
                    <InputGroupInput
                      name="title"
                      placeholder="Ex: What is the AGI?"
                      value={title}
                      onChange={handleTitleChange}
                    />
                  </InputGroup>
                </div>

                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-zinc-900">
                    Description
                  </p>

                  <InputWithLength
                    value={description}
                    onChange={handleDescriptionChange}
                    name="description"
                    placeholder={"Enter your text snippet"}
                    type="textarea"
                    lengthType="bytes"
                    textareaAddonAlignment="block-end"
                    rows={2}
                  />
                </div>
              </div>

              <div className="mt-5 flex w-full justify-end">
                <Button
                  onClick={handleAddText}
                  disabled={!title || !description}
                >
                  Add Text
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* TODO: Update this section's UI. need to confirm what we show here */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold text-zinc-950">
              Text sources
            </h2>

            <div
              className={`mt-1 mb-2 flex h-10 items-center justify-between space-x-2 rounded-t-lg border-b border-zinc-300 bg-zinc-100 px-4 text-sm font-normal text-zinc-500`}
            >
              <p className="w-9/12 text-left">Title</p>

              <p className="w-2/12 text-left">
                Size<span className="text-xs text-zinc-500/75"> (bytes)</span>
              </p>

              <p className="w-1/12 cursor-pointer text-left">Action</p>
            </div>

            <div className="flex flex-col pb-5">
              {textSources.map((text, idx) => (
                <div
                  key={idx}
                  className="flex h-12 items-center space-x-2 border-b border-zinc-200 px-4 text-sm font-normal"
                >
                  <p className="w-9/12 text-left">{text.title}</p>

                  <p className="w-2/12 text-left">{text.size} bytes</p>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-1/12 cursor-pointer">
                      <IconDotsVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                      {/* TODO: implement editing functionality */}
                      <DropdownMenuItem onClick={() => handleDeleteText(idx)}>
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

export default TabText
