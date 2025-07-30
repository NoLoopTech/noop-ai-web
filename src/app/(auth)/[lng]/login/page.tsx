import { JSX } from "react"
import LoginForm from "./partials/LoginForm"

export default function Page(): JSX.Element {
  return (
    <div className="h-screen w-screen bg-[url(/assets/images/login-bg.jpg)] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-x-0 h-full bg-linear-to-r bg-gradient-to-r from-zinc-950 via-stone-900/75 to-transparent">
        <div className="mx-auto flex h-full w-full max-w-[1336px] items-center pt-28 lg:pt-0">
          {/* Left Side: Hero Text */}
          <div className="hidden flex-col justify-center gap-y-5 text-white lg:flex lg:w-4/6">
            <h1 className="text-5xl font-bold">
              Unlock AI-Powered Conversations
            </h1>
            <p className="text-2xl/7 font-normal">
              Build, deploy, and manage intelligent AI bots <br /> to automate
              tasks and enhance user engagement.
            </p>
          </div>

          {/* Right Side: Login Form */}
          <div className="flex w-full px-5 lg:w-2/6 lg:px-0">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
