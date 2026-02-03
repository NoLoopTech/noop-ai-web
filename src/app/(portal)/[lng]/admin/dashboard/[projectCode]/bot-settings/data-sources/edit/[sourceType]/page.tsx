import EditorPage from "./partials/EditorPage"

const EditPage = async ({
  params
}: {
  params: Promise<{ sourceType: string }>
}) => {
  const { sourceType } = await params

  return (
    <section>
      <EditorPage sourceType={sourceType} />
    </section>
  )
}

export default EditPage
