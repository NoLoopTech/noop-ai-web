import { toast } from "@/lib/hooks/useToast"

export function nofitySubmittedValues(values: object) {
  toast({
    title: "You submitted the following values:",
    description: (
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      </pre>
    )
  })
}
