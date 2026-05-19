import { prisma } from '@/lib/prisma'
import SessionClient from './SessionClient'
import Link from 'next/link'

export default async function SessionPage({ params } : {params : {id: string, sessionId : string}}) {
  const { id, sessionId } = await params

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      room: true,
      speakers: { include: { speaker: { include: { links: true } } } },
      questions: { orderBy: { upvotes: 'desc' } },
      event: true,
    },
  })

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Session introuvable</h1>
          <Link href="/" className="text-sky-400 hover:text-sky-300">← Retour</Link>
        </div>
      </div>
    )
  }

  const now = new Date()
  const isLive = now >= session.startTime && now <= session.endTime

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="pt-2 pb-4 px-6">
        <Link
          href={id ? `/event/${id}` : '/'}
          className="inline-flex items-center gap-2 px-4 py-2 text-sky-200 hover:text-sky-100 transition-colors duration-200"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Retour à l'événement
        </Link>
      </div>

      <div className="px-6 pb-16 max-w-3xl mx-auto">
        {/* Session header */}
        <div className={`rounded-2xl p-8 mb-8 border ${
          isLive
            ? 'bg-emerald-900/20 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.1)]'
            : 'bg-slate-800/50 border-slate-700'
        }`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-white">{session.title}</h1>
            {isLive && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 text-sm font-semibold shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                EN DIRECT
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-6">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-sky-400" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
              {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              {' — '}
              {new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {session.room && (
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-sky-400" fill="currentColor">
                  <path d="M10 2v2H8C6.9 4 6 4.9 6 6v2H4C2.9 8 2 8.9 2 10v10h9v-3.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V20h9V10c0-1.1-.9-2-2-2h-2V6c0-1.1-.9-2-2-2h-2V2h-5zm0 2h4v2h-4V4z"/>
                </svg>
                {session.room.name}
              </span>
            )}
          </div>

          {session.description && (
            <p className="text-slate-300 leading-relaxed">{session.description}</p>
          )}
        </div>

        {/* Speakers */}
        {session.speakers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Speakers</h2>
            <div className="space-y-4">
              {session.speakers.map(({ speaker }) => (
                <div key={speaker.id} className="flex gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                  {speaker.photo && (
                    <img
                      src={speaker.photo}
                      alt={`${speaker.firstName} ${speaker.lastName}`}
                      className="w-16 h-16 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">{speaker.firstName} {speaker.lastName}</p>
                    {speaker.biography && (
                      <p className="text-slate-300 text-sm mt-1">{speaker.biography}</p>
                    )}
                    {speaker.links.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {speaker.links.map(link => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:text-sky-300 text-xs underline"
                          >
                            {link.url}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Q&A section — client component with upvotes */}
        <SessionClient
          session={{
            id: session.id,
            title: session.title,
            isLive,
            eventId: session.eventId,
            speakers: session.speakers.map(s => ({
              id: s.speaker.id,
              firstName: s.speaker.firstName,
              lastName: s.speaker.lastName,
            })),
          }}
          initialQuestions={session.questions}
        />
      </div>
    </div>
  )
}
