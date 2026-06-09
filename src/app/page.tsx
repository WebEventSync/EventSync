import EventList from "../components/EventList/EventList"

async function get_events() {
  const response = await fetch("http://localhost:3000/api/events", {
    cache: "no-store",
  })

  return response.json()
}

export default async function Home() {
  const events = await get_events()

  return (
    <main className="min-h-screen p-6 font-sans">
      <EventList events={events} />
    </main>
  )
}