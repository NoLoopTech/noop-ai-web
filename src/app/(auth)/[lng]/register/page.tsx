import MainContainer from "./partials/MainContainer"

const page = ({ params }: { params: { lng: string } }) => {
  return <MainContainer lng={params.lng} />
}

export default page
