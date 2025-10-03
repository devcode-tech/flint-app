import { ContestViewPage } from '@/components/organisms/ContestViewPage'

interface ContestPageProps {
  params: {
    id: string
  }
}

export default function ContestPage({ params }: ContestPageProps) {
  return <ContestViewPage contestId={params.id} />
}

export async function generateMetadata({ params }: ContestPageProps) {
  return {
    title: `Contest ${params.id} - Flint App`,
    description: `View and manage contest ${params.id}`,
  }
}
