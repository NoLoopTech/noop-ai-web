import Image from "next/image"
import React from "react"
import Link from "next/link"

const ErrorPage = (): JSX.Element => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center px-5 gap-y-7">
      <Image
        width={200}
        height={200}
        alt="Error Icon"
        src={"/assets/background/error-page-icon.png"}
      />
      <p className="font-medium text-xl text-center text-[#64748B]">
        Looks like something went wrong, please return to home page
      </p>
      <Link
        href={"/"}
        className="py-4 px-8 rounded-lg bg-[#060606] hover:bg-[#060606]/80 font-bold text-lg/6 text-center text-white"
      >
        Home Page
      </Link>
    </div>
  )
}

export default ErrorPage
