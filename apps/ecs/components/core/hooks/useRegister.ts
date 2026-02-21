"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type ApiError = {
    error?: {
        code?: string;
        message?: string;
    };
};

export function useRegister() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [registrationEnabled, setRegistrationEnabled] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [announcement, setAnnouncement] = useState("");

    useEffect(() => {
        void fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            const res = await fetch("/api/settings");
            if (!res.ok) {
                setRegistrationEnabled(false);
                return;
            }
            const data = await res.json();
            if (data.success) {
                setRegistrationEnabled(Boolean(data.settings?.registrationEnabled ?? false));
                setAnnouncement(String(data.settings?.siteAnnouncement ?? ""));
            } else {
                setRegistrationEnabled(false);
            }
        } catch (fetchError) {
            console.error("fetch settings error", fetchError);
            setRegistrationEnabled(false); // Default to closed on network errors
        } finally {
            setSettingsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (settingsLoading) {
            return;
        }

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
                body: JSON.stringify({ username, password, nickname: nickname || undefined }),
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

    return {
        username, setUsername,
        password, setPassword,
        nickname, setNickname,
        loading,
        error,
        registrationEnabled,
        settingsLoading,
        announcement,
        handleSubmit
    };
}
