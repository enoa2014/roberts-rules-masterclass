"use client";

import { Hand, Mic, Ban } from "lucide-react";

type HandRaise = {
    id: number;
    userId: number;
    nickname: string;
    status: "queued" | "speaking" | "dismissed";
    raisedAt: string;
};

type Props = {
    queue: HandRaise[];
    isTeacher: boolean;
    onAction: (action: string, targetId?: number) => void;
    classSessionId: number;
};

export function HandRaiseQueue({ queue = [], isTeacher, onAction, classSessionId }: Props) {
    return (
        <div className="bg-white rounded-xl border shadow-sm h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold flex items-center gap-2">
                    <Hand className="h-4 w-4" /> 举手队列 ({queue.length})
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {queue.map((item) => (
                    <div key={item.id} className={`p-3 rounded-lg flex items-center justify-between ${item.status === 'speaking' ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-100'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${item.status === 'speaking' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                {item.nickname?.[0] || '?'}
                            </div>
                            <div>
                                <span className="font-medium text-sm">{item.nickname || '未知用户'}</span>
                                {item.status === 'speaking' && (
                                    <span className="ml-2 text-xs text-green-600 flex items-center gap-1">
                                        <Mic className="h-3 w-3 animate-pulse" /> 发言中
                                    </span>
                                )}
                            </div>
                        </div>

                        {isTeacher && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onAction("pick", item.userId)}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    title="点名发言"
                                >
                                    <Mic className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!confirm("确定要踢出该用户吗？")) return;
                                        await fetch(`/api/interact/sessions/${classSessionId}/kick`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ userId: item.userId })
                                        });
                                    }}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="踢出课堂"
                                >
                                    <Ban className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {queue.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-sm">
                        暂无举手学员
                    </div>
                )}
            </div>
        </div>
    );
}
