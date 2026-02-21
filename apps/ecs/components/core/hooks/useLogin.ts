"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useLogin(callbackUrl: string) {
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

    return {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleUsernameLogin,
    };
}
