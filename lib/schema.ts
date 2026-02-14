import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const roles = [
  "registered",
  "student",
  "teacher",
  "admin",
  "blocked",
] as const;
export const classSessionStatuses = ["pending", "active", "ended"] as const;
export const handRaiseStatuses = [
  "queued",
  "speaking",
  "done",
  "cancelled",
] as const;
export const pollTypes = ["single", "multiple"] as const;
export const pollStatuses = ["open", "closed"] as const;
export const assignmentStatuses = ["submitted", "reviewed"] as const;
export const discussionStatuses = ["visible", "hidden", "deleted"] as const;
export const moderationTargetTypes = ["post", "comment", "user"] as const;
export const moderationActions = ["hide", "delete", "block", "unblock"] as const;

export type UserRole = (typeof roles)[number];
export type ClassSessionStatus = (typeof classSessionStatuses)[number];
export type HandRaiseStatus = (typeof handRaiseStatuses)[number];
export type PollType = (typeof pollTypes)[number];
export type PollStatus = (typeof pollStatuses)[number];
export type AssignmentStatus = (typeof assignmentStatuses)[number];
export type DiscussionStatus = (typeof discussionStatuses)[number];
export type ModerationTargetType = (typeof moderationTargetTypes)[number];
export type ModerationAction = (typeof moderationActions)[number];

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  phone: text("phone").unique(),
  username: text("username").unique(),
  password: text("password"),
  nickname: text("nickname"),
  role: text("role").notNull().default("registered"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const inviteCodes = sqliteTable("invite_codes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  maxUses: integer("max_uses").notNull().default(0),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: text("expires_at"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const inviteCodeUses = sqliteTable(
  "invite_code_uses",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    codeId: integer("code_id").notNull().references(() => inviteCodes.id),
    userId: integer("user_id").notNull().references(() => users.id),
    usedAt: text("used_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => ({
    userCodeUnique: uniqueIndex("idx_invite_code_uses_unique").on(
      table.codeId,
      table.userId,
    ),
  }),
);

export const classSessions = sqliteTable(
  "class_sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    status: text("status").notNull().default("pending"),
    createdBy: integer("created_by").notNull().references(() => users.id),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    endedAt: text("ended_at"),
  },
);

export const handRaises = sqliteTable(
  "hand_raises",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    classSessionId: integer("class_session_id")
      .notNull()
      .references(() => classSessions.id),
    userId: integer("user_id").notNull().references(() => users.id),
    status: text("status").notNull().default("queued"),
    raisedAt: text("raised_at").notNull().default(sql`(datetime('now'))`),
    speakingAt: text("speaking_at"),
    endedAt: text("ended_at"),
  },
);

export const speechTimers = sqliteTable("speech_timers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  classSessionId: integer("class_session_id")
    .notNull()
    .references(() => classSessions.id),
  userId: integer("user_id").notNull().references(() => users.id),
  durationSec: integer("duration_sec").notNull(),
  startedAt: text("started_at").notNull(),
  endedAt: text("ended_at"),
});

export const polls = sqliteTable("polls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  classSessionId: integer("class_session_id")
    .notNull()
    .references(() => classSessions.id),
  question: text("question").notNull(),
  type: text("type").notNull(),
  anonymous: integer("anonymous").notNull().default(0),
  status: text("status").notNull().default("open"),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const pollOptions = sqliteTable(
  "poll_options",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pollId: integer("poll_id")
      .notNull()
      .references(() => polls.id),
    label: text("label").notNull(),
    ord: integer("ord").notNull(),
  },
  (table) => ({
    pollOrdUnique: uniqueIndex("idx_poll_options_unique").on(table.pollId, table.ord),
  }),
);

export const pollVotes = sqliteTable(
  "poll_votes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pollId: integer("poll_id")
      .notNull()
      .references(() => polls.id),
    optionId: integer("option_id")
      .notNull()
      .references(() => pollOptions.id),
    userId: integer("user_id").notNull().references(() => users.id),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => ({
    voteUnique: uniqueIndex("idx_poll_votes_unique").on(
      table.pollId,
      table.optionId,
      table.userId,
    ),
  }),
);

export const assignments = sqliteTable("assignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: text("lesson_id").notNull(),
  content: text("content"),
  filePath: text("file_path"),
  status: text("status").notNull().default("submitted"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const feedbacks = sqliteTable("feedbacks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  classSessionId: integer("class_session_id").references(() => classSessions.id),
  rating: integer("rating"),
  content: text("content"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const discussionPosts = sqliteTable("discussion_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title"),
  content: text("content").notNull(),
  status: text("status").notNull().default("visible"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const discussionComments = sqliteTable("discussion_comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id").notNull().references(() => discussionPosts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  status: text("status").notNull().default("visible"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const moderationLogs = sqliteTable("moderation_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  operatorId: integer("operator_id").notNull().references(() => users.id),
  targetType: text("target_type").notNull(),
  targetId: integer("target_id").notNull(),
  action: text("action").notNull(),
  reason: text("reason"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
