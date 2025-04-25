"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import AdminHeader from "@/components/admin-header"
import { Loader2 } from "lucide-react"

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, userRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && (!user || userRole !== "doctor")) {
      router.push("/login?type=doctor")
    }
  }, [user, isLoading, router, pathname, userRole])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
