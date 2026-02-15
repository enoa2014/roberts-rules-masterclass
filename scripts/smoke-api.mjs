const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000";
const inviteCode = process.env.SMOKE_INVITE_CODE || "SMOKE2026";

const users = {
  teacher: {
    username: process.env.SMOKE_TEACHER_USERNAME || "smoke_teacher",
    password: process.env.SMOKE_TEACHER_PASSWORD || "SmokePass123!",
  },
  admin: {
    username: process.env.SMOKE_ADMIN_USERNAME || "smoke_admin",
    password: process.env.SMOKE_ADMIN_PASSWORD || "SmokePass123!",
  },
  student: {
    username: process.env.SMOKE_STUDENT_USERNAME || "smoke_student",
    password: process.env.SMOKE_STUDENT_PASSWORD || "SmokePass123!",
  },
  registered: {
    username: process.env.SMOKE_REGISTERED_USERNAME || "smoke_registered",
    password: process.env.SMOKE_REGISTERED_PASSWORD || "SmokePass123!",
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ApiClient {
  constructor(name) {
    this.name = name;
    this.cookies = new Map();
  }

  cookieHeader() {
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }

  storeSetCookie(response) {
    const getSetCookie = response.headers.getSetCookie;
    let setCookies = [];

    if (typeof getSetCookie === "function") {
      setCookies = getSetCookie.call(response.headers);
    } else {
      const single = response.headers.get("set-cookie");
      if (single) {
        setCookies = [single];
      }
    }

    for (const cookieLine of setCookies) {
      const pair = cookieLine.split(";")[0];
      const eqIndex = pair.indexOf("=");
      if (eqIndex <= 0) {
        continue;
      }
      const key = pair.slice(0, eqIndex).trim();
      const value = pair.slice(eqIndex + 1).trim();
      this.cookies.set(key, value);
    }
  }

  async request(path, options = {}) {
    const url = `${baseUrl}${path}`;
    const headers = new Headers(options.headers || {});
    const cookie = this.cookieHeader();
    if (cookie) {
      headers.set("cookie", cookie);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      redirect: "manual",
    });

    this.storeSetCookie(response);

    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    return {
      status: response.status,
      headers: response.headers,
      data,
    };
  }

  async login(username, password) {
    const csrfResp = await this.request("/api/auth/csrf", { method: "GET" });
    if (csrfResp.status !== 200 || !csrfResp.data?.csrfToken) {
      throw new Error(`[${this.name}] 获取 csrf 失败: ${csrfResp.status}`);
    }

    const form = new URLSearchParams({
      csrfToken: csrfResp.data.csrfToken,
      username,
      password,
      callbackUrl: `${baseUrl}/`,
      json: "true",
    });

    const callbackResp = await this.request("/api/auth/callback/credentials?json=true", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: form,
    });

    if (callbackResp.status >= 400) {
      throw new Error(`[${this.name}] 登录失败: ${callbackResp.status}`);
    }

    const sessionResp = await this.request("/api/auth/session", { method: "GET" });
    if (sessionResp.status !== 200 || !sessionResp.data?.user?.id) {
      throw new Error(`[${this.name}] 会话校验失败: ${sessionResp.status}`);
    }

    return sessionResp.data.user;
  }
}

function ensureOk(resp, expectedStatuses, stepName) {
  if (!expectedStatuses.includes(resp.status)) {
    throw new Error(
      `${stepName} 失败: status=${resp.status}, body=${JSON.stringify(resp.data)}`,
    );
  }
  return resp.data;
}

function ensureStatus(resp, expectedStatus, stepName) {
  if (resp.status !== expectedStatus) {
    throw new Error(
      `${stepName} 失败: status=${resp.status}, expected=${expectedStatus}, body=${JSON.stringify(resp.data)}`,
    );
  }
}

async function openStreamAndReadOnce(client, sessionId) {
  const controller = new AbortController();

  const streamPromise = fetch(`${baseUrl}/api/interact/sessions/${sessionId}/stream`, {
    method: "GET",
    headers: {
      cookie: client.cookieHeader(),
      accept: "text/event-stream",
    },
    signal: controller.signal,
  });

  const response = await streamPromise;
  if (response.status !== 200 || !response.body) {
    throw new Error(`SSE 连接失败: ${response.status}`);
  }

  const reader = response.body.getReader();
  const first = await reader.read();
  controller.abort();

  if (first.done || !first.value || first.value.byteLength === 0) {
    throw new Error("SSE 首包为空");
  }
}

async function main() {
  console.log("[smoke:api] start", { baseUrl });

  const teacherClient = new ApiClient("teacher");
  const adminClient = new ApiClient("admin");
  const studentClient = new ApiClient("student");
  const registeredClient = new ApiClient("registered");

  const teacher = await teacherClient.login(users.teacher.username, users.teacher.password);
  console.log("[smoke:api] teacher login ok", teacher);
  const admin = await adminClient.login(users.admin.username, users.admin.password);
  console.log("[smoke:api] admin login ok", admin);

  await registeredClient.login(users.registered.username, users.registered.password);
  const inviteResp = await registeredClient.request("/api/invite/verify", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ code: inviteCode }),
  });
  ensureOk(inviteResp, [200], "邀请码升级");
  console.log("[smoke:api] invite verify ok");

  const student = await studentClient.login(users.student.username, users.student.password);
  console.log("[smoke:api] student login ok", student);

  const createSession = await teacherClient.request("/api/interact/sessions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ title: `smoke-${Date.now()}` }),
  });
  const createdSession = ensureOk(createSession, [201], "创建课堂");
  const sessionId = createdSession.id;
  console.log("[smoke:api] session created", { sessionId });

  await openStreamAndReadOnce(studentClient, sessionId);
  console.log("[smoke:api] sse stream ok");

  const activate = await teacherClient.request(`/api/interact/sessions/${sessionId}/status`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ status: "active" }),
  });
  ensureOk(activate, [200], "开始课堂");

  const muteOn = await teacherClient.request(`/api/interact/sessions/${sessionId}/mute`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ globalMute: true }),
  });
  ensureOk(muteOn, [200], "开启全员禁言");

  const handWhenMuted = await studentClient.request(`/api/interact/sessions/${sessionId}/hand`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ action: "raise" }),
  });
  ensureStatus(handWhenMuted, 422, "禁言状态举手应被拒绝");

  const muteOff = await teacherClient.request(`/api/interact/sessions/${sessionId}/mute`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ globalMute: false }),
  });
  ensureOk(muteOff, [200], "关闭全员禁言");

  const hand = await studentClient.request(`/api/interact/sessions/${sessionId}/hand`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ action: "raise" }),
  });
  ensureOk(hand, [200], "学员举手");

  const timerStart = await teacherClient.request(`/api/interact/sessions/${sessionId}/timer`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ action: "start", speakerId: Number(student.id), durationSec: 60 }),
  });
  ensureOk(timerStart, [200], "计时开始");

  await sleep(100);

  const timerStop = await teacherClient.request(`/api/interact/sessions/${sessionId}/timer`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ action: "stop" }),
  });
  ensureOk(timerStop, [200], "计时停止");

  const voteCreate = await teacherClient.request(`/api/interact/sessions/${sessionId}/vote`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      action: "create",
      question: "本次课堂节奏是否合适？",
      options: ["合适", "偏快", "偏慢"],
      multiple: false,
      anonymous: true,
    }),
  });
  const voteCreateData = ensureOk(voteCreate, [200], "创建投票");
  const pollId = voteCreateData.summary.pollId;
  const firstOptionId = voteCreateData.summary.options[0].id;

  const voteCast = await studentClient.request(`/api/interact/sessions/${sessionId}/vote`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ action: "cast", pollId, selected: [firstOptionId] }),
  });
  ensureOk(voteCast, [200], "学员投票");

  const voteClose = await teacherClient.request(`/api/interact/sessions/${sessionId}/vote`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ action: "close", pollId }),
  });
  ensureOk(voteClose, [200], "关闭投票");

  const assignment = await studentClient.request("/api/assignments", {
    method: "POST",
    body: (() => {
      const form = new FormData();
      form.append("lessonId", "rules-1");
      form.append("content", `smoke assignment at ${new Date().toISOString()}`);
      form.append("file", new Blob(["smoke file"], { type: "application/pdf" }), "smoke.pdf");
      return form;
    })(),
  });
  const assignmentData = ensureOk(assignment, [201], "提交作业");
  const assignmentId = assignmentData.assignment.id;
  if (!assignmentData.assignment.filePath) {
    throw new Error("提交作业失败: 附件路径为空");
  }

  const assignmentFile = await studentClient.request(`/api/assignments/${assignmentId}/file`, {
    method: "GET",
  });
  if (assignmentFile.status !== 200) {
    throw new Error(`下载作业附件失败: status=${assignmentFile.status}`);
  }

  const review = await teacherClient.request(`/api/assignments/${assignmentId}/review`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ status: "reviewed" }),
  });
  ensureOk(review, [200], "批阅作业");

  const feedback = await studentClient.request("/api/feedbacks", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      classSessionId: sessionId,
      rating: 5,
      content: "smoke feedback",
    }),
  });
  ensureOk(feedback, [201], "提交反馈");

  const post = await studentClient.request("/api/discussion/posts", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: "smoke post",
      content: "smoke discussion content",
    }),
  });
  const postData = ensureOk(post, [201], "发帖");
  const postId = postData.post.id;

  const comment = await studentClient.request("/api/discussion/comments", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ postId, content: "smoke comment" }),
  });
  const commentData = ensureOk(comment, [201], "评论");

  const moderation = await teacherClient.request("/api/admin/moderation/actions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      targetType: "comment",
      targetId: commentData.comment.id,
      action: "hide",
      reason: "smoke moderation",
    }),
  });
  ensureOk(moderation, [200], "治理评论");

  const kick = await teacherClient.request(`/api/interact/sessions/${sessionId}/kick`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      userId: Number(student.id),
      reason: "smoke kick",
    }),
  });
  ensureOk(kick, [200], "踢出学员");

  const handAfterKick = await studentClient.request(`/api/interact/sessions/${sessionId}/hand`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ action: "raise" }),
  });
  ensureStatus(handAfterKick, 403, "被踢出后应禁止举手");

  const end = await teacherClient.request(`/api/interact/sessions/${sessionId}/status`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ status: "ended" }),
  });
  ensureOk(end, [200], "结束课堂");

  const adminUsers = await adminClient.request("/api/admin/users", {
    method: "GET",
  });
  const adminUsersData = ensureOk(adminUsers, [200], "管理员查询用户");
  if (!Array.isArray(adminUsersData.users) || adminUsersData.users.length === 0) {
    throw new Error("管理员查询用户失败: users 为空");
  }

  const updateUserRole = await adminClient.request(`/api/admin/users/${student.id}/role`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ role: "student" }),
  });
  ensureOk(updateUserRole, [200], "管理员更新用户角色");

  const createInvite = await adminClient.request("/api/admin/invites", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ targetRole: "teacher", maxUses: 2 }),
  });
  const createInviteData = ensureOk(createInvite, [201], "管理员创建邀请码");
  if (createInviteData.invite.targetRole !== "teacher") {
    throw new Error("管理员创建邀请码失败: targetRole 不匹配");
  }
  const createdInviteId = createInviteData.invite.id;

  const revokeInvite = await adminClient.request(`/api/admin/invites/${createdInviteId}`, {
    method: "DELETE",
  });
  ensureOk(revokeInvite, [200], "管理员作废邀请码");

  const settingsGet = await adminClient.request("/api/admin/settings", {
    method: "GET",
  });
  const settingsData = ensureOk(settingsGet, [200], "管理员查询系统设置");

  const settingsPatch = await adminClient.request("/api/admin/settings", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      registrationEnabled: settingsData.settings.registrationEnabled,
      siteAnnouncement: settingsData.settings.siteAnnouncement,
    }),
  });
  ensureOk(settingsPatch, [200], "管理员更新系统设置");

  console.log("[smoke:api] all steps passed");
}

main().catch((error) => {
  console.error("[smoke:api] failed", error);
  process.exit(1);
});
