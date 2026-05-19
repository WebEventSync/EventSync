'use client'

import { useState, useEffect, useTransition } from 'react'
import { Question, SessionClientProps } from '@/schema/Session'

function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let vid = localStorage.getItem('visitor_id')
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('visitor_id', vid)
  }
  return vid
}

export default function SessionClient({ session, initialQuestions }: SessionClientProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [visitorId, setVisitorId] = useState('')
  const [form, setForm] = useState({ content: '', authorName: '', speakerId: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const vid = getVisitorId()
    setVisitorId(vid)
    try {
      const voted = localStorage.getItem(`voted_${session.id}`)
      if (voted) setVotedIds(new Set(JSON.parse(voted)))
    } catch {}
  }, [session.id])

  const handleUpvote = (questionId: string) => {
    if (votedIds.has(questionId)) return
    startTransition(async () => {
      const res = await fetch(`/api/questions/${questionId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
      })
      if (res.ok || res.status === 409) {
        if (res.ok) {
          setQuestions(prev =>
            [...prev.map(q => q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q)]
              .sort((a, b) => b.upvotes - a.upvotes)
          )
        }
        const newVoted = new Set([...votedIds, questionId])
        setVotedIds(newVoted)
        localStorage.setItem(`voted_${session.id}`, JSON.stringify([...newVoted]))
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.content.trim()) return
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const res = await fetch(`/api/sessions/${session.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: form.content.trim(), authorName: form.authorName.trim() || undefined }),
      })
      if (res.ok) {
        setSuccess('Question envoyée !')
        setForm(f => ({ ...f, content: '', authorName: '' }))
        const updated = await fetch(`/api/sessions/${session.id}/questions`).then(r => r.json())
        setQuestions(updated)
      } else if (res.status === 403) {
        setError('La session n\'est plus en direct.')
      } else {
        setError('Erreur lors de l\'envoi.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const sortedQuestions = [...questions].sort((a, b) => b.upvotes - a.upvotes)

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        Questions
        {questions.length > 0 && (
          <span className="px-2 py-0.5 bg-slate-700 rounded-full text-slate-300 text-sm font-normal">
            {questions.length}
          </span>
        )}
      </h2>

      {session.isLive ? (
        <div className="mb-8 p-5 bg-emerald-900/10 border border-emerald-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 text-sm font-medium">Session en direct — posez une question</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            {session.speakers.length > 1 && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Adresser à (optionnel)</label>
                <select value={form.speakerId} onChange={e => setForm(f => ({ ...f, speakerId: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition text-sm">
                  <option value="">Toute la session</option>
                  {session.speakers.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>
            )}
            {session.speakers.length === 1 && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Speaker</label>
                <div className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm">
                  {session.speakers[0].firstName} {session.speakers[0].lastName}
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Votre question *</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={3} required
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition text-sm resize-none"
                placeholder="Écrivez votre question…" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Votre nom (optionnel)</label>
              <input value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition text-sm"
                placeholder="Anonyme" />
            </div>
            {error && <div className="p-3 bg-rose-900/30 border border-rose-500/30 rounded-lg text-rose-300 text-sm">{error}</div>}
            {success && <div className="p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">{success}</div>}
            <button type="submit" disabled={submitting || !form.content.trim()}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition text-sm">
              {submitting ? 'Envoi…' : 'Envoyer la question'}
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-slate-800/30 border border-slate-700 rounded-xl text-slate-400 text-sm text-center">
          Les questions ne peuvent être posées que pendant la session en direct.
        </div>
      )}

      {sortedQuestions.length > 0 ? (
        <div className="space-y-3">
          {sortedQuestions.map((question, index) => {
            const hasVoted = votedIds.has(question.id)
            return (
              <div key={question.id} className="flex gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800/70 transition-colors">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button onClick={() => handleUpvote(question.id)} disabled={hasVoted || isPending}
                    title={hasVoted ? 'Déjà voté' : 'Voter pour cette question'}
                    className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-all ${
                      hasVoted ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300 cursor-default'
                               : 'bg-slate-700 border border-slate-600 text-slate-400 hover:bg-sky-500/20 hover:border-sky-500/40 hover:text-sky-300 active:scale-95'}`}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs font-bold">{question.upvotes}</span>
                  </button>
                  {index === 0 && questions.length > 1 && (
                    <span className="text-[10px] text-amber-400">🔥 Top</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm leading-relaxed">{question.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>{question.authorName || 'Anonyme'}</span>
                    <span>·</span>
                    <span>{new Date(question.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <svg viewBox="0 0 24 24" className="w-12 h-12 mx-auto mb-3 opacity-30" fill="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <p>Aucune question pour l&apos;instant.</p>
          {session.isLive && <p className="text-sm mt-1">Soyez le premier à poser une question !</p>}
        </div>
      )}
    </div>
  )
}
