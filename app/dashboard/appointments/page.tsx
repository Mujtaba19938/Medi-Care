"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

type Appointment = {
  id: number
  name: string
  email: string
  phone: string
  message: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  created_at: string
  scheduled_date?: string
  scheduled_time?: string
  service_id: number
  services: {
    name: string
  }
  doctor_id?: number
  doctors?: {
    name: string
    role: string
  }
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = getBrowserClient()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchAppointments = async () => {
      try {
        // First, fetch appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from("appointments")
          .select(
            "id, name, email, phone, message, status, created_at, scheduled_date, scheduled_time, service_id, doctor_id",
          )
          .eq("email", user.email)
          .order("created_at", { ascending: false })

        if (appointmentsError) throw appointmentsError

        // If we have appointments with service_ids, fetch the services
        if (appointmentsData && appointmentsData.length > 0) {
          // Get unique service IDs
          const serviceIds = [...new Set(appointmentsData.filter((a) => a.service_id).map((a) => a.service_id))]

          // Get unique doctor IDs
          const doctorIds = [...new Set(appointmentsData.filter((a) => a.doctor_id).map((a) => a.doctor_id))]

          // Fetch services if needed
          let servicesData = []
          if (serviceIds.length > 0) {
            const { data, error } = await supabase.from("services").select("id, name").in("id", serviceIds)

            if (error) throw error
            servicesData = data || []
          }

          // Fetch doctors if needed
          let doctorsData = []
          if (doctorIds.length > 0) {
            const { data, error } = await supabase.from("doctors").select("id, name, role").in("id", doctorIds)

            if (error) throw error
            doctorsData = data || []
          }

          // Map services and doctors to appointments
          const appointmentsWithRelations = appointmentsData.map((appointment) => {
            const service = servicesData.find((s) => s.id === appointment.service_id)
            const doctor = doctorsData.find((d) => d.id === appointment.doctor_id)

            return {
              ...appointment,
              services: service ? { name: service.name } : { name: "General Consultation" },
              doctors: doctor ? { name: doctor.name, role: doctor.role } : undefined,
            }
          })

          setAppointments(appointmentsWithRelations)
        } else {
          setAppointments([])
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
        toast({
          title: "Error",
          description: "Failed to load your appointments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [user, router, supabase, toast])

  const cancelAppointment = async (id: number) => {
    try {
      const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id)

      if (error) throw error

      setAppointments(
        appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status: "cancelled" } : appointment,
        ),
      )

      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled successfully.",
      })
    } catch (error: any) {
      console.error("Error cancelling appointment:", error)
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterAppointments = (status: string) => {
    if (status === "all") return appointments
    return appointments.filter((appointment) => appointment.status === status)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        {["all", "confirmed", "pending", "cancelled"].map((status) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <CardTitle>{status.charAt(0).toUpperCase() + status.slice(1)} Appointments</CardTitle>
                <CardDescription>
                  {status === "all" ? "View all your appointments" : `View your ${status} appointments`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filterAppointments(status).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No {status === "all" ? "" : status} appointments found.</p>
                    <Button asChild className="mt-4">
                      <Link href="/contact">Book an Appointment</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filterAppointments(status).map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                          <div>
                            <h3 className="font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                              {appointment.services?.name || "General Consultation"}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Requested on {format(new Date(appointment.created_at), "MMM d, yyyy")}
                            </p>
                            {appointment.scheduled_date && (
                              <p className="text-sm flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                Scheduled for {appointment.scheduled_date}{" "}
                                {appointment.scheduled_time && `at ${appointment.scheduled_time}`}
                              </p>
                            )}
                            {appointment.doctors && (
                              <p className="text-sm mt-1">
                                Doctor: {appointment.doctors.name} ({appointment.doctors.role})
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-2">
                            <Badge variant="outline" className={getStatusColor(appointment.status)}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                            {appointment.status === "pending" || appointment.status === "confirmed" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => cancelAppointment(appointment.id)}
                              >
                                Cancel
                              </Button>
                            ) : null}
                            {appointment.status === "confirmed" && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/appointments/${appointment.id}`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Details
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/contact">Book New Appointment</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
