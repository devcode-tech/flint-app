import { redirect } from 'next/navigation'

export default function CreateContestPageRoute() {
  // Redirect to the new full-screen route
  redirect('/contests/create/new')
}
