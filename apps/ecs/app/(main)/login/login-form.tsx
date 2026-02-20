"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, User, Lock, ArrowRight, GraduationCap } from "lucide-react";

type Props = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const safeCallbackUrl =
    callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/invite";

  async function handleUsernameLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: safeCallbackUrl,
      });

      if (res?.error) {
        setError("用户名或密码错误");
      } else {
        router.push(safeCallbackUrl);
      }
    } catch {
      setError("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-3xl shadow-soft border border-gray-100">
        {/* Left - Brand Panel */}
        <div className="hidden md:flex flex-col justify-center gradient-primary p-12 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold mb-4 leading-tight">
              掌握公共议事规则<br />提升公民核心素养
            </h2>
            <p className="text-white/90 leading-relaxed">
              从理论学习到模拟议事，全方位掌握罗伯特议事规则。加入我们，在实践中学会表达、倾听与决策。
            </p>
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
              欢迎回来
            </h2>
            <p className="mt-2 text-gray-500">
              登录你的账号，继续学习之旅
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 animate-fadeIn">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleUsernameLogin}>
            <div>
              <label className="label mb-1.5 block">用户名</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  data-testid="login-username"
                  className="input pl-11"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  data-testid="login-password"
                  className="input pl-11"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="login-submit"
              disabled={loading}
              className="button w-full h-12 text-base"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              登录
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">还没有账号？</span>{" "}
            <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">
              立即注册 <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
