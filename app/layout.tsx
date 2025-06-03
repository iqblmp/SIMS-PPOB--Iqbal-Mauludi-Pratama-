"use client"

import "@/styles/globals.css"
import { fontSans } from "@/libs/fonts"
import { cn } from "@/libs/utils"
import { store } from "@/redux/store"
import { Provider } from "react-redux"

import { TailwindIndicator } from "@/components/tailwind-indicator"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="shortcut icon" href="/Logo.png" />
        </head>

        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Provider store={store}>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
            </div>
            <TailwindIndicator />
          </Provider>
        </body>
      </html>
    </>
  )
}
