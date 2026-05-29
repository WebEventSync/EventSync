'use client';

import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

type Question = {
  id: string;
  content: string;
  authorName?: string;
  upvotes: number;
  createdAt: string;
};

export default function QuestionCard({ 
  question, 
  onUpvote, 
  hasVoted 
}: { 
  question: Question; 
  onUpvote: () => void; 
  hasVoted: boolean;
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-6 hover:border-slate-500 transition-all group">
      <div className="flex gap-5">
        {/* Bouton Vote avec Cœur */}
        {/* Bouton Vote avec Cœur Toggle */}
<button
  onClick={onUpvote}
  className={`flex-shrink-0 w-16 h-16 rounded-3xl flex flex-col items-center justify-center transition-all duration-200 border ${
    hasVoted 
      ? 'bg-pink-500/10 text-pink-400 border-pink-500/40' 
      : 'hover:bg-slate-700 text-slate-400 hover:text-pink-400 border-slate-600 hover:border-pink-500/30'
  }`}
>
  <span className="text-3xl transition-all hover:scale-125">
    {hasVoted ? '❤️' : '♡'}
  </span>
  <span className="font-mono text-sm mt-1 font-semibold tracking-tight">
    {question.upvotes}
  </span>
</button>

        <div className="flex-1 min-w-0 pt-1">
          <p className="text-slate-200 text-[17px] leading-relaxed">
            {question.content}
          </p>
          
          <div className="flex items-center gap-3 mt-5 text-xs text-slate-500">
            {question.authorName && (
              <span className="font-medium text-slate-400">par {question.authorName}</span>
            )}
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(question.createdAt), { 
                addSuffix: true, 
                locale: fr 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}