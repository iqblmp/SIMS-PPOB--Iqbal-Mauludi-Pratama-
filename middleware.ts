import { NextResponse, type NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  //get token
  const token = req.cookies.get("token")
  const currentPath = req.nextUrl.pathname

  //protected pages
  const protectedPages = ["/topup", "/transaction", "/akun"]
  const loginPage = "/login"
  const homePage = "/"

  //jika tidak ada token dan mencoba mengakses protected pages
  if (!token && protectedPages.includes(currentPath)) {
    return NextResponse.redirect(new URL(loginPage, req.url))
  }

  //jika ada token dan mencoba halaman login
  if (token && currentPath === loginPage) {
    return NextResponse.redirect(new URL(homePage, req.url))
  }

  //jika tidak ada masalah
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/topup", "/transaction", "/akun", "/login"],
}
