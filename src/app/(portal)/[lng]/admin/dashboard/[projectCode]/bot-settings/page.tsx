import { Header } from "@/components/layout/Header"
import ChatInterface from "./partials/ChatInterface"

export default function BotSettings() {
  return (
    <>
      <Header />

      <div className="flex">
        <ChatInterface />
      </div>
    </>
  )
}
