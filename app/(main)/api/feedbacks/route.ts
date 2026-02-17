import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, STUDENT_ROLES, TEACHER_ROLES } from "@/lib/authz";
import { sqlite } from "@/lib/db";

const bodySchema = z
  .object({
    classSessionId: z.coerce.number().int().positive().optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    content: z.string().max(2000).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.rating === undefined && !value.content) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rating"],
        message: "rating 和 content 至少填一项",
      });
    }
  });

const querySchema = z.object({
  classSessionId: z.coerce.number().int().positive().optional(),
  format: z.enum(["json", "csv"]).default("json"),
  limit: z.coerce.number().int().min(1).max(2000).default(300),
});

function toErrorResponse(code: string, message: string, status: number) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

type FeedbackRow = {
  id: number;
  userId: number;
  nickname: string;
  role: string;
  classSessionId: number | null;
  classSessionTitle: string | null;
  rating: number | null;
  content: string | null;
  createdAt: string;
};

function loadFeedbackRows(input: {
  classSessionId?: number;
  limit: number;
}) {
  const conditions: string[] = [];
  const params: Array<number> = [];

  if (input.classSessionId) {
    conditions.push("f.class_session_id = ?");
    params.push(input.classSessionId);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `SELECT f.id,
                      f.user_id as userId,
                      COALESCE(u.nickname, u.username, '学员-' || f.user_id) as nickname,
                      u.role as role,
                      f.class_session_id as classSessionId,
                      cs.title as classSessionTitle,
                      f.rating,
                      f.content,
                      f.created_at as createdAt
               FROM feedbacks f
               JOIN users u ON u.id = f.user_id
               LEFT JOIN class_sessions cs ON cs.id = f.class_session_id
               ${whereClause}
               ORDER BY f.id DESC
               LIMIT ?`;

  params.push(input.limit);
  return sqlite.prepare(sql).all(...params) as FeedbackRow[];
}

function escapeCsvCell(value: string | number | null) {
  if (value === null || value === undefined) {
    return "";
  }

  let text = String(value);
  // Prevent CSV/Spreadsheet formula injection when exported data is opened in Excel/Sheets.
  if (/^[\t\r\n ]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function toFeedbackCsv(rows: FeedbackRow[]) {
  const headers = [
    "id",
    "userId",
    "nickname",
    "role",
    "classSessionId",
    "classSessionTitle",
    "rating",
    "content",
    "createdAt",
  ];

  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.id,
        row.userId,
        row.nickname,
        row.role,
        row.classSessionId,
        row.classSessionTitle,
        row.rating,
        row.content,
        row.createdAt,
      ]
        .map((item) => escapeCsvCell(item as string | number | null))
        .join(","),
    );
  }
  return lines.join("\n");
}

export async function GET(request: Request) {
  const auth = await requireAuth(TEACHER_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    classSessionId: url.searchParams.get("classSessionId") ?? undefined,
    format: url.searchParams.get("format") ?? "json",
    limit: url.searchParams.get("limit") ?? "300",
  });

  if (!parsed.success) {
    return toErrorResponse("INVALID_INPUT", "查询参数不合法", 400);
  }

  const rows = loadFeedbackRows({
    classSessionId: parsed.data.classSessionId,
    limit: parsed.data.limit,
  });

  if (parsed.data.format === "csv") {
    const csv = toFeedbackCsv(rows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
          `feedbacks-${new Date().toISOString().slice(0, 10)}.csv`,
        )}`,
      },
    });
  }

  return NextResponse.json({
    success: true,
    feedbacks: rows,
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth(STUDENT_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "反馈参数不合法", 400);
    }

    const result = sqlite
      .prepare(
        `INSERT INTO feedbacks (user_id, class_session_id, rating, content)
         VALUES (?, ?, ?, ?)`,
      )
      .run(
        auth.ctx.userId,
        parsed.data.classSessionId ?? null,
        parsed.data.rating ?? null,
        parsed.data.content ?? null,
      );

    const feedback = sqlite
      .prepare(
        `SELECT id,
                user_id as userId,
                class_session_id as classSessionId,
                rating,
                content,
                created_at as createdAt
         FROM feedbacks
         WHERE id = ?
         LIMIT 1`,
      )
      .get(Number(result.lastInsertRowid));

    return NextResponse.json(
      {
        success: true,
        feedback,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("create feedback error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
