"use client"

import ErrorPage from "@/components/layout/ErrorPage"
import NavBase from "@/components/layout/NavBase"
import React, { JSX } from "react"

// interface Error {
//   error: Error
// }

const errorPage = (): JSX.Element => {
  // console.log("Error: ", error)

  return (
    <div>
      <NavBase />
      <ErrorPage />
    </div>
  )
}

export default errorPage
