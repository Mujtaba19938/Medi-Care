"use client"

import { useState, useEffect } from "react"
import AdminHeader from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBrowserClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { AppointmentList } from "@/components/appointment-list"

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getBrowserClient()

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("*, profiles(full_name, email, phone)")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setAppointments(data || [])
      } catch (error) {
        console.error("Error fetching appointments:", error)
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [supabase, toast])

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-gray-500">Manage patient appointments for your medical practice.</p>

            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>View and manage all patient appointments.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No appointments found.</p>
                  </div>
                ) : (
                  <AppointmentList appointments={appointments} isAdmin={true} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
