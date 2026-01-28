"use client"

import { IconArrowUp } from "@tabler/icons-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useOnboardingStore } from "../../store/onboarding.store"
import { ScrollArea } from "@/components/ui/scroll-area"
import Markdown from "react-markdown"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea
} from "@/components/ui/input-group"

type PreviewMessage =
  | { id: string; role: "assistant"; content: string }
  | { id: string; role: "user"; content: string }
  | { id: string; role: "thinking" }

type WebSocketAskPayload = {
  message: string
  web_name: string
  thread_id: string
  redis_prefix: string
  username?: string
  email?: string
}

type WebSocketResponsePayload = {
  response?: string
  thread_id?: string
  [key: string]: unknown
}

type WsStatus = "idle" | "connecting" | "open" | "closed" | "error"

const AgentPreview = () => {
  const { agentName, chatBotCode } = useOnboardingStore()

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL
  const redisPrefix = process.env.NEXT_PUBLIC_REDIS_PREFIX ?? ""

  const threadIdRef = useRef<string>(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now())
  )

  const wsRef = useRef<WebSocket | null>(null)
  const pendingPayloadRef = useRef<WebSocketAskPayload | null>(null)

  const [wsStatus, setWsStatus] = useState<WsStatus>("idle")
  const [connectionNotice, setConnectionNotice] = useState<string | null>(null)
  const [hasUserAttemptedSend, setHasUserAttemptedSend] = useState(false)

  const [messages, setMessages] = useState<PreviewMessage[]>(() => [
    {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `m_${Date.now()}_1`,
      role: "assistant",
      content: `Hi👋! I'm Noopy, your ${agentName ?? "AI"} AI assistant. How can I help you today?`
    }
  ])

  useEffect(() => {
    setMessages(prev => {
      if (prev.length !== 1) return prev
      const only = prev[0]
      if (only.role !== "assistant") return prev
      return [
        {
          ...only,
          content: `Hi👋! I'm Noopy, your ${agentName ?? "AI"} AI assistant. How can I help you today?`
        }
      ]
    })
  }, [agentName])

  const [input, setInput] = useState("")

  const addAssistantMessage = useCallback((content: string) => {
    setMessages(prev => {
      const withoutThinking = prev.filter(m => m.role !== "thinking")
      return [
        ...withoutThinking,
        {
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `m_${Date.now()}_ai`,
          role: "assistant",
          content
        }
      ]
    })
  }, [])

  const connectWebSocket = useCallback(() => {
    if (!wsUrl) return

    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return
    }

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      const pending = pendingPayloadRef.current
      if (pending) {
        pendingPayloadRef.current = null
        ws.send(JSON.stringify(pending))
      }
    }

    ws.onmessage = event => {
      try {
        const payload = JSON.parse(
          String(event.data)
        ) as WebSocketResponsePayload
        const responseText =
          typeof payload?.response === "string" &&
          payload.response.trim().length > 0
            ? payload.response
            : "Sorry, I couldn't generate a response."

        if (typeof payload?.thread_id === "string" && payload.thread_id) {
          threadIdRef.current = payload.thread_id
        }

        addAssistantMessage(responseText)
      } catch {
        addAssistantMessage(
          "Sorry, there was a problem processing the response."
        )
      }
    }

    ws.onerror = () => {
      addAssistantMessage(
        "I’m having trouble connecting right now. Please try again in a moment."
      )
    }
  }, [addAssistantMessage, wsUrl])

  useEffect(() => {
    if (!wsUrl) return
    connectWebSocket()

    return () => {
      const ws = wsRef.current
      if (ws) {
        ws.onopen = null
        ws.onmessage = null
        ws.onerror = null
        ws.onclose = null

        try {
          ws.close(1000, "cleanup")
        } catch {
          // ignore
        }
      }

      wsRef.current = null
      pendingPayloadRef.current = null
      setWsStatus("idle")
    }
  }, [connectWebSocket, wsUrl])

  const sendWebSocketMessage = useCallback(
    (payload: WebSocketAskPayload): void => {
      const ws = wsRef.current
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload))
        return
      }

      pendingPayloadRef.current = payload
      if (hasUserAttemptedSend) {
        setConnectionNotice("Connecting…")
      }
      connectWebSocket()
    },
    [connectWebSocket, hasUserAttemptedSend]
  )

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return

    setHasUserAttemptedSend(true)

    if (!chatBotCode) {
      addAssistantMessage(
        "I can’t send that yet. Please select a chatbot first."
      )
      return
    }

    setMessages(prev => [
      ...prev,
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `m_${Date.now()}_u`,
        role: "user",
        content: trimmed
      },
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `m_${Date.now()}_t`,
        role: "thinking"
      }
    ])

    setInput("")

    const wsPayload: WebSocketAskPayload = {
      message: trimmed,
      web_name: chatBotCode,
      thread_id: threadIdRef.current,
      redis_prefix: redisPrefix
    }

    sendWebSocketMessage(wsPayload)
  }, [
    addAssistantMessage,
    chatBotCode,
    input,
    redisPrefix,
    sendWebSocketMessage
  ])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    []
  )

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const bottomRef = useRef<HTMLDivElement | null>(null)

  const lastMessageId = useMemo(
    () => messages[messages.length - 1]?.id,
    [messages]
  )

  useEffect(() => {
    if (!lastMessageId) return
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    })
  }, [lastMessageId])

  const isSendDisabled = input.trim().length === 0 || wsStatus === "connecting"

  return (
    <div className="flex h-full max-h-[600px] w-[400px] flex-col overflow-hidden rounded-lg bg-white pb-2 shadow-md">
      <div className="flex h-14 w-full items-center rounded-t-md border-b border-zinc-300 bg-[#1E50EF]">
        <div className="flex h-full items-center space-x-2.5 px-4 py-3">
          <div className="flex size-[30px] items-center justify-center rounded-full border border-zinc-200 bg-zinc-500">
            <h2 className="mt-0.5 text-xl font-extrabold text-zinc-50">
              {agentName ? agentName.charAt(0).toUpperCase() : "N"}
            </h2>
          </div>

          <h2 className="text-2xl font-bold text-zinc-50 uppercase">
            {agentName ?? "—"}
          </h2>
        </div>
      </div>

      {connectionNotice ? (
        <div className="border-b border-zinc-200 bg-amber-50 px-4 py-2 text-[11px] font-medium text-amber-900">
          {connectionNotice}
        </div>
      ) : null}

      <div className="flex h-[calc(100%-56px)] flex-col">
        <ScrollArea className="flex h-full">
          <div className="flex h-full w-full flex-col space-y-4 bg-white p-3 pb-5">
            {messages.map(m => {
              if (m.role === "thinking") {
                return (
                  <div key={m.id} className={`mb-2 flex justify-start`}>
                    <div className={`rounded-tl-none text-gray-800`}>
                      <div className="flex h-full items-center space-x-3">
                        <div className="flex h-full items-center space-x-2 rounded-full bg-white px-3 py-2.5">
                          <div className="mt-[1.2px] h-[3.5px] w-[3.5px] animate-ping rounded-full bg-[#00E0D3] ease-in-out [animation-delay:-0.3s]"></div>
                          <div className="mt-[0.2px] h-[4.5px] w-[4.5px] animate-ping rounded-full bg-[#00E0D3] ease-in-out [animation-delay:-0.15s]"></div>
                          <div className="h-[6.5px] w-[6.5px] animate-ping rounded-full bg-[#15CBB2] ease-in-out"></div>
                        </div>
                        <p className="text-sm">Thinking</p>
                      </div>
                    </div>
                  </div>
                )
              }

              if (m.role === "user") {
                return (
                  <p
                    key={m.id}
                    className="max-w-5/6 self-end rounded-xl bg-[#1E50EF] px-3 py-2.5 text-sm text-white"
                  >
                    {m.content}
                  </p>
                )
              }

              return (
                <div
                  key={m.id}
                  className="max-w-5/6 self-start rounded-xl bg-zinc-100 px-3 py-2.5 text-sm"
                >
                  <Markdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-xl font-bold" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-lg font-bold" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-md font-bold" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-outside list-decimal pl-8"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-outside list-disc pl-8"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li
                          className="py-0.5 first-of-type:mt-1 last-of-type:mb-1"
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="font-medium text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="my-2 border-l-4 border-gray-300 pl-4 italic"
                          {...props}
                        />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre
                          className="my-2 overflow-x-auto rounded-md bg-gray-800 p-2 text-white"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-sm text-zinc-950" {...props} />
                      )
                    }}
                  >
                    {m.content}
                  </Markdown>
                </div>
              )
            })}
          </div>

          <div ref={bottomRef} />
        </ScrollArea>

        <div className="mx-3 flex h-max flex-col items-center">
          <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 max-h-[100px] rounded-3xl border-2 transition-colors duration-300 ease-in-out has-[[data-slot=input-group-control]:focus-visible]:border-zinc-400 has-[[data-slot=input-group-control]:focus-visible]:ring-0">
            <InputGroupTextarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="Type your message here..."
            />

            <InputGroupAddon align="block-end">
              <div className="_justify-between flex w-full items-center justify-end">
                {/* TODO: make it "justify-between" when using. commented out since unused. */}
                {/* <InputGroupButton
                  variant="ghost"
                  className="rounded-full"
                  size="icon-xs"
                >
                  <Smile className="h-3.5 w-3.5 text-zinc-500" />
                </InputGroupButton> */}

                <InputGroupButton
                  variant="default"
                  className="rounded-full bg-[#1E50EF] hover:bg-[#1648c2] disabled:bg-zinc-400"
                  size="icon-xs"
                  type="button"
                  onClick={handleSend}
                  disabled={isSendDisabled}
                >
                  <IconArrowUp className="h-3.5 w-3.5 text-zinc-50" />
                </InputGroupButton>
              </div>
            </InputGroupAddon>
          </InputGroup>

          <div className="mt-2 flex items-center space-x-1 text-[10px] font-medium text-zinc-500">
            <p>Powered by </p>
            <Image
              src="/assets/noopy-blue-full.png"
              alt="Noopy.ai Logo"
              width={60}
              height={10}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentPreview
