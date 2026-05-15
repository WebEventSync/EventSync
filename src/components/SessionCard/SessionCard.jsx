"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

function isLive(session) {
    return (new Date(session.startTime) < new Date() && (new Date(session.endTime) > new Date()))
}

export default function SessionCard({session }){
    const path = usePathname()

    return(
        <Link
            href={`${path}/session/${session.id}`}
        >
            <div key={session.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-colors duration-200">
            {isLive(session) ? (
            <div className='bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 p-2 rounded-md text-shadow-yellow-600 font-bold'>
                Live
            </div>): <></>}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{session.title}</h3>
                <div className="text-sm text-slate-400">
                    {new Date(session.startTime).toLocaleTimeString('fr-FR', {
                        weekday: 'short', day: '2-digit', month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    })} --- {new Date(session.endTime).toLocaleTimeString('fr-FR', {
                        weekday: 'short', day: '2-digit', month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
            <p className="text-slate-300 mb-4">{session.description}</p>
            
            <div className="mb-4 text-sm text-slate-400">
                <span>Salle: {session.room?.name || 'Non assignée'}</span>
            </div>

            {/* Speakers section */}
            {session.speakers && session.speakers.length > 0 && (
                <div className="mt-4 border-t border-slate-600 pt-4">
                    <h4 className="text-sm font-semibold text-sky-300 mb-3">Speakers</h4>
                    <div className="space-y-3">
                        {session.speakers.map((speakerData) => {
                            const speaker = speakerData.speaker
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
                                        <p className="font-semibold text-white">{speaker.firstName} {speaker.lastName}</p>
                                        {speaker.biography && (
                                            <p className="text-xs text-slate-300 mt-1">{speaker.biography}</p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
            </div>
        </Link>
    )
}