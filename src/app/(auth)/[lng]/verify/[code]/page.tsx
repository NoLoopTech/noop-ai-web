import VerifyEmail from "./partial/VerifyEmail"

const page = async ({ params }: { params: Promise<{ code: string }> }) => {
  const { code } = await params

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <VerifyEmail code={code} />
    </div>
  )
}

export default page
