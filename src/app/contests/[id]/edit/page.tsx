import { EditContestPage } from '@/components/organisms/EditContestPage'

interface EditContestPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditContest({ params }: EditContestPageProps) {
  const { id } = await params
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <EditContestPage contestId={id} />
    </div>
  )
}

export async function generateMetadata({ params }: EditContestPageProps) {
  const { id } = await params
  return {
    title: `Edit Contest ${id} - Flint App`,
    description: `Edit contest ${id}`,
  }
}
