import Link from "next/link";
import LiveBadge from "@/components/questions/LiveBadge";
import { formatSessionDate } from "@/lib/utils";

type LiveSession = {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  room?: { name: string };
  event?: { title: string };
};

async function get_live_sessions() {
  const response = await fetch("http://localhost:3000/api/lives", {
    cache: "no-store",
  });

  return response.json() as Promise<LiveSession[]>;
}

export default async function LiveSessionList() {
  const sessions = await get_live_sessions();

  return (
    <section className="mt-14">
      <div className="flex flex-col gap-3 mb-8">
        <span className="text-sky-400 uppercase tracking-[0.35em] text-sm font-semibold">
          En direct
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          Sessions actuellement live
        </h2>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-8 text-slate-400">
          Aucune session en live pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <article
              key={session.id}
              className="group overflow-hidden rounded-[28px] border border-slate-700/70 bg-slate-950/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:border-sky-500/40"
            >
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">
                    {session.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 truncate">
                    {session.event?.title || "Événement inconnu"}
                  </p>
                </div>
                <LiveBadge />
              </div>

              <p className="text-slate-300 leading-relaxed line-clamp-3 mb-5">
                {session.description || "Description non disponible."}
              </p>

              <div className="space-y-4 text-slate-300">
                <div>
                  <span className="block text-sky-400 text-[0.77rem] tracking-[0.22em] uppercase mb-1">
                    Salle
                  </span>
                  <p className="font-medium text-sm">
                    {session.room?.name || "Salle non assignée"}
                  </p>
                </div>
                <div>
                  <span className="block text-sky-400 text-[0.77rem] tracking-[0.22em] uppercase mb-1">
                    Horaire
                  </span>
                  <p className="font-medium text-sm">
                    {formatSessionDate(session.startTime, session.endTime)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href={`/sessions/${session.id}`}
                  className="inline-flex items-center rounded-full bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-300 transition hover:bg-sky-500/20"
                >
                  Voir la session
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
