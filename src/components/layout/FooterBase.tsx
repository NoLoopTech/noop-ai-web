import { languages } from "@/i18n/settings"
import Link from "next/link"

interface Props {
  t: any
  lng: string
}

export const FooterBase = ({ t, lng }: Props): JSX.Element => {
  return (
    <footer className="w-full bg-white dark:bg-black text-black dark:text-white py-4 px-6 flex justify-center items-center text-sm transition-colors duration-300">
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
                className="underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {l}
              </Link>
            </span>
          )
        })}
    </footer>
  )
}
