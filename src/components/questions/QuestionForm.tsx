'use client';

import { useState } from 'react';

export default function QuestionForm({ 
  sessionId, 
  onQuestionPosted 
}: { 
  sessionId: string; 
  onQuestionPosted: () => void;
}) {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await fetch(`/api/sessions/${sessionId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorName: authorName.trim() || undefined }),
      });

      setContent('');
      onQuestionPosted();
    } catch (err) {
      alert("Erreur lors de l'envoi de la question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-slate-700 rounded-3xl p-8">
      <h3 className="text-xl font-semibold text-white mb-6">Poser une question</h3>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Votre nom (optionnel)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full bg-slate-950 border border-slate-600 rounded-2xl px-5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      <div className="mb-5">
        <textarea
          placeholder="Posez votre question ici..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full bg-slate-950 border border-slate-600 rounded-3xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-y"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="w-full bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-4 rounded-2xl transition-all duration-200"
      >
        {loading ? 'Envoi en cours...' : 'Envoyer la question'}
      </button>
    </form>
  );
}