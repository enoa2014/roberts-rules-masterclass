"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { PageShell } from "@/components/page-shell";

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
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, nickname }),
    });

    if (!response.ok) {
      const errorPayload = (await response.json()) as ApiError;
      setSubmitting(false);
      setMessage(errorPayload.error?.message || "注册失败");
      return;
    }

    const loginResult = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/invite",
    });

    setSubmitting(false);

    if (!loginResult || loginResult.error) {
      setMessage("注册成功，但自动登录失败，请手动登录");
      return;
    }

    router.push("/invite");
  }

  return (
    <PageShell title="注册" description="创建账号后即可输入邀请码成为学员。">
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="用户名（3-32位，仅字母数字_-）"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          minLength={3}
          maxLength={32}
        />
        <input
          className="input"
          type="password"
          placeholder="密码（至少8位）"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
        <input
          className="input"
          placeholder="昵称（可选）"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={32}
        />

        <button className="button" disabled={submitting} type="submit">
          {submitting ? "注册中..." : "注册并登录"}
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
