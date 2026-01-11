import { ScrollArea } from "@/components/ui/scroll-area"
import ResponseStrategyCard from "./partials/ResponseStrategyCard"
import AiAgentCard from "./partials/AiAgentCard"

const General = () => {
  return (
    <section className="mt-5 flex w-full flex-col pr-2">
      <h2 className="mx-auto w-full max-w-4xl self-start px-1 text-left text-3xl font-semibold">
        Bot Behaviour
      </h2>
      <ScrollArea className="mt-3 h-[calc(100vh-8.4rem)] w-full bg-amber-400 px-5">
        <div className="mx-auto mb-4 flex max-w-4xl flex-col space-y-7">
          <ResponseStrategyCard />

          <AiAgentCard />
        </div>
      </ScrollArea>
    </section>
  )
}

export default General
