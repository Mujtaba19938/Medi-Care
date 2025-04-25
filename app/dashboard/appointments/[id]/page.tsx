"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Calendar, FileText, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
    description: string
  }
  doctor_id?: number
  doctors?: {
    name: string
    role: string
    bio: string
  }
  notes?: string
  location?: string
}

export default function AppointmentDetails({ params }: { params: { id: string } }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
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

    const fetchAppointment = async () => {
      try {
        // First, fetch the appointment
        const { data: appointmentData, error: appointmentError } = await supabase
          .from("appointments")
          .select(
            "id, name, email, phone, message, status, created_at, scheduled_date, scheduled_time, service_id, doctor_id, notes, location",
          )
          .eq("id", params.id)
          .eq("email", user.email)
          .single()

        if (appointmentError) throw appointmentError

        if (!appointmentData) {
          toast({
            title: "Appointment not found",
            description: "The appointment you're looking for doesn't exist or you don't have permission to view it.",
            variant: "destructive",
          })
          router.push("/dashboard/appointments")
          return
        }

        // Fetch service if needed
        let serviceData = null
        if (appointmentData.service_id) {
          const { data, error } = await supabase
            .from("services")
            .select("name, description")
            .eq("id", appointmentData.service_id)
            .single()

          if (error) {
            console.error("Error fetching service:", error)
          } else {
            serviceData = data
          }
        }

        // Fetch doctor if needed
        let doctorData = null
        if (appointmentData.doctor_id) {
          const { data, error } = await supabase
            .from("doctors")
            .select("name, role, bio")
            .eq("id", appointmentData.doctor_id)
            .single()

          if (error) {
            console.error("Error fetching doctor:", error)
          } else {
            doctorData = data
          }
        }

        // Combine the data
        const appointmentWithRelations = {
          ...appointmentData,
          services: serviceData || { name: "General Consultation", description: "General medical consultation" },
          doctors: doctorData,
        }

        setAppointment(appointmentWithRelations)
      } catch (error) {
        console.error("Error fetching appointment:", error)
        toast({
          title: "Error",
          description: "Failed to load appointment details. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard/appointments")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointment()
  }, [user, router, supabase, toast, params.id])

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button asChild variant="ghost" className="mr-4">
            <Link href="/dashboard/appointments">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!appointment) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button asChild variant="ghost" className="mr-4">
          <Link href="/dashboard/appointments">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Appointment Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{appointment.services?.name || "General Consultation"}</CardTitle>
                  <CardDescription>
                    Requested on {format(new Date(appointment.created_at), "MMMM d, yyyy")}
                  </CardDescription>
                </div>
                <Badge variant="outline" className={getStatusColor(appointment.status)}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {appointment.scheduled_date && (
                <div>
                  <h3 className="font-medium flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    Appointment Date & Time
                  </h3>
                  <p className="text-gray-700">
                    {appointment.scheduled_date} {appointment.scheduled_time && `at ${appointment.scheduled_time}`}
                  </p>
                </div>
              )}

              {appointment.location && (
                <div>
                  <h3 className="font-medium flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    Location
                  </h3>
                  <p className="text-gray-700">{appointment.location}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium flex items-center mb-2">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Service Details
                </h3>
                <p className="text-gray-700">{appointment.services?.description || "No description available."}</p>
              </div>

              <div>
                <h3 className="font-medium flex items-center mb-2">
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  Your Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-700">{appointment.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-700">{appointment.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-700">{appointment.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Your Message</h3>
                <p className="text-gray-700">{appointment.message}</p>
              </div>

              {appointment.notes && (
                <div>
                  <h3 className="font-medium mb-2">Additional Notes</h3>
                  <p className="text-gray-700">{appointment.notes}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {(appointment.status === "pending" || appointment.status === "confirmed") && (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from("appointments")
                        .update({ status: "cancelled" })
                        .eq("id", appointment.id)

                      if (error) throw error

                      setAppointment({ ...appointment, status: "cancelled" })

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
                  }}
                >
                  Cancel Appointment
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {appointment.doctors && (
            <Card>
              <CardHeader>
                <CardTitle>Your Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium">{appointment.doctors.name}</h3>
                <p className="text-sm text-blue-600">{appointment.doctors.role}</p>
                <p className="text-sm text-gray-500 mt-2">{appointment.doctors.bio}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                If you need to reschedule or have questions about your appointment, please contact us.
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> (555) 123-4567
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> appointments@medicarehealth.com
                </p>
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
  )
}
