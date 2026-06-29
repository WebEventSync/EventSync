'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { isSessionLive } from '@/lib/utils';

type Room = {
  id: string;
  name: string;
};

type Props = {
  sessions: any[];
  rooms: Room[];
};

export default function SessionsList({ sessions, rooms }: Props) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');

  const filteredSessions = useMemo(() => {
    if (selectedRoomId === 'all') return sessions;
    return sessions.filter((session) => session.roomId === selectedRoomId);
  }, [sessions, selectedRoomId]);

  return (
    <div>
      {/* Filtre par salle */}
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="room-filter" className="text-sm text-sky-400 tracking-widest">
          SALLE
        </label>
        <select
          id="room-filter"
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          <option value="all">Toutes les salles</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>

        <span className="text-sm text-slate-400">
          {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Liste filtrée */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session: any) => {
            const isLive = isSessionLive(session.startTime, session.endTime);
            return (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className="block group"
              >
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 hover:border-sky-500/30 transition-all duration-200 cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-sky-300 transition-colors">
                      {session.title}
                    </h3>

                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-400">
                        {new Date(session.startTime).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(session.endTime).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>

                      {isLive && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 text-xs font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          LIVE
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4">{session.description}</p>

                  <div className="mb-4 text-sm text-slate-400">
                    <span>Salle: {session.room?.name || 'Non assignée'}</span>
                  </div>

                  {session.speakers && session.speakers.length > 0 && (
                    <div className="mt-4 border-t border-slate-600 pt-4">
                      <h4 className="text-sm font-semibold text-sky-300 mb-3">Intervenants</h4>
                      <div className="space-y-3">
                        {session.speakers.map((speakerData: any) => {
                          const speaker = speakerData.speaker;
                          return (
                            <div key={speaker.id} className="flex gap-3 p-3 bg-slate-700/30 rounded-lg">
                              {speaker.photo && (
                                <img
                                  src={speaker.photo}
                                  alt={`${speaker.firstName} ${speaker.lastName}`}
                                  className="w-12 h-12 rounded-full object-cover shrink-0"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-white">
                                  {speaker.firstName} {speaker.lastName}
                                </p>
                                {speaker.biography && (
                                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                                    {speaker.biography}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-400 text-center py-8">
          Aucune session dans cette salle.
        </p>
      )}
    </div>
  );
}