"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, FileText, User, Bell, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

type Appointment = {
  id: number
  status: string
  created_at: string
  service_id?: number
  services?: {
    name: string
  }
  // Make these optional since they might not exist in the database yet
  scheduled_date?: string
  scheduled_time?: string
}

export default function UserDashboard() {
  const { user, isLoading: authLoading, refreshSession } = useAuth()
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = getBrowserClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    const fetchAppointments = async () => {
      try {
        // Try to refresh the session first to ensure we have a valid token
        const isSessionValid = await refreshSession()
        if (!isSessionValid) {
          toast({
            title: "Session expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        // First, let's check what columns exist in the appointments table
        const { data: columnInfo, error: columnError } = await supabase.from("appointments").select("*").limit(1)

        if (columnError) {
          // Check if this is an auth error
          if (
            columnError.message?.includes("JWT") ||
            columnError.message?.includes("token") ||
            columnError.message?.includes("auth")
          ) {
            toast({
              title: "Authentication error",
              description: "Please log in again to continue.",
              variant: "destructive",
            })
            router.push("/login")
            return
          }
          throw columnError
        }

        // Get the column names from the first row
        const availableColumns =
          columnInfo && columnInfo.length > 0
            ? Object.keys(columnInfo[0])
            : ["id", "status", "created_at", "email", "service_id"]

        // Build a dynamic select statement based on available columns
        const selectStatement = availableColumns.join(", ")

        // Use a simpler query that doesn't rely on columns that might not exist
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from("appointments")
          .select(selectStatement)
          .eq("email", user.email)
          .in("status", ["confirmed", "pending"])
          .order("created_at", { ascending: false })
          .limit(3)

        if (appointmentsError) {
          // Check if this is an auth error
          if (
            appointmentsError.message?.includes("JWT") ||
            appointmentsError.message?.includes("token") ||
            appointmentsError.message?.includes("auth")
          ) {
            toast({
              title: "Authentication error",
              description: "Please log in again to continue.",
              variant: "destructive",
            })
            router.push("/login")
            return
          }
          throw appointmentsError
        }

        // If we need service names, fetch services separately
        if (appointmentsData && appointmentsData.length > 0) {
          // Get unique service IDs
          const serviceIds = [...new Set(appointmentsData.filter((a) => a.service_id).map((a) => a.service_id))]

          if (serviceIds.length > 0) {
            const { data: servicesData, error: servicesError } = await supabase
              .from("services")
              .select("id, name")
              .in("id", serviceIds)

            if (servicesError) throw servicesError

            // Map services to appointments
            const appointmentsWithServices = appointmentsData.map((appointment) => {
              const service = servicesData?.find((s) => s.id === appointment.service_id)
              return {
                ...appointment,
                services: service ? { name: service.name } : { name: "General Consultation" },
              }
            })

            setUpcomingAppointments(appointmentsWithServices)
          } else {
            // No service IDs, just add a default service name
            setUpcomingAppointments(
              appointmentsData.map((a) => ({
                ...a,
                services: { name: "General Consultation" },
              })),
            )
          }
        } else {
          setUpcomingAppointments([])
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [user, authLoading, router, supabase, refreshSession])

  if (authLoading || (isLoading && user)) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-full max-w-2xl" />

            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user?.email?.split("@")[0]}. Manage your appointments and medical records from this
            dashboard.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Appointments</CardTitle>
                <CardDescription>View and manage your upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between border-b pb-2 last:border-0"
                      >
                        <div>
                          <p className="font-medium">{appointment.services?.name}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.scheduled_date && appointment.scheduled_time
                              ? `${appointment.scheduled_date} at ${appointment.scheduled_time}`
                              : `Requested on ${format(new Date(appointment.created_at), "MMM d, yyyy")}`}
                          </p>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No upcoming appointments</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/appointments">View All Appointments</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Medical Records</CardTitle>
                <CardDescription>Access your medical history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 border-b pb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Recent Lab Results</p>
                      <p className="text-sm text-gray-500">View your latest test results</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b pb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Visit History</p>
                      <p className="text-sm text-gray-500">View your past appointments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Medication Reminders</p>
                      <p className="text-sm text-gray-500">Set up medication alerts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/records">View Medical Records</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 border-b pb-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Personal Information</p>
                      <p className="text-sm text-gray-500">Update your contact details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b pb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Medical Information</p>
                      <p className="text-sm text-gray-500">Update allergies and conditions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Notification Preferences</p>
                      <p className="text-sm text-gray-500">Manage your alerts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/profile">Update Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href="/contact">
                      Book New Appointment <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href="/dashboard/appointments">
                      View Upcoming Appointments <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href="/dashboard/records">
                      Access Medical Records <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    If you need assistance with your patient portal or have questions about your care, our support team
                    is here to help.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Phone Support</p>
                      <p className="text-sm text-gray-500">(555) 123-4567</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email Support</p>
                      <p className="text-sm text-gray-500">support@medicarehealth.com</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Hours</p>
                      <p className="text-sm text-gray-500">Mon-Fri: 8am-6pm</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Emergency</p>
                      <p className="text-sm text-gray-500">Call 911 or visit ER</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
