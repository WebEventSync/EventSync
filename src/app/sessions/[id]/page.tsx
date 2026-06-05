import SessionDetail from '@/components/sessions/SessionDetail';

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 to-black pb-20">
      <SessionDetail sessionId={id} />
    </main>
  );
}