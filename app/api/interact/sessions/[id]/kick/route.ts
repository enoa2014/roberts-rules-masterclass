import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sessionBans } from "@/lib/schema";
import { broadcast } from "@/lib/sse-hub";
import { sqlite } from "@/lib/db";
import { getClassSessionSnapshot } from "@/lib/interact-service";

const bodySchema = z.object({
    userId: z.coerce.number().int().positive(),
    reason: z.string().optional(),
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

    // Check permissions (Teacher/Admin only)
    const isTeacher = session.user.role === "teacher" || session.user.role === "admin";
    if (!isTeacher) return new NextResponse("Forbidden", { status: 403 });

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) return new NextResponse("Invalid body", { status: 400 });

    const { userId, reason } = parsed.data;

    try {
        // 1. Insert ban record
        await db.insert(sessionBans).values({
            classSessionId: sessionId,
            userId: userId,
            reason: reason || "Kicked by teacher",
            bannedBy: parseInt(session.user.id),
        });

        // 2. Remove user from queue and active timer immediately.
        sqlite
            .prepare(
                `UPDATE hand_raises
                 SET status = 'cancelled', ended_at = datetime('now')
                 WHERE class_session_id = ?
                   AND user_id = ?
                   AND status IN ('queued', 'speaking')`,
            )
            .run(sessionId, userId);

        sqlite
            .prepare(
                `UPDATE speech_timers
                 SET ended_at = datetime('now')
                 WHERE class_session_id = ?
                   AND user_id = ?
                   AND ended_at IS NULL`,
            )
            .run(sessionId, userId);

        // 3. Broadcast kick and latest snapshot.
        broadcast(sessionId, "user_kicked", { userId, reason });
        const snapshot = getClassSessionSnapshot(sessionId);
        if (snapshot.ok) {
            broadcast(sessionId, "snapshot", snapshot.data);
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (
            typeof error === "object" &&
            error !== null &&
            "source" in error &&
            "code" in error &&
            (error as { source?: string }).source === "sqlite_error" &&
            (error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE"
        ) {
            return NextResponse.json({ success: true, message: "Already banned" });
        }
        console.error("Kick error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
