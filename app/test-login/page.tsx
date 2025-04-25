import { DirectLoginForm } from "@/components/direct-login-form"

export default function TestLoginPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold text-center mb-6">Test Login</h1>
      <p className="text-center mb-8 max-w-md mx-auto">
        This page provides a way to test login functionality and handle "Email not confirmed" errors. Use the "Confirm
        Email" button if you're encountering verification issues.
      </p>
      <DirectLoginForm />

      <div className="mt-8 max-w-md mx-auto bg-blue-50 p-4 rounded-md">
        <h2 className="font-bold text-lg mb-2">Troubleshooting Login Issues</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>If you get "Email not confirmed" errors, use the "Confirm Email" button above.</li>
          <li>Default admin credentials are pre-filled (admin@medicarehealth.com / admin123).</li>
          <li>Make sure you've run the SQL scripts to create the admin user.</li>
          <li>Check browser console for detailed error messages.</li>
        </ul>
      </div>
    </div>
  )
}
