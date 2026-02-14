"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ApiError = {
  error?: {
    code?: string;
    message?: string;
  };
};

import { PageShell } from "@/components/page-shell";

export default function InvitePage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/invite/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as ApiError;
      setSubmitting(false);
      setMessage(payload.error?.message || "邀请码验证失败");
      return;
    }

    setSubmitting(false);
    setMessage("验证成功，正在跳转...");
    router.push("/");
  }

  return (
    <PageShell title="输入邀请码" description="输入教师发放的邀请码，立即升级为学员资格。">
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="请输入邀请码"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          required
        />
        <button className="button" disabled={submitting} type="submit">
          {submitting ? "验证中..." : "验证邀请码"}
        </button>
        {message ? (
          <p className={message.includes("成功") ? "message ok" : "message error"}>
            {message}
          </p>
        ) : null}
      </form>
    </PageShell>
  );
}
