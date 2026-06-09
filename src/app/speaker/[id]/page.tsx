import SpeakerDetail from "@/components/SpeakerDetail/SpeakerDetail";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 to-black pb-20">
      <SpeakerDetail speakerId={id} />
    </main>
  );
}