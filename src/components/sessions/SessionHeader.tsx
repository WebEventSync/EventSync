import Link from 'next/link';
import LiveBadge from '@/components/questions/LiveBadge';
import { formatSessionDate } from '@/lib/utils';

type Props = {
  session: any;
  isLive: boolean;
};

export default function SessionHeader({ session, isLive }: Props) {
  return (
    <div className="mb-12">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {session.event && (
            <div className="mb-6">
              <Link
                href={`/event/${session.event.id}`}
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500/40 hover:text-sky-300"
              >
                ← Retour à l’événement
              </Link>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {session.title}
            </h1>
            {isLive && <LiveBadge />}
          </div>

          <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
            {session.description}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6 text-slate-300">
        <div>
          <span className="block text-sky-400 text-sm mb-1 tracking-widest">HORAIRES</span>
          <p className="font-medium text-lg">
            {formatSessionDate(session.startTime, session.endTime)}
          </p>
        </div>
        <div>
          <span className="block text-sky-400 text-sm mb-1 tracking-widest">SALLE</span>
          <p className="font-medium text-lg">{session.room?.name || 'Non assignée'}</p>
        </div>
        {session.event && (
          <div>
            <span className="block text-sky-400 text-sm mb-1 tracking-widest">ÉVÉNEMENT</span>
            <p className="font-medium text-lg">{session.event.title}</p>
          </div>
        )}
      </div>

    </div>
  );
}