import { sqlite } from "@/lib/db";
import type { UserRole } from "@/lib/schema";

type InviteErrorCode =
  | "CODE_INVALID"
  | "CODE_EXPIRED"
  | "CODE_EXHAUSTED"
  | "ALREADY_STUDENT"
  | "NOT_REGISTERED";

export type InviteVerifyResult =
  | { ok: true; role: UserRole }
  | { ok: false; code: InviteErrorCode; message: string };

export function verifyInviteCodeForUser(
  userId: number,
  inviteCode: string,
): InviteVerifyResult {
  const tx = sqlite.transaction((uid: number, code: string): InviteVerifyResult => {
    const user = sqlite
      .prepare(
        `SELECT id, role FROM users WHERE id = ? LIMIT 1`,
      )
      .get(uid) as { id: number; role: UserRole } | undefined;

    if (!user) {
      return {
        ok: false,
        code: "NOT_REGISTERED",
        message: "用户不存在",
      };
    }

    if (user.role !== "registered") {
      return {
        ok: false,
        code: "ALREADY_STUDENT",
        message: "当前账号已具备学员资格或无资格升级",
      };
    }

    const invite = sqlite
      .prepare(
        `SELECT id, max_uses, used_count, expires_at FROM invite_codes WHERE code = ? LIMIT 1`,
      )
      .get(code) as
      | {
          id: number;
          max_uses: number;
          used_count: number;
          expires_at: string | null;
        }
      | undefined;

    if (!invite) {
      return {
        ok: false,
        code: "CODE_INVALID",
        message: "邀请码不存在",
      };
    }

    const alreadyUsed = sqlite
      .prepare(
        `SELECT id FROM invite_code_uses WHERE code_id = ? AND user_id = ? LIMIT 1`,
      )
      .get(invite.id, uid) as { id: number } | undefined;

    if (alreadyUsed) {
      return {
        ok: false,
        code: "ALREADY_STUDENT",
        message: "该邀请码已使用",
      };
    }

    if (invite.expires_at) {
      const expired = Date.parse(invite.expires_at) <= Date.now();
      if (expired) {
        return {
          ok: false,
          code: "CODE_EXPIRED",
          message: "邀请码已过期",
        };
      }
    }

    if (invite.max_uses > 0 && invite.used_count >= invite.max_uses) {
      return {
        ok: false,
        code: "CODE_EXHAUSTED",
        message: "邀请码使用次数已满",
      };
    }

    const updateInvite = sqlite
      .prepare(
        `
          UPDATE invite_codes
          SET used_count = used_count + 1
          WHERE id = ?
            AND (max_uses = 0 OR used_count < max_uses)
            AND (expires_at IS NULL OR expires_at > datetime('now'))
        `,
      )
      .run(invite.id);

    if (updateInvite.changes !== 1) {
      return {
        ok: false,
        code: "CODE_EXHAUSTED",
        message: "邀请码已失效或次数已满",
      };
    }

    sqlite
      .prepare(
        `INSERT INTO invite_code_uses (code_id, user_id) VALUES (?, ?)`,
      )
      .run(invite.id, uid);

    sqlite
      .prepare(
        `UPDATE users SET role = 'student', updated_at = datetime('now') WHERE id = ?`,
      )
      .run(uid);

    return { ok: true, role: "student" };
  });

  return tx(userId, inviteCode.trim());
}
