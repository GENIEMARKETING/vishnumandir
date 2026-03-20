import { redirect } from 'next/navigation'

/** /admin → redirect to dashboard */
export default function AdminIndexPage() {
  redirect('/admin/dashboard')
}
