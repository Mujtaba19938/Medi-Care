import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MediCare Admin - Dashboard",
  description: "Admin dashboard for MediCare healthcare management.",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // We'll render the AdminHeader for all admin pages except login and signup
  return (
    <div className="flex flex-col min-h-screen">
      {/* AdminHeader will be rendered in individual pages that need it */}
      {children}
    </div>
  )
}
