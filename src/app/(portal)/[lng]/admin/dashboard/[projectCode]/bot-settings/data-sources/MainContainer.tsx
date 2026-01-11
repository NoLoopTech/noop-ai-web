"use client"

import SourcesPanel from "./partials/SourcesPanel"
import TabContainer from "./partials/TabContainer"

const MainContainer = () => {
  return (
    <section className="flex h-[calc(100vh-64px)] w-full">
      <div className="flex w-full flex-col border-r border-zinc-200 px-5 py-4 pr-2 dark:border-inherit">
        <div className="mx-auto my-1 w-full space-y-1.5 self-start text-left">
          <h2 className="text-2xl font-semibold">Data Sources</h2>

          <p className="text-base font-medium text-zinc-500">
            Sets the credit usage cap for this agent, based on your workspace’s
            available credits.
          </p>
        </div>

        <div className="mx-auto mt-8 mb-5 flex w-full flex-col space-y-7">
          <TabContainer />
        </div>
      </div>

      <div className="flex h-full w-md max-w-md bg-zinc-100 dark:bg-slate-900">
        <SourcesPanel />
      </div>
    </section>
  )
}

export default MainContainer
