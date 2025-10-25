import { Header } from "@/components/layout/Header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"

interface Props {
  children: React.ReactNode
}

export default function LeadsLayout({ children }: Props) {
  return (
    <>
      <Header />

      <TooltipProvider>
        <main id="main-content" className="flex min-h-min flex-col p-4">
          {children}
        </main>
        <Toaster />
      </TooltipProvider>
    </>
  )
}
