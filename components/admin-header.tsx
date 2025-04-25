"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HeartPulse, LogOut, LayoutDashboard, Calendar, Users, ClipboardList } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function AdminHeader() {
  const { signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    router.push("/admin/login")
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
    { href: "/admin/doctors", label: "Doctors", icon: Users },
    { href: "/admin/services", label: "Services", icon: ClipboardList },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">MediCare Admin</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600",
                  pathname === item.href ? "text-blue-600" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/" target="_blank">
              View Website
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
