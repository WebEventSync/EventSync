'use client';

import { useState, useEffect } from 'react';
import QuestionList from './QuestionList';
import QuestionForm from './QuestionForm';
import { getVisitorId } from '@/lib/visitor';

type Question = {
  id: string;
  content: string;
  authorName?: string;
  upvotes: number;
  createdAt: string;
};

export default function LiveQuestions({ 
  sessionId, 
  isLive 
}: { 
  sessionId: string; 
  isLive: boolean;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedQuestions, setVotedQuestions] = useState<Set<string>>(new Set());
  
  const visitorId = getVisitorId();

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/questions`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("Erreur questions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Polling toutes les 3 secondes
  useEffect(() => {
    fetchQuestions();
    const interval = setInterval(fetchQuestions, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleUpvote = async (questionId: string) => {
  try {
    const res = await fetch(`/api/questions/${questionId}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
    });

    if (res.ok) {
      const data = await res.json();
      
      // Mettre à jour localement l'état des votes
      if (data.action === "increment") {
        setVotedQuestions(prev => new Set(prev).add(questionId));
      } else {
        setVotedQuestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
      }
      
      fetchQuestions();
    }
  } catch (err) {
    console.error(err);
  }
};

  const handleNewQuestion = () => {
    fetchQuestions();
  };

  if (loading) {
    return <div className="text-slate-400 py-10 text-center">Chargement des questions...</div>;
  }

  return (
    <div className="space-y-10">
      {isLive ? (
        <QuestionForm 
          sessionId={sessionId} 
          onQuestionPosted={handleNewQuestion} 
        />
      ) : (
        <div className="bg-slate-900/50 border border-slate-700 rounded-3xl p-8 text-center">
          <p className="text-slate-400">Les questions sont uniquement disponibles pendant la session en direct.</p>
        </div>
      )}

      <QuestionList 
        questions={questions} 
        onUpvote={handleUpvote} 
        votedQuestions={votedQuestions}
      />
    </div>
  );
}