import { IconFile } from "@tabler/icons-react"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

export default function FileDropzone({
  onFileSelected
}: {
  onFileSelected: (files: File[]) => void
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles)
      }
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "text/plain": []
    }
  })

  return (
    <div
      {...getRootProps()}
      className={`flex h-full w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors duration-300 ease-in-out ${isDragActive ? "border-zinc-400/60 bg-slate-200/40 dark:border-slate-600 dark:bg-slate-900" : "border-zinc-200 bg-zinc-50 dark:border-slate-700 dark:bg-slate-950"}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Drop the file here...
        </p>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-1">
          <IconFile className="mx-auto mb-2 h-6 w-6 stroke-1 text-zinc-700 dark:text-zinc-300" />

          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Drag and drop a file or click to browse
          </p>

          <p className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
            Supported file types: pdf, doc, docx, txt
          </p>
        </div>
      )}
    </div>
  )
}
