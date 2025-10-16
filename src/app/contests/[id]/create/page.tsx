import { CreateContestPage } from '@/components/organisms/CreateContestPage'

interface CreateContestWithIdPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CreateContestWithId({ params }: CreateContestWithIdPageProps) {
  const { id } = await params
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <CreateContestPage contestId={id} />
    </div>
  )
}

export async function generateMetadata({ params }: CreateContestWithIdPageProps) {
  const { id } = await params
  return {
    title: `Create Contest ${id} - Flint App`,
    description: `Create contest ${id}`,
  }
}
