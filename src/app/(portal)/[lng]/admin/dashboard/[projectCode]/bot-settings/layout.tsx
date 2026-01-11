import { Header } from "@/components/layout/Header"

interface Props {
  children: React.ReactNode
}

export default async function BotSettingsLayout({ children }: Props) {
  return (
    <main>
      <Header />

      {children}
    </main>
  )
}
