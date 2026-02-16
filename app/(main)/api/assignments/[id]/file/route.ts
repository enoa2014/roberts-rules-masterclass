import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { requireAuth, STUDENT_ROLES, TEACHER_ROLES } from "@/lib/authz";
import { sqlite } from "@/lib/db";

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

async function resolveAssignmentId(paramsPromise: Promise<{ id: string }>) {
  const params = await paramsPromise;
  const assignmentId = Number(params.id);
  if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
    return null;
  }
  return assignmentId;
}

function guessContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".doc":
      return "application/msword";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(STUDENT_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const assignmentId = await resolveAssignmentId(context.params);
  if (!assignmentId) {
    return toErrorResponse("INVALID_INPUT", "作业 ID 不合法", 400);
  }

  const assignment = sqlite
    .prepare(
      `SELECT id, user_id as userId, file_path as filePath
       FROM assignments
       WHERE id = ?
       LIMIT 1`,
    )
    .get(assignmentId) as { id: number; userId: number; filePath: string | null } | undefined;

  if (!assignment) {
    return toErrorResponse("NOT_FOUND", "作业不存在", 404);
  }

  const isTeacher = TEACHER_ROLES.includes(auth.ctx.role);
  if (!isTeacher && assignment.userId !== auth.ctx.userId) {
    return toErrorResponse("FORBIDDEN", "无权限访问该附件", 403);
  }

  if (!assignment.filePath) {
    return toErrorResponse("NOT_FOUND", "该作业无附件", 404);
  }

  const uploadsRoot = path.resolve(process.cwd(), "uploads");
  const absolutePath = path.resolve(process.cwd(), assignment.filePath);

  if (!absolutePath.startsWith(`${uploadsRoot}${path.sep}`)) {
    return toErrorResponse("FORBIDDEN", "附件路径不合法", 403);
  }

  let fileBuffer: Buffer;
  try {
    fileBuffer = await fs.readFile(absolutePath);
  } catch {
    return toErrorResponse("NOT_FOUND", "附件不存在", 404);
  }

  const fileName = path.basename(absolutePath);
  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      "content-type": guessContentType(absolutePath),
      "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    },
  });
}

export const runtime = "nodejs";
