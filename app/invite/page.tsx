"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Key, ArrowRight, CheckCircle2 } from "lucide-react";

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
        throw new Error(data.error?.message || "Invalid invitation code");
      }

      setSuccess(true);
      // Short delay to show success state before redirect
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8 bg-white p-10 shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Key className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Enter Invitation Code
          </h2>
          <p className="text-gray-500">
            Please enter the invitation code provided by your teacher to access the course content.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-100">
            <div className="flex">
              <div className="text-sm font-medium text-red-800">{error}</div>
            </div>
          </div>
        )}

        {success ? (
          <div className="rounded-lg bg-green-50 p-6 text-center border border-green-100 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-green-800">Welcome Aboard!</h3>
            <p className="text-green-700 mt-2">Redirecting to course dashboard...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                required
                className="block w-full rounded-xl border-gray-300 px-6 py-4 text-center text-2xl font-bold tracking-widest text-gray-900 shadow-sm focus:border-primary focus:ring-primary uppercase placeholder:text-gray-300"
                placeholder="CODE-123"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code}
              className="button w-full text-lg h-14"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  Verify & Join <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
