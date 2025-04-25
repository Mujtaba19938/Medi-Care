"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getBrowserClient } from "@/lib/supabase"
import AdminHeader from "@/components/admin-header"
import Link from "next/link"
import { useState } from "react"

export default function NewDoctorPage() {
  const [doctor, setDoctor] = useState({
    name: "",
    role: "",
    bio: "",
    image_url: "/placeholder.svg?height=300&width=300",
  })
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getBrowserClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDoctor((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Create new doctor
      const { error } = await supabase.from("doctors").insert({
        name: doctor.name,
        role: doctor.role,
        bio: doctor.bio,
        image_url: doctor.image_url || "/placeholder.svg?height=300&width=300",
      })

      if (error) throw error

      toast({
        title: "Doctor added",
        description: "The doctor has been added successfully.",
      })

      router.push("/admin/doctors")
    } catch (error: any) {
      console.error("Error saving doctor:", error)
      toast({
        title: "Error",
        description: "Failed to add doctor. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Button asChild variant="ghost" className="mr-4">
              <Link href="/admin/doctors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Add Doctor</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New Doctor</CardTitle>
              <CardDescription>Add a new doctor to your medical practice.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={doctor.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    name="role"
                    value={doctor.role}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Cardiologist, Pediatrician"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={doctor.bio}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Brief description of the doctor's experience and specialties"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={doctor.image_url}
                    onChange={handleChange}
                    placeholder="/placeholder.svg?height=300&width=300"
                  />
                  <p className="text-xs text-gray-500">
                    Leave blank to use a placeholder image. For production, use a real image URL.
                  </p>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/doctors">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Add Doctor"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
