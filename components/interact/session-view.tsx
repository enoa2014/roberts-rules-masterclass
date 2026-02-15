"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { HandRaiseQueue } from "@/components/interact/hand-raise-queue";
import { PollSystem } from "@/components/interact/poll-system";
import { Mic, Hand, StopCircle, PlayCircle, Loader2 } from "lucide-react";

type Role = "registered" | "student" | "teacher" | "admin" | "blocked";

type QueueItem = {
    id: number;
    userId: number;
    nickname: string;
    status: "queued" | "speaking" | "dismissed";
    raisedAt: string;
};

type PollState = {
    pollId: number;
    question: string;
    options: Array<{ id: number; label: string; count: number }>;
    status: "open" | "closed";
    totalVoters: number;
};

type SessionState = {
    session: {
        id: number;
        title: string;
        status: string;
        settings?: string | null;
    };
    queue: QueueItem[];
    activeTimer: {
        userId: number;
        nickname: string;
        durationSec: number;
        startedAt: string;
    } | null;
    openPoll: PollState | null;
};

interface SessionViewProps {
    sessionId: string;
}

export function SessionView({ sessionId }: SessionViewProps) {
    const { data: sessionData } = useSession();
    const role = (sessionData?.user?.role as Role | undefined) ?? "student";
    const currentUserId = Number(sessionData?.user?.id ?? 0);
    const isTeacher = role === "teacher" || role === "admin";

    const [state, setState] = useState<SessionState | null>(null);
    const [connected, setConnected] = useState(false);
    const sourceRef = useRef<EventSource | null>(null);

    const pollRole: "student" | "teacher" | "admin" =
        role === "teacher" || role === "admin" ? role : "student";

    // SSE Connection
    useEffect(() => {
        const connect = () => {
            const source = new EventSource(`/api/interact/sessions/${sessionId}/stream`);
            sourceRef.current = source;

            source.onopen = () => {
                console.log("SSE Connected");
                setConnected(true);
            };

            source.addEventListener("snapshot", (e) => {
                console.log("SSE Snapshot received", e.data);
                const data = JSON.parse(e.data);
                if (data && data.session) {
                    setState(data);
                }
            });

            source.addEventListener("session_updated", (e) => {
                console.log("SSE Update received", e.data);
                const data = JSON.parse(e.data);
                if (data && data.session) {
                    setState(prev => prev ? { ...prev, session: { ...prev.session, ...data.session } } : null);
                }
            });

            source.addEventListener("user_kicked", (e) => {
                const data = JSON.parse(e.data);
                if (data.userId === currentUserId) {
                    alert("您已被踢出课堂");
                    window.location.href = "/";
                }
            });

            source.addEventListener("settings_updated", (e) => {
                const data = JSON.parse(e.data);
                if (data && data.settings) {
                    setState(prev => prev ? { ...prev, session: { ...prev.session, settings: JSON.stringify(data.settings) } } : null);
                }
            });

            source.onerror = (e) => {
                console.error("SSE Error", e);
                setConnected(false);
                source.close();
                setTimeout(connect, 3000);
            };
        };

        connect();

        return () => {
            sourceRef.current?.close();
        };
    }, [sessionId, currentUserId]);

    const handleAction = async (
        action: "pick" | "stop_speech" | "raise" | "cancel",
        targetId?: number,
    ) => {
        // Teacher Picks Student -> Start Timer
        if (action === "pick" && targetId) {
            await fetch(`/api/interact/sessions/${sessionId}/timer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "start", speakerId: targetId, durationSec: 120 }),
            });
            return;
        }

        // Teacher Stops Speech -> Stop Timer
        if (action === "stop_speech") {
            await fetch(`/api/interact/sessions/${sessionId}/timer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "stop" }),
            });
            return;
        }

        // Student Raises Hand / Cancels Hand
        if (action === "raise" || action === "cancel") {
            await fetch(`/api/interact/sessions/${sessionId}/hand`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
        }
    };

    const handleCreateTestVote = async () => {
        await fetch(`/api/interact/sessions/${sessionId}/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "create",
                question: "测试投票：是否继续当前练习？",
                options: ["继续", "暂停"],
                multiple: false,
                anonymous: true,
            }),
        });
    };

    if (!state) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-gray-500">正在连接课堂...</p>
                </div>
            </div>
        );
    }

    // Determine student status
    const myHand = state.queue.find((h) => h.userId === currentUserId);
    const isSpeaking = state.activeTimer?.userId === currentUserId;
    const isCurrentUserRaised = state.queue.some((h) => h.userId === currentUserId);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div>
                    <h1 className="text-lg font-bold flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {connected ? '在线' : '离线'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${state.session.status === 'active' ? 'bg-blue-100 text-blue-700' :
                            state.session.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {state.session.status === 'active' ? '进行中' :
                                state.session.status === 'pending' ? '未开始' : '已结束'}
                        </span>
                        {state.session.title || '加载中...'}
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">Session ID: {sessionId}</p>
                </div>
                {isTeacher && (
                    <div className="flex gap-3">
                        {state.session.status === 'pending' && (
                            <button
                                onClick={async () => {
                                    await fetch(`/api/interact/sessions/${sessionId}/status`, {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ status: "active" }),
                                    });
                                }}
                                className="button bg-green-600 text-white hover:bg-green-700"
                            >
                                <PlayCircle className="mr-2 h-4 w-4" /> 开始课堂
                            </button>
                        )}
                        {state.session.status === 'active' && (
                            <>
                                <button
                                    onClick={async () => {
                                        await handleAction(isCurrentUserRaised ? "cancel" : "raise");
                                    }}
                                    className="button bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 text-xs px-2"
                                >
                                    {isCurrentUserRaised ? "取消测试举手" : "测试举手"}
                                </button>
                                <button
                                    onClick={handleCreateTestVote}
                                    className="button bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 text-xs px-2"
                                >
                                    测试投票
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!confirm("确定要结束课堂吗？")) return;
                                        await fetch(`/api/interact/sessions/${sessionId}/status`, {
                                            method: "PATCH",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ status: "ended" }),
                                        });
                                    }}
                                    className="button bg-white text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <StopCircle className="mr-2 h-4 w-4" /> 结束课堂
                                </button>
                            </>
                        )}
                        {state.session.status === 'ended' && (
                            <span className="text-gray-400 font-medium px-3 py-2 bg-gray-100 rounded-md">
                                课堂已结束
                            </span>
                        )}
                    </div>
                )}
            </header>

            {/* Content */}
            <div className="flex-1 p-6 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    {/* Main Area */}
                    <div className="lg:col-span-2 space-y-6 overflow-y-auto">
                        {/* Timer/Status */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="font-bold mb-4">当前环节</h3>
                            <div className="flex flex-col items-center justify-center bg-gray-900 text-white p-6 rounded-lg">
                                {state.activeTimer ? (
                                    <>
                                        <div className="text-4xl font-mono mb-2">
                                            发言中
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {state.activeTimer.nickname} 正在发言
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-2xl font-mono text-gray-400">00:00</div>
                                )}
                            </div>

                            {isTeacher && (
                                <div className="flex flex-col gap-2 mt-4 justify-center items-center">
                                    {state.activeTimer ? (
                                        <button
                                            onClick={() => handleAction("stop_speech")}
                                            className="button w-32 bg-white text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <StopCircle className="mr-2 h-4 w-4" /> 停止发言
                                        </button>
                                    ) : (
                                        <div className="text-xs text-gray-400">请从右侧队列点名发言</div>
                                    )}

                                    <div className="flex items-center gap-2 mt-2">
                                        <label className="text-sm text-gray-600 flex items-center gap-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={state.session.settings ? JSON.parse(state.session.settings).globalMute : false}
                                                onChange={async (e) => {
                                                    await fetch(`/api/interact/sessions/${sessionId}/mute`, {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ globalMute: e.target.checked })
                                                    });
                                                }}
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                            全员禁言
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Student Controls */}
                        {!isTeacher && (
                            <div className="bg-white p-6 rounded-xl border shadow-sm">
                                <h3 className="font-bold mb-4">我的互动</h3>
                                <div className="flex justify-center">
                                    {isSpeaking ? (
                                        <div className="text-green-600 font-bold flex items-center gap-2 animate-pulse">
                                            <Mic className="h-6 w-6" /> 您正在发言中...
                                        </div>
                                    ) : myHand ? (
                                        <button
                                            onClick={() => handleAction("cancel")}
                                            className="button w-full bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                                        >
                                            <Hand className="mr-2 h-4 w-4" /> 取消举手
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAction("raise")}
                                            className="button w-full"
                                        >
                                            <Hand className="mr-2 h-4 w-4" /> 举手发言
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Poll */}
                        <PollSystem
                            poll={state.openPoll}
                            role={pollRole}
                            onVote={async (optionId) => {
                                await fetch(`/api/interact/sessions/${state.session.id}/vote`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        action: "cast",
                                        pollId: state.openPoll?.pollId,
                                        selected: [optionId]
                                    })
                                });
                            }}
                        />

                        {/* Teacher Controls */}
                        {isTeacher && (
                            <div className="bg-white p-6 rounded-xl border shadow-sm">
                                <h3 className="font-bold mb-4">互动控制</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={async () => {
                                            await handleAction(isCurrentUserRaised ? "cancel" : "raise");
                                        }}
                                        className="p-4 border border-dashed rounded-lg hover:border-primary hover:text-primary transition-colors flex flex-col items-center gap-2"
                                    >
                                        <Hand className="h-6 w-6" /> {isCurrentUserRaised ? "取消测试举手" : "发起举手测试"}
                                    </button>
                                    <button
                                        onClick={handleCreateTestVote}
                                        className="p-4 border border-dashed rounded-lg hover:border-primary hover:text-primary transition-colors flex flex-col items-center gap-2"
                                    >
                                        <Mic className="h-6 w-6" /> 发起表决
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Side Area */}
                    <div className="h-full">
                        <HandRaiseQueue
                            queue={state.queue || []}
                            isTeacher={isTeacher}
                            onAction={handleAction}
                            classSessionId={state.session.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
