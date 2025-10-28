import { InputWithLength } from "./InputWithLength"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder
}: RichTextEditorProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    onChange?.(e.target.value)
  }

  return (
    <div className="bg-transparent">
      {/* TODO: Implement rich text editing functionality. text only for now */}
      <InputWithLength
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        type="textarea"
        maxLength={50}
        showMaxLength={true}
        rows={2}
      />
    </div>
  )
}

export default RichTextEditor
