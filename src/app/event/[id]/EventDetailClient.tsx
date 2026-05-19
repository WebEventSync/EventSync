'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useAdmin } from '@/context/AdminContext'
import { Session } from '@/schema/Session'
import SessionFormModal from '@/components/SessionFormModal/SessionFormModal'
import SpeakerFormModal from '@/components/SpeakerFormModal/SpeakerFormModal'

function isLive(session: Session): boolean {
  const now = new Date()
  return now >= new Date(session.startTime) && now <= new Date(session.endTime)
}

interface Props {
  eventId: string
  initialSessions: Session[]
}

export default function EventDetailClient({ eventId, initialSessions }: Props) {
  const { isAdmin, token } = useAdmin()
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [showCreateSession, setShowCreateSession] = useState(false)
  const [showCreateSpeaker, setShowCreateSpeaker] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const { sessions: newSessions } = await fetch(`/api/events/${eventId}/schedule`).then(r => r.json())
      const withSpeakers = await Promise.all(
        (newSessions || []).map(async (s: Session) => ({
          ...s,
          speakers: await fetch(`/api/sessions/${s.id}`).then(r => r.json()),
        }))
      )
      setSessions(withSpeakers)
    } catch {}
  }, [eventId])

  const handleDeleteSession = async (session: Session) => {
    if (!confirm(`Supprimer la session "${session.title}" ?`)) return
    setDeletingId(session.id)
    try {
      await fetch(`/api/admin/sessions/${session.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      await refresh()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Sessions</h2>
          {isAdmin && (
            <button onClick={() => setShowCreateSpeaker(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-purple-500/30 text-purple-300 bg-purple-900/20 hover:bg-purple-900/40 transition">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" strokeLinecap="round"/>
              </svg>
              Créer un speaker
            </button>
          )}
        </div>

        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => {
              const live = isLive(session)
              return (
                <div key={session.id} className={`border rounded-xl p-6 transition-colors duration-200 ${
                  live ? 'bg-emerald-900/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                       : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Link href={`/event/${eventId}/session/${session.id}`}
                        className="text-xl font-semibold text-white hover:text-sky-300 transition-colors">
                        {session.title}
                      </Link>
                      {live && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">
                        {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        {' — '}
                        {new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isAdmin && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setEditingSession(session)} title="Modifier"
                            className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:bg-sky-500/40 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteSession(session)} disabled={deletingId === session.id}
                            title="Supprimer"
                            className="p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/40 disabled:opacity-50 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4">{session.description}</p>
                  <p className="text-sm text-slate-400 mb-4">Salle : {session.room?.name || 'Non assignée'}</p>

                  {session.speakers && session.speakers.length > 0 && (
                    <div className="mt-4 border-t border-slate-600 pt-4">
                      <h4 className="text-sm font-semibold text-sky-300 mb-3">Speakers</h4>
                      <div className="space-y-3">
                        {session.speakers.map((speakerData) => {
                          const speaker = speakerData.speaker
                          return (
                            <div key={speaker.id} className="flex gap-3 p-3 bg-slate-700/30 rounded-lg">
                              {speaker.photo && (
                                <img src={speaker.photo} alt={`${speaker.firstName} ${speaker.lastName}`}
                                  className="w-12 h-12 rounded-full object-cover shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-white">{speaker.firstName} {speaker.lastName}</p>
                                {speaker.biography && <p className="text-xs text-slate-300 mt-1">{speaker.biography}</p>}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-600/50">
                    <Link href={`/event/${eventId}/session/${session.id}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        live ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                             : 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700'}`}>
                      {live ? (
                        <>
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                          </svg>
                          Voir la session &amp; poser une question
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round"/>
                          </svg>
                          Voir la session
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">Aucune session programmée pour cet événement.</p>
        )}
      </div>

      {isAdmin && (
        <button onClick={() => setShowCreateSession(true)} title="Ajouter une session"
          className="fixed bottom-8 left-8 z-40 w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-400 text-white shadow-2xl shadow-sky-500/40 flex items-center justify-center transition-all duration-200 hover:scale-110">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {showCreateSession && (
        <SessionFormModal eventId={eventId} session={null}
          onClose={() => setShowCreateSession(false)} onSuccess={refresh} />
      )}
      {editingSession && (
        <SessionFormModal eventId={eventId} session={editingSession}
          onClose={() => setEditingSession(null)} onSuccess={refresh} />
      )}
      {showCreateSpeaker && (
        <SpeakerFormModal speaker={null}
          onClose={() => setShowCreateSpeaker(false)} onSuccess={() => {}} />
      )}
    </>
  )
}
