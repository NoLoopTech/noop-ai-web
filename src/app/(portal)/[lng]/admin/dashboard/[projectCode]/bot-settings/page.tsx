import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/Header"
import ChatInterface from "./partials/ChatInterface"

export default function BotSettings() {
  return (
    <>
      <Header />

      <div className="grid grid-cols-12">
        {/* Chat Interface */}
        <div className="bg-background col-span-7 space-y-4 p-4">
          <h2 className="text-xl font-semibold">Chat Interface</h2>
          <ChatInterface />
        </div>

        {/* Bot preview */}
        <div className="col-span-5 space-y-4 p-4">
          <Tabs
            orientation="vertical"
            defaultValue="chat"
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="bubble">Bubble</TabsTrigger>
              <TabsTrigger value="welcome">Welcome</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="space-y-4">
              <p>Chat</p>
            </TabsContent>
            <TabsContent value="bubble" className="space-y-4">
              <p>Bubble</p>
            </TabsContent>
            <TabsContent value="welcome" className="space-y-4">
              <p>Welcome</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
