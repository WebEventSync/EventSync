import EventList from "../components/EventList/EventList"

const get_events = async () => {
  const events = await fetch("http://localhost:3000/api/events", { cache: 'no-store' })
  return events.json()
}

export default async function Home() {
  const events = await get_events()

  return (
    <main className="min-h-screen p-6 bg-slate-950/85 text-slate-100 font-sans">
      <EventList events={events}/>
    </main>
  )
}
