import EventCard from "../EventCard/EventCard"

export default function EventList({ events = [] }) {
  return (
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
        />
      ))}
    </div>
  )
}