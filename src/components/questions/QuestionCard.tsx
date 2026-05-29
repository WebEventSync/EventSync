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
        <button
          onClick={onUpvote}
          disabled={hasVoted}
          className={`flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
            hasVoted 
              ? 'bg-emerald-500/10 text-emerald-400 cursor-not-allowed' 
              : 'hover:bg-slate-700 text-slate-400 hover:text-sky-400'
          }`}
        >
          <span className="text-2xl">▲</span>
          <span className="font-mono text-sm mt-1">{question.upvotes}</span>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-slate-200 text-[17px] leading-relaxed">
            {question.content}
          </p>
          
          <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
            {question.authorName && <span>par {question.authorName}</span>}
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