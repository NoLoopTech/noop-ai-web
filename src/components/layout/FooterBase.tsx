import { languages } from "@/i18n/settings"
import Link from "next/link"
import { JSX } from "react"

interface Props {
  // t: any
  lng: string
}

export const FooterBase = ({ lng }: Props): JSX.Element => {
  return (
    <footer className="flex w-full items-center justify-center bg-white px-6 py-4 text-sm text-black transition-colors duration-300 dark:bg-black dark:text-white">
      {languages
        .filter(l => lng !== l)
        .map((l, index) => {
          return (
            <span key={l}>
              Change language to&nbsp;
              {index > 0 && " or "}
              <Link
                href={`/${l}/`}
                prefetch={false}
                className="underline transition-colors hover:text-gray-700 dark:hover:text-gray-300"
              >
                {l}
              </Link>
            </span>
          )
        })}
    </footer>
  )
}
