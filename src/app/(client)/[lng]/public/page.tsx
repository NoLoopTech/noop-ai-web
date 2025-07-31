import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/nextAuthOptions"
import { JSX } from "react"
import Link from "next/link"

export default async function Protected(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions)

  return (
    <div className="grid grid-cols-2 p-4 text-white">
      <div>
        {session !== null ? (
          <h1 className="text-accent text-[15rem] leading-loose font-extrabold">
            Hi {session?.user.fullname}!
          </h1>
        ) : (
          <Link className="btn btn-primary" href="/api/auth/signin">
            Sign in
          </Link>
        )}
      </div>
    </div>
  )
}
