import QuestionCard from './QuestionCard';

type Question = {
  id: string;
  content: string;
  authorName?: string;
  upvotes: number;
  createdAt: string;
};

export default function QuestionList({ 
  questions, 
  onUpvote, 
  votedQuestions 
}: { 
  questions: Question[]; 
  onUpvote: (id: string) => void; 
  votedQuestions: Set<string>;
}) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        Aucune question pour le moment.<br />Soyez le premier à en poser une !
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          onUpvote={() => onUpvote(q.id)}
          hasVoted={votedQuestions.has(q.id)}
        />
      ))}
    </div>
  );
}