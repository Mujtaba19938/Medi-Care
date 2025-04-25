"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

type Appointment = {
  id: number
  name: string
  email: string
  phone: string
  message: string
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
  services: {
    name: string
  }
}

interface AppointmentListProps {
  appointments: Appointment[]
}

export function AppointmentList({ appointments: initialAppointments }: AppointmentListProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const supabase = createClientComponentClient()

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  async function updateStatus(id: number, status: string) {
    try {
      const { error } = await supabase.from("appointments").update({ status }).eq("id", id)

      if (error) throw error

      // Update local state
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status: status as any } : appointment,
        ),
      )
    } catch (error) {
      console.error("Error updating appointment status:", error)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No appointments found
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{format(new Date(appointment.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{appointment.name}</div>
                    <div className="text-sm text-muted-foreground">{appointment.email}</div>
                  </div>
                </TableCell>
                <TableCell>{appointment.services?.name || "N/A"}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={appointment.status}
                    onValueChange={(value) => updateStatus(appointment.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <Badge variant="outline" className={statusColors[appointment.status]}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" title="View Details">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
