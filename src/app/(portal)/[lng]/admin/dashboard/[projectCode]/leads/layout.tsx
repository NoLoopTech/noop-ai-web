import { Header } from "@/components/layout/Header"
import { Toaster } from "@/components/ui/toaster"

interface Props {
  children: React.ReactNode
}

export default function LeadsLayout({ children }: Props) {
  return (
    <>
      <Header />

      <main id="main-content" className="flex min-h-min flex-1 flex-col p-4">
        {children}
      </main>
      <Toaster />
    </>
  )
}
