'use client'

import { useState } from 'react'
import Modal from '@/components/Modal/Modal'
import { useAdmin } from '@/context/AdminContext'

interface EventFormProps {
  event?: {
    id: string
    title: string
    description: string
    startDate: string
    endDate: string
    place: string
  } | null
  onClose: () => void
  onSuccess: () => void
}

function toDatetimeLocal(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().slice(0, 16)
}

export default function EventFormModal({ event, onClose, onSuccess }: EventFormProps) {
  const { token } = useAdmin()
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startDate: event ? toDatetimeLocal(event.startDate) : '',
    endDate: event ? toDatetimeLocal(event.endDate) : '',
    place: event?.place || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!event

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const url = isEdit ? `/api/admin/events/${event!.id}` : '/api/admin/events'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
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

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <Modal title={isEdit ? "Modifier l'événement" : "Créer un événement"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Titre *</label>
          <input value={form.title} onChange={set('title')} required
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition text-sm"
            placeholder="Nom de l'événement" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition text-sm resize-none"
            placeholder="Description de l'événement" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Début *</label>
            <input type="datetime-local" value={form.startDate} onChange={set('startDate')} required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500 transition text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Fin *</label>
            <input type="datetime-local" value={form.endDate} onChange={set('endDate')} required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500 transition text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Lieu *</label>
          <input value={form.place} onChange={set('place')} required
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition text-sm"
            placeholder="Paris, France" />
        </div>
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
