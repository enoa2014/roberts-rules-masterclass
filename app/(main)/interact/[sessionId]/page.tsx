import { SessionView } from "@/components/interact/session-view";

export default async function SessionDetailPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await params;
    return <SessionView sessionId={sessionId} />;
}
