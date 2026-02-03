import { ScrollArea } from "@/components/ui/scroll-area"
import MainContainer from "./partials/MainContainer"

const General = () => {
  return (
    <section className="mt-5 flex w-full flex-col pr-2">
      <h2 className="mx-auto w-full max-w-4xl self-start px-1 text-left text-3xl font-semibold">
        Bot Behaviour
      </h2>
      <ScrollArea className="mt-3 h-[calc(100vh-8.4rem)] w-full px-5">
        <MainContainer />
      </ScrollArea>
    </section>
  )
}

export default General
