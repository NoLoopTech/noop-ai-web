import MainContainer from "./partials/MainContainer"

const page = async ({ params }: { params: Promise<{ lng: string }> }) => {
  const { lng } = await params
  return <MainContainer lng={lng} />
}

export default page
