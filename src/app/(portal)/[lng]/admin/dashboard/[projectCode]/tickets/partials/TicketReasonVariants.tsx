import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconFileText, IconDownload } from "@tabler/icons-react"
import { Ticket } from "@/models/ticket/schema"

interface Props {
  ticket: Ticket
  onViewTranscript?: () => void
}

// Reusable sub components
function ConversationSummary({ content }: { content?: string }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <h2>Conversation Summary</h2>
      <div className="flex items-center space-x-3 rounded-md border border-zinc-300 p-4 text-zinc-500 dark:border-zinc-800">
        {content ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{content}</p>
        ) : (
          <span className="text-muted-foreground">
            No conversation summary available
          </span>
        )}
      </div>
    </div>
  )
}

function FileAttachment({ hasFile }: { hasFile: boolean }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <h2>File</h2>
      <div className="flex w-80 max-w-md items-center space-x-3 rounded-md border border-zinc-300 px-4 py-2.5 text-zinc-500 shadow dark:border-zinc-800">
        {hasFile ? (
          <div className="flex w-full items-center justify-between text-zinc-700">
            <div className="flex w-max items-center space-x-2">
              <IconFileText size={20} />
              <p className="truncate mask-ellipse text-sm">Sample.pdf</p>
            </div>
            <IconDownload size={20} />
          </div>
        ) : (
          <span className="text-muted-foreground">No attachments</span>
        )}
      </div>
    </div>
  )
}

function ViewTranscriptButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="default" onClick={onClick} className="max-w-max self-end">
      View Transcript
    </Button>
  )
}

export function TicketReasonVariants({ ticket, onViewTranscript }: Props) {
  switch (`${ticket.method}`) {
    case "automated-user-inquiry":
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              User Inquiry
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1.5">
              <h2>Ticket Subject</h2>
              <div className="flex items-center space-x-3 rounded-md border border-zinc-300 p-4 text-zinc-500 dark:border-zinc-800">
                <p>I want to talk to an agent.</p>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <h2>User Description</h2>
              <div className="flex items-center space-x-3 rounded-md border border-zinc-300 p-4 text-zinc-500 dark:border-zinc-800">
                {ticket.content ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {ticket.content}
                  </p>
                ) : (
                  <span className="text-muted-foreground">
                    No user description available
                  </span>
                )}
              </div>
            </div>
            <FileAttachment hasFile={!!ticket.content} />
            <ViewTranscriptButton onClick={onViewTranscript} />
          </CardContent>
        </Card>
      )
    case "automated-low-confidence-response":
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Low Confidence Response
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1.5">
              <h2>Chat Intent</h2>
              <div className="flex items-center space-x-3 rounded-md border border-zinc-300 p-4 text-zinc-500 dark:border-zinc-800">
                <p>Pricing Inquiry</p>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <h2>Pricing Inquiry</h2>
              <div className="flex items-center space-x-3 rounded-md border border-zinc-300 p-4 text-zinc-500 dark:border-zinc-800">
                <p>Do we have an installment option for the Pro Plan?</p>
              </div>
            </div>
            <ConversationSummary content={ticket.content} />
            <FileAttachment hasFile={!!ticket.content} />
            <ViewTranscriptButton onClick={onViewTranscript} />
          </CardContent>
        </Card>
      )
    case "automated-negative-sentiment-detected":
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Negative Sentiment Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1.5">
              <h2>Chat Intent</h2>
              <div className="flex items-center space-x-3 rounded-md border border-zinc-300 p-4 text-zinc-500 dark:border-zinc-800">
                <p>Pricing Inquiry</p>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <h2>User Response</h2>
              <div className="flex items-center space-x-3 rounded-md border border-zinc-300 p-4 text-zinc-500 dark:border-zinc-800">
                <p>
                  That&apos;s ridiculous. I cancelled it right away. This is not
                  okay.
                </p>
              </div>
            </div>
            <ConversationSummary content={ticket.content} />
            <FileAttachment hasFile={!!ticket.content} />
            <ViewTranscriptButton onClick={onViewTranscript} />
          </CardContent>
        </Card>
      )
    case "manual":
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Manual Support Ticket Submission
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1.5">
              <h2>User Raised Message</h2>
              <div className="flex items-center space-x-3 rounded-md border border-zinc-300 p-4 text-zinc-500 dark:border-zinc-800">
                <p>I want to talk to an agent.</p>
              </div>
            </div>
            <ConversationSummary content={ticket.content} />
            <FileAttachment hasFile={!!ticket.content} />
            <ViewTranscriptButton onClick={onViewTranscript} />
          </CardContent>
        </Card>
      )

    default:
      return null
  }
}
