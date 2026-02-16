import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, STUDENT_ROLES, TEACHER_ROLES } from "@/lib/authz";
import { sqlite } from "@/lib/db";

const createAssignmentSchema = z
  .object({
    lessonId: z.string().min(1).max(64),
    content: z.string().max(5000).optional(),
    hasFile: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.content && !value.hasFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["content"],
        message: "content 与 file 至少需要一个",
      });
    }
  });

const ALLOWED_FILE_EXTENSIONS = new Set(["pdf", "docx", "doc", "jpg", "png"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_BY_EXTENSION: Record<string, Set<string>> = {
  pdf: new Set(["application/pdf"]),
  doc: new Set(["application/msword", "application/octet-stream"]),
  docx: new Set([
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "application/octet-stream",
  ]),
  jpg: new Set(["image/jpeg", "image/pjpeg"]),
  png: new Set(["image/png"]),
};

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

function normalizeFileName(filename: string) {
  return filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
}

async function persistAssignmentFile(file: File, userId: number) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!ALLOWED_FILE_EXTENSIONS.has(ext)) {
    return {
      ok: false as const,
      message: "附件类型不支持，仅允许 pdf/docx/doc/jpg/png",
      status: 400,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false as const,
      message: "附件大小不能超过 10MB",
      status: 400,
    };
  }

  const expectedMime = ALLOWED_MIME_BY_EXTENSION[ext];
  if (file.type && expectedMime && !expectedMime.has(file.type)) {
    return {
      ok: false as const,
      message: `附件 MIME 类型不匹配: ${file.type}`,
      status: 400,
    };
  }

  const safeName = normalizeFileName(file.name);
  const folder = path.join(process.cwd(), "uploads", "assignments", String(userId));
  await fs.mkdir(folder, { recursive: true });

  const fileName = `${Date.now()}-${safeName}`;
  const absolutePath = path.join(folder, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(absolutePath, bytes);

  return {
    ok: true as const,
    filePath: path.join("uploads", "assignments", String(userId), fileName),
  };
}

export async function GET(request: Request) {
  const auth = await requireAuth(STUDENT_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const url = new URL(request.url);
  const all = url.searchParams.get("all") === "true";
  const canViewAll = TEACHER_ROLES.includes(auth.ctx.role);

  const assignments = all && canViewAll
    ? sqlite
        .prepare(
          `SELECT a.id,
                  a.user_id as userId,
                  COALESCE(u.nickname, u.username, '学员-' || a.user_id) as nickname,
                  a.lesson_id as lessonId,
                  a.content,
                  a.file_path as filePath,
                  a.status,
                  a.reviewed_by as reviewedBy,
                  a.created_at as createdAt,
                  a.updated_at as updatedAt
           FROM assignments a
           JOIN users u ON u.id = a.user_id
           ORDER BY a.id DESC`,
        )
        .all()
    : sqlite
        .prepare(
          `SELECT id,
                  user_id as userId,
                  lesson_id as lessonId,
                  content,
                  file_path as filePath,
                  status,
                  reviewed_by as reviewedBy,
                  created_at as createdAt,
                  updated_at as updatedAt
           FROM assignments
           WHERE user_id = ?
           ORDER BY id DESC`,
        )
        .all(auth.ctx.userId);

  return NextResponse.json({
    success: true,
    assignments,
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth(STUDENT_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    const isMultipart = contentType.includes("multipart/form-data");
    let payload: {
      lessonId: string;
      content?: string;
      hasFile?: boolean;
    };
    let persistedFilePath: string | null = null;

    if (isMultipart) {
      const form = await request.formData();
      const rawLessonId = form.get("lessonId");
      const rawContent = form.get("content");
      const rawFile = form.get("file");

      payload = {
        lessonId: typeof rawLessonId === "string" ? rawLessonId : "",
        content: typeof rawContent === "string" ? rawContent : undefined,
      };

      if (rawFile instanceof File && rawFile.size > 0) {
        const saved = await persistAssignmentFile(rawFile, auth.ctx.userId);
        if (!saved.ok) {
          return toErrorResponse("INVALID_INPUT", saved.message, saved.status);
        }
        payload.hasFile = true;
        persistedFilePath = saved.filePath;
      }
    } else {
      const jsonPayload = await request.json();
      if (!jsonPayload || typeof jsonPayload !== "object") {
        return toErrorResponse("INVALID_INPUT", "作业参数不合法", 400);
      }

      payload = jsonPayload as {
        lessonId: string;
        content?: string;
        hasFile?: boolean;
      };
      // JSON 提交不允许客户端直接指定文件路径。
      if ("filePath" in payload) {
        return toErrorResponse("INVALID_INPUT", "filePath 不是可提交字段", 400);
      }
    }

    const parsed = createAssignmentSchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "作业参数不合法", 400);
    }

    const result = sqlite
      .prepare(
        `INSERT INTO assignments (user_id, lesson_id, content, file_path, status)
         VALUES (?, ?, ?, ?, 'submitted')`,
      )
      .run(
        auth.ctx.userId,
        parsed.data.lessonId,
        parsed.data.content ?? null,
        persistedFilePath,
      );

    const assignment = sqlite
      .prepare(
        `SELECT id,
                user_id as userId,
                lesson_id as lessonId,
                content,
                file_path as filePath,
                status,
                reviewed_by as reviewedBy,
                created_at as createdAt,
                updated_at as updatedAt
         FROM assignments
         WHERE id = ?
         LIMIT 1`,
      )
      .get(Number(result.lastInsertRowid));

    return NextResponse.json(
      {
        success: true,
        assignment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("create assignment error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
