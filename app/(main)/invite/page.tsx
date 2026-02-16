"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Key, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

type ApiError = {
  error?: {
    code?: string;
    message?: string;
  };
};

export default function InvitePage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/invite/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const data = (await res.json()) as ApiError;
        throw new Error(data.error?.message || "邀请码无效");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "邀请码无效");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 gradient-hero">
      <div className="w-full max-w-lg animate-fadeInUp">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-10 md:p-12 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 relative">
            <div className="h-20 w-20 mx-auto gradient-primary rounded-3xl flex items-center justify-center shadow-glow animate-float">
              <Key className="h-10 w-10 text-white" />
            </div>
            <Sparkles className="absolute -right-2 -top-2 h-6 w-6 text-amber-400 animate-pulseSoft" />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
            输入邀请码
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            请输入你的老师或班主任提供的邀请码，<br className="hidden sm:block" />
            解锁全部课程内容与互动功能。
          </p>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 animate-fadeIn">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {success ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-8 animate-fadeInUp">
              <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-extrabold text-emerald-800 mb-2">欢迎加入！</h3>
              <p className="text-emerald-600">正在跳转课程首页...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="block w-full rounded-2xl border-2 border-gray-200 px-6 py-5 text-center text-2xl font-bold tracking-[0.3em] text-gray-900 shadow-sm
                           focus:border-primary focus:ring-4 focus:ring-primary/10
                           uppercase placeholder:text-gray-300 placeholder:tracking-[0.3em]
                           transition-all duration-200"
                  placeholder="CODE-123"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !code}
                className="button w-full text-lg h-14 rounded-xl"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    验证并加入 <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-8 text-xs text-gray-400 leading-relaxed">
            邀请码由你的班主任或管理员发放。<br />
            如需帮助，请联系 contact@yiqidu.com
          </p>
        </div>
      </div>
    </div>
  );
}
