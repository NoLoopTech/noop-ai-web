import { Header } from "@/components/layout/Header"
import ChatInterface from "./partials/ChatInterface"
import ChatPreview from "./partials/ChatPreview"

export default function BotSettings() {
  return (
    <>
      <Header />

      <div className="flex">
        {/* Chat Interface */}
        <div className="bg-background flex-1 space-y-4 p-4">
          <h2 className="text-xl font-semibold">Chat Interface</h2>
          <ChatInterface />
        </div>

        {/* Bot preview */}
        <div className="border-muted/50 relative w-[510px] space-y-4 overflow-hidden border-l bg-zinc-600 bg-[url(/assets/images/bot-settings-preview-bg.png)] bg-cover bg-center px-20 py-4">
          <ChatPreview />
        </div>
      </div>
    </>
  )
}
