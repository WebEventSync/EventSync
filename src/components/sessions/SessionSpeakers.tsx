import Link from "next/link";

export default function SessionSpeakers({ speakers = [] }: { speakers: any[] }) {
  if (speakers.length === 0) return null;

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold text-white mb-6">Intervenants</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {speakers.map((item: any) => {
          const speaker = item.speaker || item;
          const speakerId = speaker?.id ?? item?.speakerId ?? item?.id;

          return (
            <Link
              href={`/speaker/${speakerId}`}
              key={speakerId}
              className="bg-slate-900/70 border border-slate-700/70 rounded-3xl p-6 flex gap-6 hover:border-sky-500/30 transition-colors"
            >
              {speaker.photo && (
                <img
                  src={speaker.photo}
                  alt={`${speaker.firstName} ${speaker.lastName}`}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-slate-700"
                />
              )}
              <div className="flex-1">
                <p className="text-xl font-semibold text-white">
                  {speaker.firstName} {speaker.lastName}
                </p>
                {speaker.biography && (
                  <p className="text-slate-400 mt-3 leading-relaxed">
                    {speaker.biography}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}