import React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
//components
import { Menu, Package2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Navigation = () => {
  //hooks
  const pathname = usePathname()

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-8 z-50">
      <nav className="hidden flex-row gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/" className="flex flex-row items-center gap-2 ">
          <Image src="/Logo.png" alt="logo" width={32} height={32} />
          <div
            style={{ flex: "none" }}
            className="text-foreground transition-colors hover:text-foreground "
          >
            SIMS PPOB
          </div>
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="flex flex-row items-center gap-2 ">
              <Image src="/Logo.png" alt="logo" width={32} height={32} />
              <div
                style={{ flex: "none" }}
                className="text-foreground transition-colors hover:text-foreground "
              >
                SIMS PPOB
              </div>
            </Link>
            <Link
              href="/topup"
              className={`${
                pathname === "/topup" ? "text-destructive" : ""
              } transition-colors `}
            >
              TopUp
            </Link>
            <Link
              href="/transaction"
              className={`${
                pathname === "/transaction" ? "text-destructive" : ""
              } transition-colors `}
            >
              Transaction
            </Link>
            <Link
              href="/akun"
              className={`${
                pathname === "/akun" ? "text-destructive" : ""
              } transition-colors `}
            >
              Akun
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <div className="relative flex gap-x-5  font-semibold text-sm">
            <Link
              href="/topup"
              className={`${
                pathname === "/topup" ? "text-destructive" : ""
              } transition-colors `}
            >
              TopUp
            </Link>
            <Link
              href="/transaction"
              className={`${
                pathname === "/transaction" ? "text-destructive" : ""
              } transition-colors `}
            >
              Transaction
            </Link>
            <Link
              href="/akun"
              className={`${
                pathname === "/akun" ? "text-destructive" : ""
              } transition-colors `}
            >
              Akun
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navigation
