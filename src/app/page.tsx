"use client"

import EventList from "../components/EventList/EventList"

const get_events =async ()=>{
  const events = await fetch("http://localhost:3000/api/events")
  return events.json()
}

const events = await get_events()

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-slate-950/85 text-slate-100 font-sans">
      <EventList events={events}/>
    </main>
  )
}
