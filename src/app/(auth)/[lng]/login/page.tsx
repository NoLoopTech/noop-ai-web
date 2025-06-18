import LoginForm from "./partials/LoginForm"

export default function Page(): JSX.Element {
  return (
    <div className="w-screen h-screen bg-[url(/assets/images/login-bg.jpg)] bg-no-repeat bg-cover bg-center">
      <div className="absolute inset-x-0 h-full bg-gradient-to-r bg-linear-to-r from-zinc-950 via-stone-900/75 to-transparent">
        <div className="w-full h-full max-w-[1336px] mx-auto flex items-center pt-28 lg:pt-0">
          {/* Left Side: Hero Text */}
          <div className="hidden lg:w-4/6 lg:flex flex-col text-white justify-center gap-y-5">
            <h1 className="font-bold text-5xl">
              Unlock AI-Powered Conversations
            </h1>
            <p className="font-normal text-2xl/7">
              Build, deploy, and manage intelligent AI bots <br /> to automate
              tasks and enhance user engagement.
            </p>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full lg:w-2/6 flex px-5 lg:px-0">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
