import { Textarea } from "./ui/textarea"

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  className
}: RichTextEditorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div>
      {/* TODO: Implement rich text editing functionality. text only for now */}
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
      />
    </div>
  )
}

export default RichTextEditor
