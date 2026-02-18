"use client";

import { PlayCircle, StopCircle } from "lucide-react";

type SessionHeaderProps = {
  connected: boolean;
  status: string;
  title: string;
  sessionId: string;
  isTeacher: boolean;
  isCurrentUserRaised: boolean;
  onStartSession: () => Promise<void>;
  onToggleTestHand: () => Promise<void>;
  onCreateTestVote: () => Promise<void>;
  onEndSession: () => Promise<void>;
};

function resolveStatusLabel(status: string) {
  if (status === "active") {
    return "进行中";
  }
  if (status === "pending") {
    return "未开始";
  }
  return "已结束";
}

function resolveStatusClass(status: string) {
  if (status === "active") {
    return "bg-blue-100 text-blue-700";
  }
  if (status === "pending") {
    return "bg-gray-100 text-gray-700";
  }
  return "bg-red-100 text-red-700";
}

export function SessionHeader({
  connected,
  status,
  title,
  sessionId,
  isTeacher,
  isCurrentUserRaised,
  onStartSession,
  onToggleTestHand,
  onCreateTestVote,
  onEndSession,
}: SessionHeaderProps) {
  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {connected ? "在线" : "离线"}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${resolveStatusClass(status)}`}>
            {resolveStatusLabel(status)}
          </span>
          {title || "加载中..."}
        </h1>
        <p className="text-xs text-gray-400 mt-1">Session ID: {sessionId}</p>
      </div>
      {isTeacher && (
        <div className="flex gap-3">
          {status === "pending" && (
            <button
              onClick={() => {
                void onStartSession();
              }}
              className="button bg-green-600 text-white hover:bg-green-700"
              data-testid="start-session-button"
            >
              <PlayCircle className="mr-2 h-4 w-4" /> 开始课堂
            </button>
          )}
          {status === "active" && (
            <>
              <button
                onClick={() => {
                  void onToggleTestHand();
                }}
                className="button bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 text-xs px-2"
              >
                {isCurrentUserRaised ? "取消测试举手" : "测试举手"}
              </button>
              <button
                onClick={() => {
                  void onCreateTestVote();
                }}
                className="button bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 text-xs px-2"
              >
                测试投票
              </button>
              <button
                onClick={() => {
                  if (!confirm("确定要结束课堂吗？")) return;
                  void onEndSession();
                }}
                className="button bg-white text-red-600 border-red-200 hover:bg-red-50"
              >
                <StopCircle className="mr-2 h-4 w-4" /> 结束课堂
              </button>
            </>
          )}
          {status === "ended" && (
            <span className="text-gray-400 font-medium px-3 py-2 bg-gray-100 rounded-md">
              课堂已结束
            </span>
          )}
        </div>
      )}
    </header>
  );
}
