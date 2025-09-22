import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import "bootstrap/dist/css/bootstrap.min.css"
import { Suspense } from "react"

const theme = createTheme({
  palette: {
    primary: {
      main: "#4A90A4",
    },
    secondary: {
      main: "#8FBC8F",
    },
    background: {
      default: "#B8D4D6",
    },
  },
  typography: {
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
  },
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
