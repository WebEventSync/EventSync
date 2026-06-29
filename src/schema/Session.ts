export interface SessionSpeaker {
  id: string
  firstName: string
  lastName: string
  photo?: string | null
  biography?: string | null
}

export interface Session {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  room?: { id: string; name: string }
  speakers?: Array<{ speaker: SessionSpeaker }>
}

export interface Question {
  id: string
  content: string
  authorName: string | null
  upvotes: number
  createdAt: Date
}

export interface SessionClientProps {
  session: {
    id: string
    title: string
    isLive: boolean
    eventId: string
    speakers: Array<{ id: string; firstName: string; lastName: string }>
  }
  initialQuestions: Question[]
}
