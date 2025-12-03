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
import Image from "next/image"
import { useEffect, useState } from "react"
import { useOnboardingStore } from "../../store/onboarding.store"
import { z } from "zod"
import { useApiMutation } from "@/query"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { IconLoader } from "@tabler/icons-react"

interface TabWebsiteProps {
  motionVariants: Variants
}

const TabWebsite = ({ motionVariants }: TabWebsiteProps) => {
  const urlSchema = z.string().url({ message: "Please enter a valid URL" })
  const [protocol, setProtocol] = useState("https://")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)

  const [showSelectWarning, setShowSelectWarning] = useState(false)

  const handleProtocolSelect = (selected: string) => () => {
    setProtocol(selected)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    const result = urlSchema.safeParse(protocol + e.target.value)
    setError(result.success ? null : result.error.errors[0].message)
  }

  const fetchLinksMutation = useApiMutation<
    { childUrls: string[]; baseUrl: string },
    { url: string }
  >("/onboarding/scrape", "post", {
    onSuccess: data => {
      if (data.childUrls.length > 10) {
        setShowSelectWarning(true)
        setWebsiteLinks(data.childUrls.map(url => ({ url, selected: false })))
      } else {
        setShowSelectWarning(false)
        setWebsiteLinks(data.childUrls.map(url => ({ url, selected: false })))
      }
    }
  })

  const handleFetchLinks = () => {
    const result = urlSchema.safeParse(protocol + url)
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }
    setError(null)
    fetchLinksMutation.mutate({ url: protocol + url })
  }

  const {
    websiteLinks,
    setWebsiteLinks,
    toggleWebsiteLink,
    setShowUrlWarning,
    showUrlWarning
  } = useOnboardingStore()

  useEffect(() => {
    if (fetchLinksMutation.data?.childUrls) {
      if (fetchLinksMutation.data.childUrls.length > 10) {
        setShowSelectWarning(true)
        setShowUrlWarning(true)
        setWebsiteLinks(
          fetchLinksMutation.data.childUrls.map(url => ({
            url,
            selected: false
          }))
        )
      } else {
        setShowSelectWarning(false)
        setShowUrlWarning(false)
        setWebsiteLinks(
          fetchLinksMutation.data.childUrls.map(url => ({
            url,
            selected: false
          }))
        )
      }
    }
  }, [fetchLinksMutation.data, setWebsiteLinks])

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
    // Calculate what the next selection state will be
    const nextLinks = websiteLinks.map((l, i) =>
      i === idx ? { ...l, selected: !l.selected } : l
    )
    toggleWebsiteLink(idx)
    setShowUrlWarning(false)

    if (showSelectWarning && nextLinks.some(l => l.selected)) {
      setShowSelectWarning(false)
    }
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
                    disabled={!url || !!error || fetchLinksMutation.isPending}
                  >
                    {fetchLinksMutation.isPending ? (
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
                    disabled={
                      !link.selected &&
                      websiteLinks.filter(l => l.selected).length >= 10
                    }
                    onCheckedChange={handleToggleWebsiteLink(idx)}
                  />

                  <span className="text-sm font-normal">{link.url}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Alert dialog for confirming first 10 links selection */}
        <AlertDialog
          open={showSelectWarning}
          onOpenChange={setShowSelectWarning}
        >
          <AlertDialogContent className="py-5">
            {/* Add visually hidden title for accessibility. without AlertDialogTitle it shows a error */}
            <div className="hidden">
              <AlertDialogTitle>
                Confirm first 10 links selection
              </AlertDialogTitle>
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
      </motion.div>
    </TabsContent>
  )
}

export default TabWebsite
