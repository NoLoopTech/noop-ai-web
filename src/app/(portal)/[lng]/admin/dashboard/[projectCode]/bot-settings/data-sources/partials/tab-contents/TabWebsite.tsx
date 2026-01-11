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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangleIcon, ChevronDownIcon } from "lucide-react"
import { motion, Variants, AnimatePresence } from "motion/react"
import { useEffect, useState } from "react"
import { z } from "zod"
import { useBotSettingsFileSourcesStore } from "../../store/botSettingsFileSources.store"

interface TabWebsiteProps {
  motionVariants: Variants
}

const TabWebsite = ({ motionVariants }: TabWebsiteProps) => {
  const urlSchema = z.string().url({ message: "Please enter a valid URL" })
  const [protocol, setProtocol] = useState("https://")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("crawl-links")

  const [showSelectWarning, setShowSelectWarning] = useState(false)

  const handleProtocolSelect = (selected: string) => () => {
    setProtocol(selected)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    const result = urlSchema.safeParse(protocol + e.target.value)
    setError(result.success ? null : result.error.errors[0].message)
  }

  const handleFetchLinks = () => {
    const result = urlSchema.safeParse(protocol + url)
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }
    setError(null)
  }

  const {
    websiteLinks,
    setWebsiteLinks,
    toggleWebsiteLink,
    setShowUrlWarning,
    showUrlWarning
  } = useBotSettingsFileSourcesStore()

  const handleToggleWebsiteLink = (idx: number) => () => {
    const nextLinks = websiteLinks.map((l, i) =>
      i === idx ? { ...l, selected: !l.selected } : l
    )
    toggleWebsiteLink(idx)
    setShowUrlWarning(false)

    if (showSelectWarning && nextLinks.some(l => l.selected)) {
      setShowSelectWarning(false)
    }
  }

  // INFO: Test data for UI development
  useEffect(() => {
    if (websiteLinks.length === 0) {
      const testLinks = Array.from({ length: 20 }, (_, i) => ({
        url: `https://example.com/page-${i + 1}`,
        selected: i < 3
      }))
      setWebsiteLinks(testLinks)
    }
  }, [])

  return (
    <TabsContent value="website">
      <motion.div
        key="website-content"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={motionVariants}
        className="h-full w-full"
      >
        <div className="flex flex-col space-y-2">
          <h2 className="text-foreground text-xl/3 font-semibold">Website</h2>
          <p className="text-sm font-medium text-zinc-500">
            Crawl web pages or submit sitemaps to update your AI with the latest
            content.
          </p>
        </div>

        <Tabs
          className="h-full w-full"
          defaultValue={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="my-4">
            <TabsTrigger value="crawl-links">
              <p>Crawl Links</p>
            </TabsTrigger>

            <TabsTrigger value="sitemap" disabled>
              <p>Sitemap</p>
            </TabsTrigger>

            <TabsTrigger value="individual-links" disabled>
              <p>Individual Links</p>
            </TabsTrigger>
          </TabsList>

          <Separator className="w-[calc(100%-16px)]" />

          <AnimatePresence mode="wait">
            <ScrollArea
              className="mt-4 h-[calc(100vh-20rem)] w-full pr-4"
              scrollbarVariant="tiny"
            >
              <div className="h-full w-full">
                {activeTab === "crawl-links" && (
                  <motion.div
                    key="website-tab-crawl-links"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={motionVariants}
                  >
                    <Card className="relative border-zinc-300 bg-white p-0 dark:border-slate-700 dark:bg-slate-950">
                      <CardHeader className="px-3.5 pt-2.5 pb-2">
                        <CardTitle className="text-foreground text-lg font-semibold">
                          Add links
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-3.5 pb-4">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-400">
                            URL
                          </p>

                          <InputGroup className="rounded-md border-zinc-200 bg-white dark:border-slate-700 dark:bg-slate-950">
                            <InputGroupInput
                              placeholder="www.example.com"
                              value={url}
                              onChange={handleInputChange}
                              aria-invalid={!!error}
                            />

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
                                  align="start"
                                  className="bg-white text-zinc-500 dark:bg-slate-950 dark:text-zinc-400"
                                >
                                  <DropdownMenuItem
                                    onClick={handleProtocolSelect("https://")}
                                    className="dark:hover:bg-slate-900"
                                  >
                                    https://
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={handleProtocolSelect("http://")}
                                    className="dark:hover:bg-slate-900"
                                  >
                                    http://
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <Separator
                                orientation="vertical"
                                className="h-4"
                              />
                            </InputGroupAddon>
                          </InputGroup>
                        </div>

                        <div className="flex w-full justify-between">
                          <p className="mt-1.5 ml-3 text-xs text-red-500">
                            {error ?? ""}
                          </p>

                          <div className="mt-4 flex items-center justify-end space-x-4">
                            <Button
                              onClick={handleFetchLinks}
                              disabled={!url || !!error}
                            >
                              <p>Fetch Links</p>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="mt-5">
                      <h2 className="text-foreground text-lg font-semibold">
                        Link sources
                      </h2>

                      <div
                        className={`mt-1 mb-2 flex h-10 items-center justify-between rounded-t-lg border-b border-zinc-300 bg-zinc-100 px-3.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-900 ${showUrlWarning ? "text-[#FF383C]" : "text-zinc-500 dark:text-zinc-400"}`}
                      >
                        <p>
                          {websiteLinks.filter(link => link.selected).length}
                          <span className="px-0.5">/</span>
                          {websiteLinks.length} links
                        </p>

                        {/* TODO: Update this section's UI */}
                        <div className="flex items-center space-x-2 text-xs font-medium">
                          <AlertTriangleIcon className="size-3.5" />
                          <p>
                            10000<span className="px-0.5">/</span>10000
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col pb-5">
                        {websiteLinks.map((link, idx) => {
                          const isDisabled =
                            !link.selected &&
                            websiteLinks.filter(l => l.selected).length >= 10

                          return (
                            <label
                              key={link.url + idx}
                              className={`flex h-12 items-center space-x-2 border-b border-zinc-200 px-4 dark:border-slate-700 ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                            >
                              <Checkbox
                                id={`link-${idx}`}
                                checked={link.selected}
                                disabled={isDisabled}
                                onCheckedChange={handleToggleWebsiteLink(idx)}
                                className="dark:border-slate-700 dark:bg-slate-950 dark:text-zinc-400"
                              />

                              <span className="text-sm font-normal select-none">
                                {link.url}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "sitemap" && (
                  <motion.div
                    key="website-tab-sitemap"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={motionVariants}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <p>Sitemap</p>
                  </motion.div>
                )}

                {activeTab === "individual-links" && (
                  <motion.div
                    key="website-tab-individual-links"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={motionVariants}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <p>Individual Links</p>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </TabsContent>
  )
}

export default TabWebsite
