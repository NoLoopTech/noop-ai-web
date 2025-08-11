"use client"

// import Logo from "@/../public/assets/navbar-logo.png"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/theme-toggle"
// import Image from "next/image"
import Link from "next/link"
import { JSX, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import NltLogo from "@/../public/assets/nlt-logo.svg"
import MobileMenuIcon from "@/../public/assets/icons/mobile-menu-icon.svg"

export default function NavBase(): JSX.Element {
  const { data: session } = useSession()
  const navigation = [
    { name: "Services", href: "/services" },
    { name: "Work", href: "/work" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "#" }
  ]

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = (): void => {
    setMobileMenuOpen(false)
    void signOut({ callbackUrl: "/en/login" })
  }

  const handleMobileMenuToggle = (): void => {
    setMobileMenuOpen(prev => !prev)
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50 w-screen px-6 py-0 md:px-16 md:py-10 xl:px-28 xl:py-10">
      <nav className="flex items-center justify-between" aria-label="Global">
        <div className="flex-grow lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">NoLoopTech</span>
            {/* <Image
              src={Logo}
              className="h-14 xl:h-24 w-auto"
              alt="No Loop Tech logo"
              width={96}
              height={96}
            /> */}
            <NltLogo className="w-52 fill-black md:w-64 dark:fill-white" />
          </Link>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          {/* Add theme toggle for mobile */}
          <ThemeToggle />
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white dark:text-gray-300"
            onClick={handleMobileMenuToggle}
          >
            <span className="sr-only">Open main menu</span>
            <MobileMenuIcon className="h-6 w-6 fill-black dark:fill-white" />
          </button>
        </div>
        <div className="hidden items-center gap-x-4 md:flex md:gap-x-4 xl:gap-x-12">
          {navigation.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className="text-balck text-lg font-normal transition-colors hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
            >
              {item.name}
            </Link>
          ))}
          {session && (
            <Link
              href="/admin"
              className="text-balck text-lg font-normal transition-colors hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/contact"
            className="text-balck rounded-full border-[1px] border-white px-4 py-2 text-lg leading-normal font-medium transition-all hover:bg-white hover:text-black hover:no-underline dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-black"
          >
            Get In Touch
          </Link>
          {session ? (
            <button
              onClick={handleLogout}
              className="text-balck bg-primary/0 dark:bg-primary/0 hover:bg-primary dark:hover:bg-primary/40 rounded-full border-[1px] border-black px-4 py-2 text-lg leading-normal font-medium transition-all hover:text-white dark:border-gray-300 dark:text-gray-300 dark:hover:text-white"
            >
              Logout
            </button>
          ) : (
            <Link href="/en/login">
              <button className="text-balck bg-primary/0 dark:bg-primary/0 hover:bg-primary dark:hover:bg-primary/40 rounded-full border-[1px] border-black px-4 py-2 text-lg leading-normal font-medium transition-all hover:text-white dark:border-gray-300 dark:text-gray-300 dark:hover:text-white">
                Admin Login
              </button>
            </Link>
          )}
          {/* Add theme toggle for desktop */}
          <ThemeToggle />
        </div>
      </nav>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="right"
          className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5"
              onClick={handleMobileMenuToggle}
            >
              <span className="sr-only">Your Company</span>
              {/* <Image
                src={Logo}
                className="h-8 w-auto"
                alt="No Loop Tech logo"
                width={32}
                height={32}
              /> */}
              <NltLogo className="w-48 fill-white" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md px-0 py-2.5 text-white dark:text-gray-300"
              onClick={handleMobileMenuToggle}
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="h-6 w-6 rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4V20M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base leading-7 font-semibold text-white transition-colors duration-500 ease-in-out hover:bg-white/20 dark:text-gray-300 dark:hover:bg-gray-700/50"
                    onClick={handleMobileMenuToggle}
                  >
                    {item.name}
                  </Link>
                ))}
                {session && (
                  <Link
                    href="/admin"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base leading-7 font-semibold text-white transition-colors duration-500 ease-in-out hover:bg-white/20 dark:text-gray-300 dark:hover:bg-gray-700/50"
                    onClick={handleMobileMenuToggle}
                  >
                    Dashboard
                  </Link>
                )}
                {session ? (
                  <div
                    onClick={handleLogout}
                    className="bg-primary/5 hover:bg-primary/30 dark:hover:bg-primary/10 -mx-3 block cursor-pointer rounded-lg px-3 py-2 text-left text-base leading-7 font-semibold text-white transition-colors duration-500 ease-in-out dark:text-gray-100"
                  >
                    Logout
                  </div>
                ) : (
                  <Link
                    href="/en/login"
                    onClick={handleMobileMenuToggle}
                    className="bg-primary/5 hover:bg-primary/30 dark:hover:bg-primary/10 -mx-3 block cursor-pointer rounded-lg px-3 py-2 text-left text-base leading-7 font-semibold text-white transition-colors duration-500 ease-in-out dark:text-gray-100"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
