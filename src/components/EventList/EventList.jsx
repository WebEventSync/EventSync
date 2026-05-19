'use client'

import { useState } from 'react'
import EventCard from '../EventCard/EventCard'
import { useAdmin } from '@/context/AdminContext'
import EventFormModal from '@/components/EventFormModal/EventFormModal'

export default function EventList({ events: initialEvents }) {
  const { isAdmin } = useAdmin()
  const [events, setEvents] = useState(initialEvents)
  const [showCreate, setShowCreate] = useState(false)

  const refresh = async () => {
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      setEvents(data)
    } catch {}
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {events.map((ev) => (
          <EventCard
            key={ev.id}
            id={ev.id}
            title={ev.title}
            description={ev.description}
            place={ev.place}
            startDate={ev.startDate}
            endDate={ev.endDate}
            onRefresh={refresh}
          />
        ))}
      </div>

      {/* Admin: FAB create event */}
      {isAdmin && (
        <button
          onClick={() => setShowCreate(true)}
          title="Créer un événement"
          className="fixed bottom-8 left-8 z-40 w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-400 text-white shadow-2xl shadow-sky-500/40 flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {showCreate && (
        <EventFormModal
          event={null}
          onClose={() => setShowCreate(false)}
          onSuccess={refresh}
        />
      )}
    </div>
  )
}
