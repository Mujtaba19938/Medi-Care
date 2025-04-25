"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ClipboardList, Users } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DoctorDashboard() {
  const { user, userRole, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || userRole !== "doctor")) {
      router.push("/login?type=doctor")
    }
  }, [user, userRole, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || userRole !== "doctor") {
    return null
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, Dr. {user?.email?.split("@")[0]}. Manage your patients and appointments from this dashboard.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Appointments</CardTitle>
                <CardDescription>View and manage your upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <Button asChild>
                    <Link href="/doctor/appointments">View All</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Patients</CardTitle>
                <CardDescription>Manage your patient records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <Button asChild>
                    <Link href="/doctor/patients">View All</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Schedule</CardTitle>
                <CardDescription>Manage your availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <ClipboardList className="h-8 w-8 text-blue-600" />
                  <Button asChild>
                    <Link href="/doctor/schedule">View All</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
