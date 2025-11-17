import Image from "next/image"
import TabContainer from "./partials/TabContainer"

export default function Home(): React.ReactNode {
  return (
    <main className="mx-auto flex h-screen w-full max-w-[1440px] flex-col items-center justify-start px-20 py-6">
      <div className="flex w-full justify-start">
        <Image
          src="/assets/noopy-blue-full.png"
          alt="Noopy Logo"
          width={150}
          height={33}
        />
      </div>

      <div className="flex w-full flex-col items-center justify-start space-y-3 py-6 text-center">
        <h2 className="text-2xl font-semibold text-zinc-950">
          Let’s feed your agent some knowledge!
        </h2>
        <p className="text-base text-zinc-500">
          Upload your files, paste a link, or simply type in text—your agent
          will instantly start learning from it.
        </p>
      </div>

      <TabContainer />
    </main>
  )
}
