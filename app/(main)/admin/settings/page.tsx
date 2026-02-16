"use client";

import { useEffect, useState } from "react";

import { PageShell } from "@/components/page-shell";

type Settings = {
  registrationEnabled: boolean;
  siteAnnouncement: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    registrationEnabled: true,
    siteAnnouncement: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    void fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "加载设置失败");
      }
      setSettings(data.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载设置失败");
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "保存设置失败");
      }
      setSettings(data.settings);
      setSuccess("设置已保存");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存设置失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="系统设置" description="配置系统参数与全局通知">
      <div className="bg-white rounded-lg border shadow-sm mt-6 p-6 space-y-4">
        {loading && <p className="text-sm text-gray-500">加载中...</p>}

        {!loading && (
          <>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={settings.registrationEnabled}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    registrationEnabled: event.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
              开放新用户注册
            </label>

            <div>
              <label htmlFor="site-announcement" className="block text-sm font-medium text-gray-700 mb-1">
                全站公告（显示在注册页）
              </label>
              <textarea
                id="site-announcement"
                value={settings.siteAnnouncement}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    siteAnnouncement: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm h-28"
                maxLength={500}
                placeholder="例如：本周课堂安排已更新，请学员及时查看课程页。"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" className="button" disabled={saving} onClick={() => void saveSettings()}>
                {saving ? "保存中..." : "保存设置"}
              </button>
              <button
                type="button"
                className="button bg-white text-gray-700 border hover:bg-gray-50"
                onClick={() => void fetchSettings()}
              >
                重新加载
              </button>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
