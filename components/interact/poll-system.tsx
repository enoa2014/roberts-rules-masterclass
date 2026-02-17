"use client";

import { useState } from "react";
import { Loader2, PieChart } from "lucide-react";

type Poll = {
    pollId: number;
    question: string;
    options: Array<{ id: number; label: string; count: number }>;
    status: "open" | "closed";
    totalVoters: number;
};

type Props = {
    poll: Poll | null;
    role: "student" | "teacher" | "admin";
    onVote: (optionId: number) => void;
};

export function PollSystem({ poll, role, onVote }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const [votedPollId, setVotedPollId] = useState<number | null>(null);

    const handleVote = async (optionId: number) => {
        setSubmitting(true);
        await onVote(optionId);
        setVotedPollId(poll?.pollId ?? null);
        setSubmitting(false);
    };

    if (!poll) {
        return (
            <div className="bg-white rounded-xl border shadow-sm p-6 flex items-center justify-center text-gray-400 h-64">
                暂无投票
            </div>
        );
    }

    const hasVoted = poll ? votedPollId === poll.pollId : false;

    return (
        <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg text-primary">
                    <PieChart className="h-5 w-5" />
                </div>
                <h3 className="font-bold">实时表决</h3>
                {poll.status === 'open' && (
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">
                        进行中
                    </span>
                )}
            </div>

            <p className="font-medium text-lg mb-6 text-gray-800">
                {poll.question}
            </p>

            {/* Student View: Voting Options */}
            {role === 'student' && !hasVoted && poll.status === 'open' && (
                <div className="space-y-3">
                    {poll.options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleVote(option.id)}
                            disabled={submitting}
                            className="w-full text-left p-4 rounded-lg border-2 border-gray-100 hover:border-primary hover:bg-blue-50 transition-all font-medium text-gray-700 flex justify-between items-center group"
                        >
                            {option.label}
                            {submitting && <Loader2 className="h-4 w-4 animate-spin text-primary opacity-0 group-hover:opacity-100" />}
                        </button>
                    ))}
                </div>
            )}

            {/* Results View (Teacher or Voted Student) */}
            {(role === 'teacher' || role === 'admin' || hasVoted || poll.status === 'closed') && (
                <div className="space-y-4">
                    {poll.options.map((option) => {
                        const count = option.count;
                        const percentage = poll.totalVoters > 0
                            ? Math.round((count / poll.totalVoters) * 100)
                            : 0;

                        return (
                            <div key={option.id} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-gray-500">{count} 票 ({percentage}%)</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500 ease-out"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <div className="pt-4 text-center text-sm text-gray-400">
                        共收到 {poll.totalVoters} 票
                    </div>
                </div>
            )}
        </div>
    );
}
