"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Smartphone, User, Lock, ArrowRight } from "lucide-react";

type Props = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"username" | "phone">("username");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Username Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Phone Form State (MVP: Placeholder for now, can implement mock later)
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  async function handleUsernameLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid credentials");
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  // MVP: Phone login not fully implemented in backend yet, just UI demo
  async function handlePhoneLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("Mobile login is coming in MVP+1");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setTab("username")}
            className={`flex-1 pb-4 text-sm font-medium ${tab === "username"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <span className="flex items-center justify-center gap-2">
              <User className="h-4 w-4" /> Account
            </span>
          </button>
          {/* Phone Login Hidden for MVP
          <button
            onClick={() => setTab("phone")}
            className={`flex-1 pb-4 text-sm font-medium ${
              tab === "phone"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Smartphone className="h-4 w-4" /> Mobile
            </span>
          </button>
          */}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {tab === "username" ? (
          <form className="mt-8 space-y-6" onSubmit={handleUsernameLogin}>
            <div className="space-y-4">
              <div>
                <label className="sr-only">Username</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="input pl-10"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="sr-only">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="input pl-10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>
        ) : (
          <div className="mt-8 text-center text-gray-500">
            Phone login is currently disabled.
          </div>
        )}

        <div className="text-center text-sm">
          <span className="text-gray-500">Don't have an account? </span>
          <Link href="/register" className="font-medium text-primary hover:text-primary/90">
            Register now <ArrowRight className="inline h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
