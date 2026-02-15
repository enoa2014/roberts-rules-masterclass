import { sqlite } from "@/lib/db";
import type { UserRole } from "@/lib/schema";

type ServiceErrorCode =
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "STATE_INVALID";

type ServiceOk<T> = { ok: true; data: T };
type ServiceErr = { ok: false; code: ServiceErrorCode; message: string; status: number };

type ServiceResult<T> = ServiceOk<T> | ServiceErr;

type SessionRow = {
  id: number;
  title: string;
  status: "pending" | "active" | "ended";
  created_by: number;
  created_at: string;
  ended_at: string | null;
  settings: string | null;
};

type QueueRow = {
  id: number;
  userId: number;
  nickname: string;
  status: string;
  raisedAt: string;
};

type VoteSummary = {
  pollId: number;
  question: string;
  type: "single" | "multiple";
  anonymous: boolean;
  status: "open" | "closed";
  options: Array<{ id: number; label: string; count: number }>;
  totalVoters: number;
};

const teacherRoles: UserRole[] = ["teacher", "admin"];

function err(code: ServiceErrorCode, message: string, status = 400): ServiceErr {
  return { ok: false, code, message, status };
}

function getSessionById(sessionId: number) {
  return sqlite
    .prepare(
      `SELECT id, title, status, created_by, created_at, ended_at, settings FROM class_sessions WHERE id = ? LIMIT 1`,
    )
    .get(sessionId) as SessionRow | undefined;
}

function parseSessionSettings(raw: string | null) {
  if (!raw) {
    return {};
  }

  let current: unknown = raw;

  // Compatibility: some rows may have been double-serialized as JSON string.
  for (let i = 0; i < 2; i += 1) {
    if (typeof current !== "string") {
      break;
    }

    try {
      current = JSON.parse(current) as unknown;
    } catch {
      return {};
    }
  }

  if (current && typeof current === "object" && !Array.isArray(current)) {
    return current as Record<string, unknown>;
  }

  return {};
}

export function isUserBannedInSession(sessionId: number, userId: number) {
  const row = sqlite
    .prepare(
      `SELECT 1 as banned
       FROM session_bans
       WHERE class_session_id = ? AND user_id = ?
       LIMIT 1`,
    )
    .get(sessionId, userId) as { banned: number } | undefined;

  return Boolean(row?.banned);
}

export function isSessionGlobalMuteEnabled(sessionId: number) {
  const session = getSessionById(sessionId);
  if (!session) {
    return false;
  }

  const settings = parseSessionSettings(session.settings);
  return settings.globalMute === true;
}

function canManageSession(session: SessionRow, userId: number, role: UserRole) {
  return role === "admin" || session.created_by === userId || teacherRoles.includes(role);
}

function listQueue(sessionId: number) {
  return sqlite
    .prepare(
      `
      SELECT h.id,
             h.user_id as userId,
             COALESCE(u.nickname, u.username, '学员-' || h.user_id) as nickname,
             h.status,
             h.raised_at as raisedAt
      FROM hand_raises h
      JOIN users u ON u.id = h.user_id
      WHERE h.class_session_id = ?
        AND h.status IN ('queued', 'speaking')
      ORDER BY h.raised_at ASC, h.id ASC
    `,
    )
    .all(sessionId) as QueueRow[];
}

function resolveVoteSummary(pollId: number): VoteSummary | null {
  const poll = sqlite
    .prepare(
      `SELECT id, question, type, anonymous, status FROM polls WHERE id = ? LIMIT 1`,
    )
    .get(pollId) as
    | {
      id: number;
      question: string;
      type: "single" | "multiple";
      anonymous: 0 | 1;
      status: "open" | "closed";
    }
    | undefined;

  if (!poll) {
    return null;
  }

  const options = sqlite
    .prepare(
      `
        SELECT o.id,
               o.label,
               COUNT(v.id) as count
        FROM poll_options o
        LEFT JOIN poll_votes v ON o.id = v.option_id
        WHERE o.poll_id = ?
        GROUP BY o.id, o.label
        ORDER BY o.ord ASC
      `,
    )
    .all(pollId) as Array<{ id: number; label: string; count: number }>;

  const voters = sqlite
    .prepare(`SELECT COUNT(DISTINCT user_id) as totalVoters FROM poll_votes WHERE poll_id = ?`)
    .get(pollId) as { totalVoters: number };

  return {
    pollId: poll.id,
    question: poll.question,
    type: poll.type,
    anonymous: poll.anonymous === 1,
    status: poll.status,
    options,
    totalVoters: voters.totalVoters,
  };
}

export function createClassSession(input: {
  title: string;
  userId: number;
  role: UserRole;
}): ServiceResult<SessionRow> {
  if (!teacherRoles.includes(input.role)) {
    return err("FORBIDDEN", "仅教师或管理员可创建课堂", 403);
  }

  const title = input.title.trim();
  if (!title) {
    return err("INVALID_INPUT", "课堂标题不能为空", 400);
  }

  const result = sqlite
    .prepare(
      `INSERT INTO class_sessions (title, status, created_by) VALUES (?, 'pending', ?)`,
    )
    .run(title, input.userId);

  const row = getSessionById(Number(result.lastInsertRowid));
  if (!row) {
    return err("NOT_FOUND", "课堂创建失败", 500);
  }

  return { ok: true, data: row };
}

export function updateClassSessionStatus(input: {
  sessionId: number;
  status: "active" | "ended";
  userId: number;
  role: UserRole;
}): ServiceResult<SessionRow> {
  const session = getSessionById(input.sessionId);
  if (!session) {
    return err("NOT_FOUND", "课堂不存在", 404);
  }

  if (!canManageSession(session, input.userId, input.role)) {
    return err("FORBIDDEN", "无权限操作该课堂", 403);
  }

  if (session.status === "ended") {
    return err("STATE_INVALID", "课堂已结束，不能再变更状态", 422);
  }

  const endedAt = input.status === "ended" ? "datetime('now')" : "NULL";
  sqlite
    .prepare(
      `UPDATE class_sessions SET status = ?, ended_at = ${endedAt} WHERE id = ?`,
    )
    .run(input.status, input.sessionId);

  const updated = getSessionById(input.sessionId);
  if (!updated) {
    return err("NOT_FOUND", "课堂更新失败", 500);
  }

  return { ok: true, data: updated };
}

export function getClassSessionSnapshot(sessionId: number): ServiceResult<{
  session: SessionRow;
  queue: QueueRow[];
  activeTimer: {
    userId: number;
    nickname: string;
    durationSec: number;
    startedAt: string;
  } | null;
  openPoll: VoteSummary | null;
}> {
  const session = getSessionById(sessionId);
  if (!session) {
    return err("NOT_FOUND", "课堂不存在", 404);
  }

  const queue = listQueue(sessionId);

  const timer = sqlite
    .prepare(
      `
        SELECT t.user_id as userId,
               COALESCE(u.nickname, u.username, '学员-' || t.user_id) as nickname,
               t.duration_sec as durationSec,
               t.started_at as startedAt
        FROM speech_timers t
        JOIN users u ON u.id = t.user_id
        WHERE t.class_session_id = ?
          AND t.ended_at IS NULL
        ORDER BY t.id DESC
        LIMIT 1
      `,
    )
    .get(sessionId) as
    | {
      userId: number;
      nickname: string;
      durationSec: number;
      startedAt: string;
    }
    | undefined;

  const openPollRow = sqlite
    .prepare(
      `SELECT id FROM polls WHERE class_session_id = ? AND status = 'open' ORDER BY id DESC LIMIT 1`,
    )
    .get(sessionId) as { id: number } | undefined;

  const openPoll = openPollRow ? resolveVoteSummary(openPollRow.id) : null;

  return {
    ok: true,
    data: {
      session,
      queue,
      activeTimer: timer ?? null,
      openPoll,
    },
  };
}

export function handleHandAction(input: {
  sessionId: number;
  userId: number;
  action: "raise" | "cancel";
}): ServiceResult<{ action: "raise" | "cancel"; queue: QueueRow[]; position: number | null }> {
  const session = getSessionById(input.sessionId);
  if (!session) {
    return err("NOT_FOUND", "课堂不存在", 404);
  }

  if (isUserBannedInSession(input.sessionId, input.userId)) {
    return err("FORBIDDEN", "您已被移出该课堂", 403);
  }

  if (session.status !== "active") {
    return err("STATE_INVALID", "课堂未开始或已结束", 422);
  }

  if (input.action === "raise") {
    if (isSessionGlobalMuteEnabled(input.sessionId)) {
      return err("STATE_INVALID", "当前处于全员禁言状态", 422);
    }

    const existing = sqlite
      .prepare(
        `
          SELECT id, status
          FROM hand_raises
          WHERE class_session_id = ?
            AND user_id = ?
            AND status IN ('queued', 'speaking')
          ORDER BY id DESC
          LIMIT 1
        `,
      )
      .get(input.sessionId, input.userId) as { id: number; status: string } | undefined;

    if (!existing) {
      sqlite
        .prepare(
          `INSERT INTO hand_raises (class_session_id, user_id, status) VALUES (?, ?, 'queued')`,
        )
        .run(input.sessionId, input.userId);
    }

    const queue = listQueue(input.sessionId);
    const index = queue.findIndex((item) => item.userId === input.userId);
    return {
      ok: true,
      data: {
        action: "raise",
        queue,
        position: index >= 0 ? index + 1 : null,
      },
    };
  }

  sqlite
    .prepare(
      `
        UPDATE hand_raises
        SET status = 'cancelled', ended_at = datetime('now')
        WHERE class_session_id = ?
          AND user_id = ?
          AND status IN ('queued', 'speaking')
      `,
    )
    .run(input.sessionId, input.userId);

  return {
    ok: true,
    data: {
      action: "cancel",
      queue: listQueue(input.sessionId),
      position: null,
    },
  };
}

export function handleTimerAction(input: {
  sessionId: number;
  userId: number;
  role: UserRole;
  action: "start" | "stop";
  speakerId?: number;
  durationSec?: number;
}): ServiceResult<{
  action: "start" | "stop";
  timer: {
    userId: number;
    durationSec: number;
    startedAt: string;
    endedAt: string | null;
  } | null;
}> {
  const session = getSessionById(input.sessionId);
  if (!session) {
    return err("NOT_FOUND", "课堂不存在", 404);
  }

  if (!canManageSession(session, input.userId, input.role)) {
    return err("FORBIDDEN", "无权限操作该课堂", 403);
  }

  if (session.status !== "active") {
    return err("STATE_INVALID", "课堂未开始或已结束", 422);
  }

  if (input.action === "start") {
    if (!input.speakerId || !input.durationSec || input.durationSec <= 0) {
      return err("INVALID_INPUT", "计时参数无效", 400);
    }

    const tx = sqlite.transaction(() => {
      sqlite
        .prepare(
          `UPDATE speech_timers SET ended_at = datetime('now') WHERE class_session_id = ? AND ended_at IS NULL`,
        )
        .run(input.sessionId);

      sqlite
        .prepare(
          `UPDATE hand_raises SET status = 'done', ended_at = datetime('now')
           WHERE class_session_id = ? AND status = 'speaking' AND user_id != ?`,
        )
        .run(input.sessionId, input.speakerId);

      sqlite
        .prepare(
          `UPDATE hand_raises SET status = 'speaking', speaking_at = datetime('now')
           WHERE class_session_id = ? AND user_id = ? AND status = 'queued'`,
        )
        .run(input.sessionId, input.speakerId);

      sqlite
        .prepare(
          `INSERT INTO speech_timers (class_session_id, user_id, duration_sec, started_at)
           VALUES (?, ?, ?, datetime('now'))`,
        )
        .run(input.sessionId, input.speakerId, input.durationSec);

      return sqlite
        .prepare(
          `
            SELECT user_id as userId, duration_sec as durationSec, started_at as startedAt, ended_at as endedAt
            FROM speech_timers
            WHERE class_session_id = ? AND ended_at IS NULL
            ORDER BY id DESC
            LIMIT 1
          `,
        )
        .get(input.sessionId) as {
          userId: number;
          durationSec: number;
          startedAt: string;
          endedAt: string | null;
        };
    });

    return { ok: true, data: { action: "start", timer: tx() } };
  }

  const tx = sqlite.transaction(() => {
    const active = sqlite
      .prepare(
        `
          SELECT id, user_id as userId, duration_sec as durationSec, started_at as startedAt
          FROM speech_timers
          WHERE class_session_id = ? AND ended_at IS NULL
          ORDER BY id DESC
          LIMIT 1
        `,
      )
      .get(input.sessionId) as
      | {
        id: number;
        userId: number;
        durationSec: number;
        startedAt: string;
      }
      | undefined;

    if (!active) {
      return null;
    }

    sqlite
      .prepare(`UPDATE speech_timers SET ended_at = datetime('now') WHERE id = ?`)
      .run(active.id);

    sqlite
      .prepare(
        `
          UPDATE hand_raises
          SET status = 'done', ended_at = datetime('now')
          WHERE class_session_id = ? AND user_id = ? AND status = 'speaking'
        `,
      )
      .run(input.sessionId, active.userId);

    return {
      userId: active.userId,
      durationSec: active.durationSec,
      startedAt: active.startedAt,
      endedAt: new Date().toISOString(),
    };
  });

  return {
    ok: true,
    data: {
      action: "stop",
      timer: tx(),
    },
  };
}

export function handleVoteAction(input: {
  sessionId: number;
  userId: number;
  role: UserRole;
  action: "create" | "cast" | "close";
  question?: string;
  options?: string[];
  multiple?: boolean;
  anonymous?: boolean;
  pollId?: number;
  selected?: Array<number | string>;
}): ServiceResult<{
  action: "create" | "cast" | "close";
  summary: VoteSummary;
}> {
  const session = getSessionById(input.sessionId);
  if (!session) {
    return err("NOT_FOUND", "课堂不存在", 404);
  }

  if (session.status !== "active") {
    return err("STATE_INVALID", "课堂未开始或已结束", 422);
  }

  if (input.action === "create") {
    if (!teacherRoles.includes(input.role)) {
      return err("FORBIDDEN", "仅教师或管理员可发起投票", 403);
    }

    const question = input.question?.trim();
    const options = (input.options ?? []).map((opt) => opt.trim()).filter(Boolean);

    if (!question || options.length < 2) {
      return err("INVALID_INPUT", "投票题目与选项不合法", 400);
    }

    const tx = sqlite.transaction(() => {
      const pollInsert = sqlite
        .prepare(
          `
            INSERT INTO polls (class_session_id, question, type, anonymous, status, created_by)
            VALUES (?, ?, ?, ?, 'open', ?)
          `,
        )
        .run(
          input.sessionId,
          question,
          input.multiple ? "multiple" : "single",
          input.anonymous ? 1 : 0,
          input.userId,
        );

      const pollId = Number(pollInsert.lastInsertRowid);
      const insertOption = sqlite.prepare(
        `INSERT INTO poll_options (poll_id, label, ord) VALUES (?, ?, ?)`,
      );

      for (const [index, option] of options.entries()) {
        insertOption.run(pollId, option, index + 1);
      }

      return pollId;
    });

    const pollId = tx();
    const summary = resolveVoteSummary(pollId);

    if (!summary) {
      return err("NOT_FOUND", "投票创建失败", 500);
    }

    return { ok: true, data: { action: "create", summary } };
  }

  if (input.action === "cast") {
    if (!input.pollId) {
      return err("INVALID_INPUT", "缺少 pollId", 400);
    }

    const poll = sqlite
      .prepare(
        `
          SELECT id, type, status
          FROM polls
          WHERE id = ? AND class_session_id = ?
          LIMIT 1
        `,
      )
      .get(input.pollId, input.sessionId) as
      | { id: number; type: "single" | "multiple"; status: "open" | "closed" }
      | undefined;

    if (!poll) {
      return err("NOT_FOUND", "投票不存在", 404);
    }

    if (poll.status !== "open") {
      return err("STATE_INVALID", "投票已结束", 422);
    }

    const optionRows = sqlite
      .prepare(`SELECT id, label FROM poll_options WHERE poll_id = ? ORDER BY ord ASC`)
      .all(input.pollId) as Array<{ id: number; label: string }>;

    const selectedRaw = input.selected ?? [];
    const selectedIds = selectedRaw
      .map((item) => {
        if (typeof item === "number") {
          return item;
        }
        const found = optionRows.find((opt) => opt.label === item);
        return found?.id;
      })
      .filter((id): id is number => typeof id === "number");

    const dedupedSelected = [...new Set(selectedIds)];

    if (poll.type === "single" && dedupedSelected.length !== 1) {
      return err("INVALID_INPUT", "单选投票只能选择一个选项", 400);
    }

    if (poll.type === "multiple" && dedupedSelected.length < 1) {
      return err("INVALID_INPUT", "多选投票至少选择一个选项", 400);
    }

    const validOptionIds = new Set(optionRows.map((opt) => opt.id));
    for (const selected of dedupedSelected) {
      if (!validOptionIds.has(selected)) {
        return err("INVALID_INPUT", "存在无效选项", 400);
      }
    }

    const tx = sqlite.transaction(() => {
      sqlite
        .prepare(`DELETE FROM poll_votes WHERE poll_id = ? AND user_id = ?`)
        .run(input.pollId, input.userId);

      const insertVote = sqlite.prepare(
        `INSERT INTO poll_votes (poll_id, option_id, user_id) VALUES (?, ?, ?)`,
      );

      for (const optionId of dedupedSelected) {
        insertVote.run(input.pollId, optionId, input.userId);
      }
    });

    tx();

    const summary = resolveVoteSummary(input.pollId);
    if (!summary) {
      return err("NOT_FOUND", "投票结果获取失败", 500);
    }

    return { ok: true, data: { action: "cast", summary } };
  }

  if (!teacherRoles.includes(input.role)) {
    return err("FORBIDDEN", "仅教师或管理员可结束投票", 403);
  }

  if (!input.pollId) {
    return err("INVALID_INPUT", "缺少 pollId", 400);
  }

  const updateResult = sqlite
    .prepare(
      `
        UPDATE polls
        SET status = 'closed'
        WHERE id = ? AND class_session_id = ? AND status = 'open'
      `,
    )
    .run(input.pollId, input.sessionId);

  if (updateResult.changes !== 1) {
    return err("STATE_INVALID", "投票已关闭或不存在", 422);
  }

  const summary = resolveVoteSummary(input.pollId);
  if (!summary) {
    return err("NOT_FOUND", "投票不存在", 404);
  }

  return { ok: true, data: { action: "close", summary } };
}
