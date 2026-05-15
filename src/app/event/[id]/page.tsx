import { Session } from '@/generated/prisma'
import Link from 'next/link'
import SessionCard from "@/components/SessionCard/SessionCard"

const get_event = async (event_id: string) => {
    const event = await fetch(`http://localhost:3000/api/events/${event_id}`)
    return event.json()
}

const get_sessions = async (event_id : string) => {
    const sessions = await fetch(`http://localhost:3000/api/events/${event_id}/schedule`)
    return sessions.json()
}

const get_speakers = async (session_id : string) => {
    const speakers = await fetch(`http://localhost:3000/api/sessions/${session_id}`)
    return speakers.json()
}

function formatDateRange(startDate: string | Date, endDate: string | Date) {
  if (!startDate || !endDate) return 'Date inconnue'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
  const startText = start.toLocaleDateString('fr-FR', options)
  const endText = end.toLocaleDateString('fr-FR', options)
  return `${startText} — ${endText}`
}

function isLive(session:Session) {
    return (new Date(session.startTime) < new Date() && (new Date(session.endTime) > new Date()))
}

export default async function Event({ params }: { params: { id: string } }){
    const {id} = await params
    const event = await get_event(id)
    const {sessions} = await get_sessions(id)

    // Fetch all speakers for all sessions
    const sessionsWithSpeakers = await Promise.all(
        (sessions || []).map(async (session: any) => ({
            ...session,
            speakers: await get_speakers(session.id)
        }))
    )

    const style = event.image ? { backgroundImage: `url(${event.image})` } : undefined

    return (
        <div className="min-h-screen">
            {/* Back button */}
            <div className="pt-2 pb-4 px-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sky-200 hover:text-sky-100 transition-colors duration-200"
                >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    Back to events
                </Link>
            </div>

            {/* Hero section */}
            <div
                className="mx-4 rounded-2xl relative h-96 bg-slate-900/60 flex items-end overflow-hidden"
                style={style}
            >
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/30 to-transparent" />
                <div className="relative z-10 p-8">
                    <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
                </div>
            </div>

            {/* Event details */}
            <div className="px-6 py-8 max-w-4xl mx-auto">
                {/* Date, lieu, sessions count */}
                <div className="flex flex-wrap gap-6 mb-8 text-slate-300">
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-400" fill="currentColor">
                            <path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v2h20V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1Zm-2 8V8h18v2H4Zm0 3v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7H4Z"/>
                        </svg>
                        <span>{formatDateRange(event.startDate, event.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-400" fill="currentColor">
                            <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
                        </svg>
                        <span>{event.place || 'Lieu à confirmer'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-400" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>{sessions?.length || 0} session{sessions?.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-white mb-4">Description</h2>
                    <p className="text-slate-300 leading-relaxed text-lg">
                        {event.description || 'Aucune description disponible pour cet événement.'}
                    </p>
                </div>

                {/* Sessions list */}
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-6">Sessions</h2>
                    {sessionsWithSpeakers && sessionsWithSpeakers.length > 0 ? (
                        <div className="space-y-4">
                            {sessionsWithSpeakers.map((session: any) => (
                                <SessionCard session={session} key={session.id}/>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-center py-8">Aucune session programmée pour cet événement.</p>
                    )}
                </div>
            </div>
        </div>
    )
}