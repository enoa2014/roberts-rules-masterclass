import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { classSessions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { broadcast } from "@/lib/sse-hub";
import { getClassSessionSnapshot } from "@/lib/interact-service";

const bodySchema = z.object({
    globalMute: z.boolean(),
});

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { id: sessionIdStr } = await params;
    const sessionId = parseInt(sessionIdStr);
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
        return new NextResponse("Invalid session id", { status: 400 });
    }

    const isTeacher = session.user.role === "teacher" || session.user.role === "admin";
    if (!isTeacher) return new NextResponse("Forbidden", { status: 403 });

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) return new NextResponse("Invalid body", { status: 400 });

    const { globalMute } = parsed.data;

    try {
        // 1. Update session settings
        // SQLite doesn't support JSON_PATCH easily in lightweight mode, so we read-modify-write or just overwrite if it's simple
        // Since we only have one setting 'globalMute', we can just overwrite the JSON.
        const settings = { globalMute };

        await db.update(classSessions)
            .set({ settings })
            .where(eq(classSessions.id, sessionId));

        // 2. Broadcast settings update
        broadcast(sessionId, "settings_updated", { settings });
        const snapshot = getClassSessionSnapshot(sessionId);
        if (snapshot.ok) {
            broadcast(sessionId, "snapshot", snapshot.data);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Mute error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
