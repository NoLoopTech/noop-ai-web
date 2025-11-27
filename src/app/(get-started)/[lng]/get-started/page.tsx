import MainContainer from "./partials/MainContainer"

export default function Home(): React.ReactNode {
  return (
    <main className="mx-auto flex h-screen w-full max-w-[1440px] flex-col items-center justify-start px-20">
      <MainContainer />
    </main>
  )
}
