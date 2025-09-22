"use client"
import { RouterProvider } from "react-router-dom"
import { router } from "../src/routes/routes"

export default function Home() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  )
}
