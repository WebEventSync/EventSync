'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatSessionDate } from '@/lib/utils';

type SpeakerLink = {
  id: string;
  url: string;
};

type Speaker = {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string | null;
  biography?: string | null;
  links?: SpeakerLink[];
};

type Session = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room?: { name: string };
  event?: { id: string; title: string };
};

function getLinkLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function SpeakerDetail({ speakerId }: { speakerId: string }) {
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpeaker() {
      setLoading(true);

      try {
        const [speakerRes, sessionsRes] = await Promise.all([
          fetch(`/api/speakers/${speakerId}`),
          fetch(`/api/speakers/${speakerId}/sessions`),
        ]);

        if (!speakerRes.ok) {
          setSpeaker(null);
          return;
        }

        const speakerData = await speakerRes.json();
        const sessionsData = sessionsRes.ok ? await sessionsRes.json() : [];

        setSpeaker(speakerData);
        setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      } catch (error) {
        console.error('Erreur chargement speaker :', error);
        setSpeaker(null);
      } finally {
        setLoading(false);
      }
    }

    loadSpeaker();
  }, [speakerId]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Chargement...</div>;
  }

  if (!speaker) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-slate-400">
        Intervenant introuvable.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="rounded-4xl border border-slate-700/70 bg-slate-950/80 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.9)]">
        <div className="grid gap-8 p-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-700/80 bg-slate-900/90 shadow-inner shadow-slate-950/20">
            {speaker.photo ? (
              <img
                src={speaker.photo}
                alt={`${speaker.firstName} ${speaker.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-80 items-center justify-center bg-slate-950 text-slate-500">
                Photo non disponible
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-sky-400/80">Intervenant</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {speaker.firstName} {speaker.lastName}
              </h1>
              <p className="mt-6 max-w-3xl text-slate-300 leading-8">
                {speaker.biography || 'Aucune biographie n’est disponible pour le moment.'}
              </p>
            </div>

            {speaker.links?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {speaker.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-3xl border border-slate-700/80 bg-slate-900/90 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-sky-500/30 hover:bg-slate-800"
                  >
                    {getLinkLabel(link.url)}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-slate-700/70 px-8 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Sessions</h2>
              <p className="mt-2 text-sm text-slate-400">
                {sessions.length > 0
                  ? `${sessions.length} session${sessions.length > 1 ? 's' : ''} programmée${sessions.length > 1 ? 's' : ''}`
                  : 'Aucune session associée pour cet intervenant.'}
              </p>
            </div>
          </div>

          {sessions.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/sessions/${session.id}`}
                  className="block rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 transition hover:border-sky-500/30 hover:bg-slate-800"
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.24em] text-sky-400/80">Session</p>
                      <h3 className="mt-2 text-xl font-semibold text-white leading-tight">
                        {session.title}
                      </h3>
                    </div>

                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.24em] text-sky-400/80">Événement</p>
                      <p className="mt-2 text-sm text-slate-300">
                        {session.event?.title || 'Événement non disponible'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.24em] text-sky-400/80">Salle</p>
                      <p className="mt-2 text-sm text-slate-300">
                        {session.room?.name || 'Salle non assignée'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.24em] text-sky-400/80">Date</p>
                      <p className="mt-2 text-sm text-slate-400">
                        {formatSessionDate(session.startTime, session.endTime)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-slate-700/70 bg-slate-900/60 p-6 text-slate-400">
              Cet intervenant n’est pas encore programmé sur une session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
