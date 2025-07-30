"use client"

import ErrorPage from "@/components/layout/ErrorPage"
import NavBase from "@/components/layout/NavBase"
import { JSX } from "react"

const errorPage = ({ error }: { error: Error }): JSX.Element => {
  console.log("Error: ", error)

  return (
    <div>
      <NavBase />
      <ErrorPage />
    </div>
  )
}

export default errorPage
