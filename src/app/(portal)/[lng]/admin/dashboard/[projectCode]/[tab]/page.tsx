import { Header } from "@/components/layout/Header"
import TabRouter from "./components/TabRouter"

type Props = {
  params: Promise<{ tab?: string }>
}

export default async function Dashboard1Page({ params }: Props) {
  const resolvedParams = await params
  const tab = resolvedParams?.tab === "analytics" ? "analytics" : "overview"

  return (
    <>
      <Header />

      <div className="space-y-4 p-4">
        {/* <div className="mb-2 flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Dashboard1Actions />
        </div> */}

        <TabRouter defaultTab={tab} />
      </div>
    </>
  )
}
