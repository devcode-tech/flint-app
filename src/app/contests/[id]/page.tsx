import { ContestViewPage } from '@/components/organisms/ContestViewPage'

interface ContestPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ContestPage({ params }: ContestPageProps) {
  const { id } = await params
  return <ContestViewPage contestId={id} />
}

export async function generateMetadata({ params }: ContestPageProps) {
  const { id } = await params
  return {
    title: `Contest ${id} - Flint App`,
    description: `View and manage contest ${id}`,
  }
}
