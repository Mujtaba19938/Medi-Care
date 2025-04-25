"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ClipboardList, Users } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {user?.email}. Manage your medical practice from this dashboard.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Appointments</CardTitle>
                  <CardDescription>Manage patient appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <Button asChild>
                      <Link href="/admin/appointments">View All</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Doctors</CardTitle>
                  <CardDescription>Manage doctor profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <Button asChild>
                      <Link href="/admin/doctors">View All</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Services</CardTitle>
                  <CardDescription>Manage medical services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <ClipboardList className="h-8 w-8 text-blue-600" />
                    <Button asChild>
                      <Link href="/admin/services">View All</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
