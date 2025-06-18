const Page = ({
  params: { section }
}: {
  params: { section: string }
}): JSX.Element => {
  return (
    <main className="w-screen h-screen flex justify-center items-center gap-5">
      <h1 className="text-3xl font-bold text-center">Profile Page</h1>
    </main>
  )
}

export default Page
