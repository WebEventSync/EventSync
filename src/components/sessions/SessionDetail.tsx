'use client';

import { useState, useEffect } from 'react';
import SessionHeader from './SessionHeader';
import SessionSpeakers from './SessionSpeakers';
import LiveQuestions from '../questions/LiveQuestions';
import { isSessionLive } from '@/lib/utils';

type Session = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  room?: { name: string };
  speakers?: any[];
};

export default function SessionDetail({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch session');
        setSession(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Chargement de la session...
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Erreur : {error || 'Session non trouvée'}
      </div>
    );
  }

  const isLive = isSessionLive(session.startTime, session.endTime);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <SessionHeader session={session} isLive={isLive} />
      <SessionSpeakers speakers={session.speakers || []} />

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          Questions en direct
          {isLive && <span className="text-emerald-400 text-sm font-normal tracking-widest">● LIVE</span>}
        </h2>

        <LiveQuestions sessionId={sessionId} isLive={isLive} />
      </div>
    </div>
  );
}