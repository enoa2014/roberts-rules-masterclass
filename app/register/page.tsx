"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, User, Lock, UserPlus, ArrowRight, Smile, GraduationCap } from "lucide-react";

type ApiError = {
  error?: {
    code?: string;
    message?: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    void fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrationEnabled(Boolean(data.settings?.registrationEnabled ?? true));
        setAnnouncement(String(data.settings?.siteAnnouncement ?? ""));
      }
    } catch (fetchError) {
      console.error("fetch settings error", fetchError);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!registrationEnabled) {
      setError("当前暂未开放注册，请联系管理员");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, nickname }),
      });

      if (!res.ok) {
        const data = (await res.json()) as ApiError;
        throw new Error(data.error?.message || "注册失败");
      }

      const loginRes = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push("/login?success=registered");
      } else {
        router.push("/invite");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "注册失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-3xl shadow-soft border border-gray-100">
        {/* Left - Brand Panel */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-800 p-12 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold mb-4 leading-tight">
              开启你的<br />议事规则学习旅程
            </h2>
            <p className="text-blue-100 leading-relaxed">
              注册账号后，使用邀请码加入课程。与志同道合的伙伴一起，在模拟议事中成长。
            </p>
            <div className="mt-8 flex gap-6 text-sm text-blue-200">
              <div>
                <div className="text-2xl font-bold text-white">12+</div>
                <div>精品课程</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div>活跃学员</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">98%</div>
                <div>好评率</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="md:hidden flex items-center gap-2 mb-6">
              <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-primary">议起读</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              创建账号
            </h2>
            <p className="mt-2 text-gray-500">
              填写信息，开始你的学习之旅
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 animate-fadeIn">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {announcement && (
            <div className="mb-6 rounded-xl bg-blue-50 border border-blue-100 p-4 animate-fadeIn">
              <p className="text-sm text-blue-700">{announcement}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label mb-1.5 block">用户名</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="input pl-11"
                  placeholder="字母、数字、下划线 (3-32位)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  maxLength={32}
                />
              </div>
            </div>

            <div>
              <label className="label mb-1.5 block">昵称 <span className="text-gray-400 font-normal">(可选)</span></label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Smile className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="input pl-11"
                  placeholder="你想让大家怎么称呼你？"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={32}
                />
              </div>
            </div>

            <div>
              <label className="label mb-1.5 block">密码</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="input pl-11"
                  placeholder="至少 8 个字符"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !registrationEnabled}
              className="button w-full h-12 text-base"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <UserPlus className="mr-2 h-4 w-4" />
              {registrationEnabled ? "注册并登录" : "注册已关闭"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">已有账号？</span>{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">
              去登录 <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
