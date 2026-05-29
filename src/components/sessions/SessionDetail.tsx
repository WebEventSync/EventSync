'use client';

import { useState, useEffect } from 'react';
import SessionHeader from './SessionHeader';
import SessionSpeakers from './SessionSpeakers';
import LiveQuestions from '../questions/LiveQuestions';

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

  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) return <div className="text-center py-20">Chargement...</div>;
  if (!session) return <div>Session non trouvée</div>;

  const isLive = new Date() >= new Date(session.startTime) && 
                 new Date() <= new Date(session.endTime);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <SessionHeader session={session} isLive={isLive} />
      <SessionSpeakers speakers={session.speakers || []} />

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          Questions en direct
          {isLive && <span className="text-emerald-400 text-sm font-normal">● LIVE</span>}
        </h2>
        
        <LiveQuestions sessionId={sessionId} isLive={isLive} />
      </div>
    </div>
  );
}