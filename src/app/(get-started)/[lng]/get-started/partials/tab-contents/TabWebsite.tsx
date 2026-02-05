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
import { ChevronDownIcon } from "lucide-react"
import { motion, Variants } from "motion/react"
import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { useOnboardingStore } from "../../store/onboarding.store"
import { z } from "zod"
import { useApiMutation } from "@/query"
import { io, Socket } from "socket.io-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription
} from "@/components/ui/alert-dialog"
import { IconLoader } from "@tabler/icons-react"

interface TabWebsiteProps {
  motionVariants: Variants
}

const TabWebsite = ({ motionVariants }: TabWebsiteProps) => {
  const urlSchema = z.string().url({ message: "Please enter a valid URL" })
  const [protocol, setProtocol] = useState<"http://" | "https://">("https://")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isCrawling, setIsCrawling] = useState(false)
  const [isSocketRegistered, setIsSocketRegistered] = useState(false)

  const [showSelectWarning, setShowSelectWarning] = useState(false)

  // WebSocket refs
  const socketRef = useRef<Socket | null>(null)
  const clientIdRef = useRef<string>(
    `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  )

  const {
    setBaseUrl,
    websiteLinks,
    setWebsiteLinks,
    toggleWebsiteLink,
    setShowUrlWarning,
    showUrlWarning
  } = useOnboardingStore()

  // Handle incoming crawl results
  const handleSitemapDone = useCallback(
    (data: { jobId: string; url: string; links: string[]; count: number }) => {
      setIsCrawling(false)
      if (data.links.length > 10) {
        setShowSelectWarning(true)
        setShowUrlWarning(true)
        setWebsiteLinks(data.links.map(url => ({ url, selected: false })))
      } else {
        setShowSelectWarning(false)
        setShowUrlWarning(false)
        setWebsiteLinks(data.links.map(url => ({ url, selected: true })))
      }
    },
    [setShowUrlWarning, setWebsiteLinks]
  )

  const handleCrawlError = useCallback(
    (data: { jobId: string; error: string }) => {
      setIsCrawling(false)
      setError(`Crawl failed: ${data.error}`)
    },
    []
  )

  // Initialize WebSocket connection
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL as string
    const baseUrl = apiUrl.replace(/\/v1\/?$/, "")

    const socket = io(`${baseUrl}/crawler`, {
      transports: ["websocket", "polling"],
      autoConnect: true
    })

    socketRef.current = socket

    socket.on("connect", () => {
      socket.emit("register", { clientId: clientIdRef.current })
    })

    socket.on("registered", () => {
      setIsSocketRegistered(true)
    })

    socket.on("disconnect", () => {
      setIsSocketRegistered(false)
    })

    socket.on("sitemap_done", handleSitemapDone)
    socket.on("crawl_error", handleCrawlError)

    return () => {
      socket.off("sitemap_done", handleSitemapDone)
      socket.off("crawl_error", handleCrawlError)
      socket.off("registered")
      socket.off("disconnect")
      socket.disconnect()
    }
  }, [handleSitemapDone, handleCrawlError])

  const handleProtocolSelect = (selected: "http://" | "https://") => () => {
    setProtocol(selected)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    const result = urlSchema.safeParse(protocol + e.target.value)
    setError(result.success ? null : result.error.errors[0].message)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")

    // INFO: Detect and set protocol from pasted URL
    let detectedProtocol: "http://" | "https://" = protocol
    if (pastedText.startsWith("https://")) {
      detectedProtocol = "https://"
    } else if (pastedText.startsWith("http://")) {
      detectedProtocol = "http://"
    }
    setProtocol(detectedProtocol)

    const cleanedUrl = pastedText.replace(/^https?:\/\//, "")
    setUrl(cleanedUrl)
    const result = urlSchema.safeParse(detectedProtocol + cleanedUrl)
    setError(result.success ? null : result.error.errors[0].message)
  }

  const startCrawlMutation = useApiMutation<
    { jobId: string; },
    { url: string; clientId: string }
  >("/onboarding/crawl/start", "post", {
    onSuccess: () => {
      setIsCrawling(true)
    },
    onError: () => {
      setIsCrawling(false)
      setError("Failed to start crawl")
    }
  })

  const handleFetchLinks = () => {
    const result = urlSchema.safeParse(protocol + url)
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }
    setError(null)
    setIsCrawling(true)
    startCrawlMutation.mutate({
      url: protocol + url,
      clientId: clientIdRef.current
    })
    setBaseUrl({ protocol, domain: url })
  }

  const handleSelectFirst10 = () => {
    setWebsiteLinks(
      websiteLinks.map((link, idx) => ({
        url: link.url,
        selected: idx < 10
      }))
    )
    setShowSelectWarning(false)
    setShowUrlWarning(false)
  }

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // INFO: Select up to 10 links
      setWebsiteLinks(
        websiteLinks.map((link, idx) => ({
          url: link.url,
          selected: idx < 10
        }))
      )
    } else {
      // INFO: Deselect all links
      setWebsiteLinks(
        websiteLinks.map(link => ({
          url: link.url,
          selected: false
        }))
      )
    }
    setShowUrlWarning(false)
    setShowSelectWarning(false)
  }

  const selectedCount = websiteLinks.filter(link => link.selected).length
  const maxSelectable = Math.min(websiteLinks.length, 10)
  const allSelected = selectedCount === maxSelectable && maxSelectable > 0

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
                  <InputGroupInput
                    placeholder="www.example.com"
                    value={url}
                    onPaste={handlePaste}
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

              <div className="flex w-full justify-between">
                <p className="mt-1.5 ml-3 text-xs text-red-500">
                  {error ?? ""}
                </p>

                <div className="mt-4 flex items-center justify-end space-x-4">
                  {/* {fetchLinksMutation.error && (
                    <p className="mt-1 text-xs text-red-500">
                      Failed to fetch links
                    </p>
                  )} */}

                  <Button
                    onClick={handleFetchLinks}
                    disabled={!url || !!error || isCrawling || !isSocketRegistered}
                  >
                    {isCrawling ? (
                      <div className="flex items-center space-x-2">
                        <IconLoader className="inline-block size-4 animate-spin" />
                        <p>Fetching...</p>
                      </div>
                    ) : (
                      <p>Fetch Links</p>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TODO: Update this section's UI */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold text-zinc-950">
              Link sources
            </h2>

            <div
              className={`mt-1 mb-2 flex h-10 items-center justify-between rounded-t-lg border-b border-zinc-300 bg-zinc-100 px-3.5 text-sm font-normal ${showUrlWarning ? "text-[#FF383C]" : "text-zinc-500"}`}
            >
              <div className="flex items-center space-x-2">
                {websiteLinks.length > 0 && (
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                  />
                )}
                <p>
                  {selectedCount}
                  <span className="px-0.5">/</span>
                  {websiteLinks.length} links
                </p>
              </div>

              {/* TODO: remove this later */}
              {/* <div className="flex items-center space-x-2 text-xs font-medium">
                <AlertTriangleIcon className="size-3.5" />
                <p>
                  10000<span className="px-0.5">/</span>10000
                </p>
              </div> */}
            </div>

            <div className="flex flex-col">
              {websiteLinks.map((link, idx) => {
                const isDisabled =
                  !link.selected &&
                  websiteLinks.filter(l => l.selected).length >= 10

                return (
                  <label
                    key={link.url + idx}
                    className={`flex h-12 items-center space-x-2 border-b border-zinc-200 pr-4 pl-[14.3px] ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                  >
                    <Checkbox
                      id={`link-${idx}`}
                      checked={link.selected}
                      disabled={isDisabled}
                      onCheckedChange={handleToggleWebsiteLink(idx)}
                    />

                    <span className="text-sm font-normal select-none">
                      {link.url}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        </ScrollArea>
      </motion.div>

      {/* Alert dialog for confirming first 10 links selection */}
      <AlertDialog open={showSelectWarning} onOpenChange={setShowSelectWarning}>
        <AlertDialogContent className="py-5">
          {/* Add visually screen reader only title & description for accessibility. without AlertDialogTitle it shows a error */}
          <div className="sr-only">
            <AlertDialogTitle>
              Confirm first 10 links selection
            </AlertDialogTitle>
            <AlertDialogDescription>
              Confirm selecting the first 10 links from the website.
            </AlertDialogDescription>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <Image
              src="/assets/icons/onboarding-max-links-warning-icon.png"
              alt="onboarding max links warning icon"
              width={57}
              height={27}
            />

            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <h3 className="text-lg font-semibold text-zinc-950">
                Looks like your site is big!
              </h3>
              <p className="text-sm font-medium text-zinc-500">
                Your website has more than 10 links. The free plan allows only
                10. Do you want to select the first 10 links in order?
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <AlertDialogCancel className="border-none shadow-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSelectFirst10}
              className="w-max bg-[#1E50EF] p-3 hover:bg-[#1E50EF]/80"
            >
              Select
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  )
}

export default TabWebsite
