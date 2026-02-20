export type E2EAccount = {
  username: string;
  password: string;
};

export const e2eBaseURL = process.env.E2E_BASE_URL || "http://127.0.0.1:3000";
export const isRemoteE2E = Boolean(process.env.E2E_BASE_URL);

export const e2eAccounts = {
  admin: {
    username: process.env.E2E_ADMIN_USERNAME || "smoke_admin",
    password: process.env.E2E_ADMIN_PASSWORD || "SmokePass123!",
  },
  teacher: {
    username: process.env.E2E_TEACHER_USERNAME || "smoke_teacher",
    password: process.env.E2E_TEACHER_PASSWORD || "SmokePass123!",
  },
  student: {
    username: process.env.E2E_STUDENT_USERNAME || "smoke_student",
    password: process.env.E2E_STUDENT_PASSWORD || "SmokePass123!",
  },
} satisfies Record<"admin" | "teacher" | "student", E2EAccount>;

