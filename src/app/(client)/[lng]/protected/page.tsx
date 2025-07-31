import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/nextAuthOptions"
import { JSX } from "react"

export default async function Protected(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions)

  return (
    <div className="grid grid-cols-2 p-4 text-white">
      <div>
        <h1 className="text-accent text-[15rem] leading-loose font-extrabold">
          Hi {session?.user.fullname}!
        </h1>
      </div>
      <div>
        <p>Protected page</p>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  )
}
