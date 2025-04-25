"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"
import AdminHeader from "@/components/admin-header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, userRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && (!user || userRole !== "admin") && pathname !== "/admin/login") {
      router.push("/login?type=admin")
    }
  }, [user, isLoading, router, pathname, userRole])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user && pathname !== "/admin/login") {
    return null
  }

  // Only render the AdminHeader, not the regular Header
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
