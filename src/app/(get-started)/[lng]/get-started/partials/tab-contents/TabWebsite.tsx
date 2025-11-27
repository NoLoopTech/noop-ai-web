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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TabsContent } from "@/components/ui/tabs"
// import { IconAlertTriangle } from "@tabler/icons-react"
import { AlertTriangleIcon, ChevronDownIcon } from "lucide-react"
import { motion, Variants } from "motion/react"
// import Image from "next/image"
import { useState } from "react"
import { useOnboardingStore } from "../../store/onboarding.store"

interface TabWebsiteProps {
  motionVariants: Variants
}

const TabWebsite = ({ motionVariants }: TabWebsiteProps) => {
  const [protocol, setProtocol] = useState("https://")

  const websiteLinks = useOnboardingStore(s => s.websiteLinks)
  const toggleWebsiteLink = useOnboardingStore(s => s.toggleWebsiteLink)

  const handleProtocolSelect = (selected: string) => () => {
    setProtocol(selected)
  }

  return (
    <TabsContent
      value="website"
      className="flex h-full w-full items-start justify-between space-x-12"
    >
      <motion.div
        key="website-content"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motionVariants}
        className="h-full w-full"
      >
        <div className="mb-4 flex flex-col space-y-1">
          <h2 className="text-xl font-semibold text-zinc-950">
            Add your Website
          </h2>
          <p className="text-sm font-medium text-zinc-500">
            Just paste a website link and your agent will instantly learn from
            its content—no extra setup needed.
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-19.4rem)] w-full pr-4">
          <Card className="relative border-zinc-300 bg-white p-0">
            <CardHeader className="px-3.5 pt-2.5 pb-2">
              <CardTitle className="text-lg font-semibold text-zinc-950">
                Add links
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3.5 pb-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-zinc-900">URL</p>

                <InputGroup className="rounded-md border-zinc-200 bg-white">
                  <InputGroupInput placeholder="www.example.com" />
                  <InputGroupAddon align="inline-start">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <InputGroupButton
                          variant="ghost"
                          className="flex w-[90px] items-center justify-between space-x-1 text-sm font-medium focus-visible:ring-zinc-300"
                        >
                          <span>{protocol}</span>
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

                    <Separator orientation="vertical" className="h-4" />
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
                src="/assets/icons/onboarding-max-links-warning-icon.png"
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

          {/* TODO: Update this section's UI */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold text-zinc-950">
              Link sources
            </h2>

            <div className="mt-1 mb-2 flex h-10 items-center justify-between rounded-t-lg border-b border-zinc-300 bg-zinc-100 px-3.5 text-sm font-normal text-zinc-500">
              <p>
                {websiteLinks.filter(link => link.selected).length}
                <span className="px-0.5">/</span>
                {websiteLinks.length} links
              </p>

              <div className="flex items-center space-x-2 text-xs font-medium">
                <AlertTriangleIcon className="size-3.5" />
                <p>
                  10000<span className="px-0.5">/</span>10000
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              {websiteLinks.map((link, idx) => (
                <div
                  key={link.url + idx}
                  className="flex h-12 items-center space-x-2 border-b border-zinc-200 px-4"
                >
                  <Checkbox
                    checked={link.selected}
                    onCheckedChange={() => toggleWebsiteLink(idx)}
                  />
                  <span className="text-sm font-normal">{link.url}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </TabsContent>
  )
}

export default TabWebsite
