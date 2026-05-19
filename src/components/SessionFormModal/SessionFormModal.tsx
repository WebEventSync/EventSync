'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal/Modal'
import { useAdmin } from '@/context/AdminContext'

interface Speaker {
  id: string
  firstName: string
  lastName: string
}

interface Room {
  id: string
  name: string
  capacity: number
}

interface SessionFormProps {
  eventId: string
  session?: {
    id: string
    title: string
    description: string
    startTime: string
    endTime: string
    room?: { id: string; name: string }
    speakers?: Array<{ speaker: Speaker }>
  } | null
  onClose: () => void
  onSuccess: () => void
}

function toDatetimeLocal(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().slice(0, 16)
}

export default function SessionFormModal({ eventId, session, onClose, onSuccess }: SessionFormProps) {
  const { token } = useAdmin()
  const [rooms, setRooms] = useState<Room[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>(
    session?.speakers?.map(s => s.speaker.id) || []
  )
  const [form, setForm] = useState({
    title: session?.title || '',
    description: session?.description || '',
    startTime: session ? toDatetimeLocal(session.startTime) : '',
    endTime: session ? toDatetimeLocal(session.endTime) : '',
    roomId: session?.room?.id || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!session

  useEffect(() => {
    fetch('/api/rooms').then(r => r.json()).then(setRooms).catch(() => {})
    fetch('/api/speakers').then(r => r.json()).then(setSpeakers).catch(() => {})
  }, [])

  const toggleSpeaker = (id: string) =>
    setSelectedSpeakers(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const url = isEdit
        ? `/api/admin/sessions/${session!.id}`
        : '/api/admin/sessions'
      const method = isEdit ? 'PUT' : 'POST'
      const body = isEdit ? form : { ...form, eventId, speakerIds: selectedSpeakers }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      if (!res.ok) { setError('Erreur lors de l\'enregistrement'); return }
      onSuccess()
      onClose()
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <Modal title={isEdit ? 'Modifier la session' : 'Créer une session'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Titre *</label>
          <input value={form.title} onChange={set('title')} required
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition text-sm"
            placeholder="Titre de la session" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition text-sm resize-none"
            placeholder="Description de la session" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Début *</label>
            <input type="datetime-local" value={form.startTime} onChange={set('startTime')} required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500 transition text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Fin *</label>
            <input type="datetime-local" value={form.endTime} onChange={set('endTime')} required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500 transition text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Salle *</label>
          <select value={form.roomId} onChange={set('roomId')} required
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500 transition text-sm">
            <option value="">Sélectionner une salle</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.capacity} places)</option>)}
          </select>
        </div>
        {!isEdit && speakers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Speakers</label>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {speakers.map(s => (
                <label key={s.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition">
                  <input type="checkbox" checked={selectedSpeakers.includes(s.id)}
                    onChange={() => toggleSpeaker(s.id)} className="w-4 h-4 accent-sky-500" />
                  <span className="text-sm text-slate-300">{s.firstName} {s.lastName}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        {error && <div className="p-3 bg-rose-900/30 border border-rose-500/30 rounded-lg text-rose-300 text-sm">{error}</div>}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition text-sm">
            Annuler
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold transition text-sm">
            {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
