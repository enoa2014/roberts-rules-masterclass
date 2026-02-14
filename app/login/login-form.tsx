"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { PageShell } from "@/components/page-shell";

type Props = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: Props) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl,
    });

    setSubmitting(false);

    if (!result || result.error) {
      setMessage("登录失败，请检查用户名和密码");
      return;
    }

    router.push(result.url || callbackUrl);
  }

  return (
    <PageShell title="登录" description="使用用户名和密码登录平台。">
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="用户名"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          minLength={3}
        />
        <input
          className="input"
          type="password"
          placeholder="密码"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
        <button className="button" disabled={submitting} type="submit">
          {submitting ? "登录中..." : "登录"}
        </button>
        {message ? <p className="message error">{message}</p> : null}
      </form>
    </PageShell>
  );
}
