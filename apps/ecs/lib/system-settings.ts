import { sqlite } from "@/lib/db";

type SettingsRow = {
  key: string;
  value: string;
};

export type SystemSettings = {
  registrationEnabled: boolean;
  siteAnnouncement: string;
};

const SETTING_KEYS = {
  registrationEnabled: "registration_enabled",
  siteAnnouncement: "site_announcement",
} as const;

const defaults: SystemSettings = {
  registrationEnabled: true,
  siteAnnouncement: "",
};

function readRows() {
  const rows = sqlite
    .prepare(
      `SELECT key, value
       FROM system_settings
       WHERE key IN (?, ?)`,
    )
    .all(SETTING_KEYS.registrationEnabled, SETTING_KEYS.siteAnnouncement) as SettingsRow[];

  return rows;
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }
  return value === "1" || value.toLowerCase() === "true";
}

export function getSystemSettings(): SystemSettings {
  const rows = readRows();
  const map = new Map(rows.map((row) => [row.key, row.value]));

  return {
    registrationEnabled: parseBoolean(
      map.get(SETTING_KEYS.registrationEnabled),
      defaults.registrationEnabled,
    ),
    siteAnnouncement: map.get(SETTING_KEYS.siteAnnouncement) ?? defaults.siteAnnouncement,
  };
}

export function updateSystemSettings(partial: Partial<SystemSettings>) {
  const current = getSystemSettings();
  const next: SystemSettings = {
    registrationEnabled:
      partial.registrationEnabled ?? current.registrationEnabled,
    siteAnnouncement: partial.siteAnnouncement ?? current.siteAnnouncement,
  };

  const tx = sqlite.transaction(() => {
    sqlite
      .prepare(
        `INSERT INTO system_settings (key, value, updated_at)
         VALUES (?, ?, datetime('now'))
         ON CONFLICT(key)
         DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
      )
      .run(
        SETTING_KEYS.registrationEnabled,
        next.registrationEnabled ? "1" : "0",
      );

    sqlite
      .prepare(
        `INSERT INTO system_settings (key, value, updated_at)
         VALUES (?, ?, datetime('now'))
         ON CONFLICT(key)
         DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
      )
      .run(SETTING_KEYS.siteAnnouncement, next.siteAnnouncement);
  });

  tx();

  return next;
}
