import { ScrollArea } from "@/components/ui/scroll-area"
import ResponseStrategyCard from "./partials/ResponseStrategyCard"
import AiAgentCard from "./partials/AiAgentCard"

const General = () => {
  return (
    <section className="flex w-full flex-col py-4 pr-2">
      <h2 className="mx-auto w-full max-w-4xl self-start px-1 text-left text-3xl font-semibold">
        Bot Behaviour
      </h2>
      <ScrollArea className="mt-3 h-[calc(100vh_-_80px)] w-full px-5">
        <div className="mx-auto mb-5 flex max-w-4xl flex-col space-y-7">
          <ResponseStrategyCard />

          <AiAgentCard />
        </div>
      </ScrollArea>
    </section>
  )
}

export default General
