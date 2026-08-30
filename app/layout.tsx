import type { Metadata } from "next"
import { Geist } from "next/font/google"

import { SiteHeader } from "@/components/shared/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Marcy Space",
  description: "A personal blog by Marcy.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
              {children}
            </main>
            <footer className="border-t">
              <div className="mx-auto w-full max-w-5xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
                © {new Date().getFullYear()} Marcy Space
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
