'use client'

import { useState } from 'react'
import Modal from '@/components/Modal/Modal'
import { useAdmin } from '@/context/AdminContext'

interface SpeakerFormProps {
  speaker?: {
    id: string
    firstName: string
    lastName: string
    biography?: string | null
    photo?: string | null
  } | null
  onClose: () => void
  onSuccess: () => void
}

export default function SpeakerFormModal({ speaker, onClose, onSuccess }: SpeakerFormProps) {
  const { token } = useAdmin()
  const [form, setForm] = useState({
    firstName: speaker?.firstName || '',
    lastName: speaker?.lastName || '',
    biography: speaker?.biography || '',
    photo: speaker?.photo || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!speaker

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const url = isEdit ? `/api/admin/speakers/${speaker!.id}` : '/api/admin/speakers'
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
    <Modal title={isEdit ? 'Modifier le speaker' : 'Créer un speaker'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Prénom *</label>
            <input value={form.firstName} onChange={set('firstName')} required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition text-sm"
              placeholder="Jean" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Nom *</label>
            <input value={form.lastName} onChange={set('lastName')} required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition text-sm"
              placeholder="Dupont" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Photo (URL)</label>
          <input value={form.photo} onChange={set('photo')}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition text-sm"
            placeholder="https://example.com/photo.jpg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Biographie</label>
          <textarea value={form.biography} onChange={set('biography')} rows={4}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition text-sm resize-none"
            placeholder="Courte biographie du speaker…" />
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
