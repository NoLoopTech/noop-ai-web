"use client"

// import Logo from "@/../public/assets/navbar-logo.png"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/theme-toggle"
// import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
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
    <header
      className="
      absolute inset-x-0 top-0 z-50
      px-6 py-0
      md:px-16 md:py-10
      xl:px-28 xl:py-10
      w-screen
    "
    >
      <nav className="flex items-center justify-between" aria-label="Global">
        <div className="flex-grow lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">NoLoopTech</span>
            {/* <Image
              src={Logo}
              className="h-14 xl:h-24 w-auto"
              alt="No Loop Tech logo"
              width={96}
              height={96}
            /> */}
            <NltLogo className="w-52 md:w-64 fill-black dark:fill-white" />
          </a>
        </div>
        <div className="flex md:hidden items-center gap-3">
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
        <div
          className="
          hidden md:flex
          gap-x-4 md:gap-x-4 xl:gap-x-12
          items-center
        "
        >
          {navigation.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className="
              text-balck dark:text-gray-300
                text-lg
                font-normal
                hover:text-gray-500 dark:hover:text-white
                transition-colors
              "
            >
              {item.name}
            </Link>
          ))}
          {session && (
            <Link
              href="/admin"
              className="
              text-balck dark:text-gray-300
                text-lg
                font-normal
                hover:text-gray-500 dark:hover:text-white
                transition-colors
              "
            >
              Dashboard
            </Link>
          )}
          <a
            href="/contact"
            className="
              text-lg
              font-medium
              leading-normal
              text-balck dark:text-gray-300
              py-2 px-4
              rounded-full
              border-[1px] border-white dark:border-gray-300
              hover:bg-white hover:text-black dark:hover:bg-gray-300 dark:hover:text-black
              hover:no-underline
              transition-all
            "
          >
            Get In Touch
          </a>
          {session ? (
            <button
              onClick={handleLogout}
              className="
              text-lg
              font-medium
              leading-normal
              text-balck dark:text-gray-300
              py-2 px-4
              rounded-full
              border-[1px] border-black dark:border-gray-300
              bg-primary/0 dark:bg-primary/0
              hover:bg-primary hover:text-white dark:hover:bg-primary/40 dark:hover:text-white
              transition-all
            "
            >
              Logout
            </button>
          ) : (
            <Link href="/en/login">
              <button
                className="
              text-lg
              font-medium
              leading-normal
              text-balck dark:text-gray-300
              py-2 px-4
              rounded-full
              border-[1px] border-black dark:border-gray-300
              bg-primary/0 dark:bg-primary/0
              hover:bg-primary hover:text-white dark:hover:bg-primary/40 dark:hover:text-white
              transition-all
            "
              >
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
          className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black dark:bg-zinc-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
          hideCloseButton
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
              className="-m-2.5 rounded-md py-2.5 px-0 text-white dark:text-gray-300"
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
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors duration-500 ease-in-out"
                    onClick={handleMobileMenuToggle}
                  >
                    {item.name}
                  </Link>
                ))}
                {session && (
                  <Link
                    href="/admin"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors duration-500 ease-in-out"
                    onClick={handleMobileMenuToggle}
                  >
                    Dashboard
                  </Link>
                )}
                {session ? (
                  <div
                    onClick={handleLogout}
                    className="-mx-3 block text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 cursor-pointer bg-primary/5 text-white dark:text-gray-100 hover:bg-primary/30 dark:hover:bg-primary/10 transition-colors duration-500 ease-in-out"
                  >
                    Logout
                  </div>
                ) : (
                  <Link
                    href="/en/login"
                    onClick={handleMobileMenuToggle}
                    className="-mx-3 block text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 cursor-pointer bg-primary/5 text-white dark:text-gray-100 hover:bg-primary/30 dark:hover:bg-primary/10 transition-colors duration-500 ease-in-out"
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
