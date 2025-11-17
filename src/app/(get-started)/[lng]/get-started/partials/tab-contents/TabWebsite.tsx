import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TabsContent } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconFilter2Question, IconWorld } from "@tabler/icons-react"
// import { IconAlertTriangle } from "@tabler/icons-react"
import { AlertTriangleIcon, ChevronDownIcon, FileText } from "lucide-react"
import { motion, Variants } from "motion/react"
// import Image from "next/image"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

interface TabWebsiteProps {
  motionVariants: Variants
}

const linkSchema = z.object({
  links: z.array(
    z.object({
      url: z.string().url(),
      selected: z.boolean()
    })
  )
})

const defaultLinks = [
  { url: "https://medium.com/ai-ux-designers/", selected: true },
  { url: "https://medium.com/ai-ux-designers/", selected: true },
  { url: "https://medium.com/ai-ux-designers/", selected: true },
  { url: "https://medium.com/ai-ux-designers/", selected: true },
  { url: "https://medium.com/ai-ux-designers/", selected: true },
  { url: "https://medium.com/ai-ux-designers/", selected: true }
]

const TabWebsite = ({ motionVariants }: TabWebsiteProps) => {
  const [protocol, setProtocol] = useState("https://")

  // Handler for protocol selection
  const handleProtocolSelect = (selected: string) => () => {
    setProtocol(selected)
  }

  const form = useForm({
    defaultValues: { links: defaultLinks },
    resolver: zodResolver(linkSchema)
  })
  const { fields } = useFieldArray({ control: form.control, name: "links" })

  return (
    <TabsContent
      value="website"
      className="mt-10 flex h-full w-full items-start justify-between space-x-12"
    >
      <motion.div
        key="website-content"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motionVariants}
        className="h-full w-full"
      >
        <div className="mb-6 flex flex-col space-y-1">
          <h2 className="text-xl font-semibold text-zinc-950">
            Add your Website
          </h2>
          <p className="text-sm font-medium text-zinc-500">
            Just paste a website link and your agent will instantly learn from
            its content—no extra setup needed.
          </p>
        </div>

        <Card className="relative border-zinc-300 bg-white">
          <CardHeader>
            <CardTitle className="text-zinc-950">Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-zinc-900">URL</p>

              <InputGroup className="rounded-md border-zinc-200 bg-white">
                <InputGroupInput placeholder="www.example.com" />
                <InputGroupAddon align="inline-start">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <InputGroupButton
                        variant="ghost"
                        className="w-24 space-x-1 text-sm font-medium focus-visible:ring-zinc-300"
                      >
                        <span>{protocol}</span>{" "}
                        <ChevronDownIcon className="size-3" />
                      </InputGroupButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white text-zinc-500"
                    >
                      <DropdownMenuItem
                        onClick={handleProtocolSelect("https://")}
                      >
                        https://
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleProtocolSelect("http://")}
                      >
                        http://
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Separator orientation="vertical" className="mx-0 h-4 p-0" />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="mt-4 flex justify-end">
              <Button>Fetch Links</Button>
            </div>
          </CardContent>

          {/* INFO: to use when functionality is implemented */}
          {/* <div className="absolute bottom-0 left-0 flex h-full w-full flex-col items-center justify-center rounded-xl bg-white/60 backdrop-blur-[2px]">
              <Image
                src="/assets/images/onboarding-max-links-warning-icon.png"
                alt="onboarding max links warning icon"
                width={57}
                height={27}
              />

              <p className="mb-0.5 text-xl font-semibold text-zinc-950">
                Looks like your site is big!
              </p>
              <p className="max-w-md text-base font-medium text-zinc-600">
                Your website has more than 10 links. The free plan allows only
                10. Do you want to select the first 10 links in order?
              </p>

              <Button className="mt-2 h-9 w-20 bg-[#1E50EF] hover:bg-[#1E50EF]/80">
                Select
              </Button>
            </div> */}
        </Card>

        {/* INFO: temporary experiment. change or remove when adding the functionality */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-zinc-950">Link sources</h2>

          <div className="mb-2 flex items-center justify-between">
            <p>
              {
                form
                  .watch("links")
                  .filter((link: { selected: boolean }) => link.selected).length
              }
              /{fields.length} links
            </p>

            <div className="flex items-center space-x-2 text-xs font-medium">
              <AlertTriangleIcon className="size-4 stroke-zinc-500" />
              <p>10000/10000</p>
            </div>
          </div>

          <ScrollArea className="h-20 w-full">
            <Form {...form}>
              <form>
                <div className="flex flex-col space-y-2">
                  {fields.map((field, idx) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`links.${idx}.selected`}
                      render={({ field: checkboxField }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={checkboxField.value}
                              onCheckedChange={checkboxField.onChange}
                              onBlur={checkboxField.onBlur}
                              name={checkboxField.name}
                              ref={checkboxField.ref}
                              disabled={checkboxField.disabled}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {field.url}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </form>
            </Form>
          </ScrollArea>
        </div>
      </motion.div>

      <motion.div
        key="website-sidebar"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.2 } },
          exit: { opacity: 0, y: 30 }
        }}
        className="w-96 max-w-96"
      >
        <Card className="p-0">
          <CardHeader className="p-3 pb-1.5">
            <CardTitle className="text-lg font-semibold text-zinc-950">
              Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <div className="flex flex-col space-y-4">
              {/* INFO: to use when functionality is implemented */}
              {/* <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-zinc-200 px-2.5 py-3 shadow-xs">
                <IconAlertTriangle className="size-5 stroke-zinc-500" />

                <p className="text-center text-xs font-normal text-zinc-500">
                  Your sources will show up here—try pasting a link or uploading
                  a file to begin.
                </p>
              </div> */}

              <div className="flex w-full flex-col space-y-2">
                {/* INFO: warning version */}
                {/* <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
                  <span className="flex h-full w-5/12 bg-gradient-to-r from-[#DA0000] to-[#FF0101]"></span>
                </div> */}

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
                  <span className="flex h-full w-8/12 bg-gradient-to-r from-[#0736F0] to-[#0088FF]"></span>
                </div>

                <p className="shine-text text-xs font-medium">
                  Your agent is getting smarter…
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <IconWorld className="size-4 stroke-zinc-600" />
                    <p className="text-sm font-normal text-zinc-600">Website</p>
                  </div>

                  <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                    <p>0</p>
                    <p>KB</p>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="size-4 stroke-zinc-600" />
                    <p className="text-sm font-normal text-zinc-600">Website</p>
                  </div>

                  <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                    <p>25</p>
                    <p>KB</p>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <IconFilter2Question className="size-4 stroke-zinc-600" />
                    <p className="text-sm font-normal text-zinc-600">Website</p>
                  </div>

                  <div className="flex space-x-1 text-xs font-semibold text-zinc-700">
                    <p>25</p>
                    <p>KB</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between rounded-lg border border-zinc-200/90 bg-zinc-50 px-3 py-2">
                <p className="text-sm font-normal text-zinc-700">Total size</p>
                <div className="flex space-x-1 text-sm font-semibold text-zinc-700">
                  <p>0</p>
                  <p>KB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex w-full">
          <Button className="w-full bg-[#1E50EF] p-3 hover:bg-[#1E50EF]/80">
            Train agent
          </Button>
        </div>
      </motion.div>
    </TabsContent>
  )
}

export default TabWebsite
