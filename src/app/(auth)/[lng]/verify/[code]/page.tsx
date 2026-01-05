import VerifyEmail from "./partial/VerifyEmail"

const page = async ({ params }: { params: { code: string } }) => {
  const code = await params.code

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <VerifyEmail code={code} />
    </div>
  )
}

export default page
