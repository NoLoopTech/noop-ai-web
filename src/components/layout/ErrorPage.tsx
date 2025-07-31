import Image from "next/image"
import React, { JSX } from "react"
import Link from "next/link"

const ErrorPage = (): JSX.Element => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-y-7 px-5">
      <Image
        width={200}
        height={200}
        alt="Error Icon"
        src={"/assets/background/error-page-icon.png"}
      />
      <p className="text-center text-xl font-medium text-[#64748B]">
        Looks like something went wrong, please return to home page
      </p>
      <Link
        href={"/"}
        className="rounded-lg bg-[#060606] px-8 py-4 text-center text-lg/6 font-bold text-white hover:bg-[#060606]/80"
      >
        Home Page
      </Link>
    </div>
  )
}

export default ErrorPage
