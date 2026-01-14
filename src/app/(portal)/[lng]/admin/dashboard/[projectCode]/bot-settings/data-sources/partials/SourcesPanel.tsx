"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconFilter2Question,
  IconInfoCircle,
  IconWorld,
  IconWorldHeart
} from "@tabler/icons-react"
import { FileText, Type } from "lucide-react"
import { useBotSettingsFileSourcesStore } from "../store/botSettingsFileSources.store"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SourcesPanelProps {
  isTrainedSourcesLoading: boolean
}

const SourcesPanel = ({ isTrainedSourcesLoading }: SourcesPanelProps) => {
  const { websiteLinks, files, textSources, qAndAs, socialMedia } =
    useBotSettingsFileSourcesStore()

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const handleTrainClick = () => {
    setIsButtonDisabled(true)
  }

  return (
    <div className="mx-auto mt-7 w-full max-w-2xs">
      <Card className="p-0">
        <CardHeader className="p-3 pb-1.5">
          <CardTitle className="text-foreground text-lg font-semibold">
            Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <div className="flex flex-col space-y-4">
            {isTrainedSourcesLoading ? (
              <div className="shine h-[37.6px] w-full rounded-lg" />
            ) : (
              <div className="flex flex-col space-y-2">
                {/* Website Links */}
                {websiteLinks.length > 0 && (
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-zinc-600 dark:border-slate-800 dark:bg-slate-950 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <IconWorld className="size-4" />

                      <div className="flex space-x-1 text-xs font-semibold">
                        <p className="text-left text-sm font-normal">
                          {websiteLinks.filter(link => link.selected).length}
                        </p>

                        <p className="text-sm font-normal">Links</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                      <p>TBD</p>
                      <IconInfoCircle className="mt-0.5 size-3.5" />
                    </div>
                  </div>
                )}

                {/* Files */}
                {files.length > 0 && (
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-zinc-600 dark:border-slate-800 dark:bg-slate-950 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <FileText className="size-4" />

                      <div className="flex space-x-1 text-xs font-semibold">
                        <p className="text-left text-sm font-normal">
                          {files.length}
                        </p>

                        <p className="text-sm font-normal">Files</p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                      <p>
                        {files
                          .reduce((acc, curr) => acc + curr.size / 1024, 0)
                          .toFixed(3)}
                      </p>
                      <p>KB</p>
                    </div>
                  </div>
                )}

                {/* Text Sources */}
                {textSources.length > 0 && (
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-zinc-600 dark:border-slate-800 dark:bg-slate-950 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <Type className="size-4" />

                      <div className="flex space-x-1 text-xs font-semibold">
                        <p className="text-left text-sm font-normal">
                          {textSources.length}
                        </p>

                        <p className="text-sm font-normal">Text</p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                      <p>
                        {textSources
                          .reduce((acc, curr) => acc + curr.size / 1024, 0)
                          .toFixed(3)}
                      </p>
                      <p>KB</p>
                    </div>
                  </div>
                )}

                {/* Q&A */}
                {qAndAs.length > 0 && (
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-zinc-600 dark:border-slate-800 dark:bg-slate-950 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <IconFilter2Question className="size-4" />

                      <div className="flex space-x-1 text-xs font-semibold">
                        <p className="text-left text-sm font-normal">
                          {qAndAs.length}
                        </p>

                        <p className="text-sm font-normal">Q&A</p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                      <p>
                        {qAndAs
                          .reduce((acc, curr) => acc + curr.size / 1024, 0)
                          .toFixed(3)}
                      </p>
                      <p>KB</p>
                    </div>
                  </div>
                )}

                {/* Social Media */}
                {socialMedia.length > 0 && (
                  <div className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-zinc-600 dark:border-slate-800 dark:bg-slate-950 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <IconWorldHeart className="size-4" />

                      <div className="flex space-x-1 text-xs font-semibold">
                        <p className="text-left text-sm font-normal">
                          {socialMedia.length}
                        </p>

                        <p className="text-sm font-normal">Social Media</p>
                      </div>
                    </div>

                    <div className="flex space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-50">
                      <p>25</p>
                      <p>KB</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isTrainedSourcesLoading ? (
              <div className="shine h-[37.6px] w-full rounded-lg" />
            ) : (
              <div className="flex justify-between rounded-lg border border-zinc-200/90 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-slate-700 dark:bg-slate-800 dark:text-zinc-50">
                <p className="font-normal">Total size</p>
                <div className="flex items-center space-x-0.5 font-semibold">
                  <div className="flex items-center">
                    <p>0</p>
                    <p>KB</p>
                  </div>

                  <p>/</p>

                  <div className="flex items-center">
                    <p>400</p>
                    <p>KB</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex w-full">
        <Button
          onClick={handleTrainClick}
          className="w-full"
          disabled={isButtonDisabled || isTrainedSourcesLoading}
        >
          Train agent
        </Button>
      </div>
    </div>
  )
}

export default SourcesPanel
