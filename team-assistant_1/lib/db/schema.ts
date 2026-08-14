import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

export const users = sqliteTable("users", {
  id: id(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});

export const sessions = sqliteTable("sessions", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});

export const projects = sqliteTable("projects", {
  id: id(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});

export const members = sqliteTable("members", {
  id: id(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});

// KAKAO_TEXT | MANUAL_TEXT
export const records = sqliteTable("records", {
  id: id(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'KAKAO_TEXT' | 'MANUAL_TEXT'
  rawContent: text("raw_content").notNull(),
  // PENDING | ANALYZING | COMPLETED | FAILED
  analysisStatus: text("analysis_status").notNull().default("PENDING"),
  analysisError: text("analysis_error"),
  analyzedAt: integer("analyzed_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});

// TODO | IN_PROGRESS | DONE
export const tasks = sqliteTable("tasks", {
  id: id(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  assigneeId: text("assignee_id").references(() => members.id, {
    onDelete: "set null",
  }),
  status: text("status").notNull().default("TODO"),
  importance: integer("importance").notNull().default(3),
  difficulty: integer("difficulty").notNull().default(3),
  workload: integer("workload").notNull().default(3),
  // last AI reasoning for this task, shown in detail view
  lastReason: text("last_reason"),
  // whether a human has manually edited title/assignee/status; once true,
  // AI analysis treats current value as authoritative and only overrides
  // with high-confidence explicit evidence.
  isDeleted: integer("is_deleted", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});

export const evidence = sqliteTable("evidence", {
  id: id(),
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  recordId: text("record_id")
    .notNull()
    .references(() => records.id, { onDelete: "cascade" }),
  speaker: text("speaker").notNull(),
  text: text("text").notNull(),
  timestamp: text("timestamp"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});

export const contributionSnapshots = sqliteTable("contribution_snapshots", {
  id: id(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  recordId: text("record_id").references(() => records.id, {
    onDelete: "set null",
  }),
  // JSON string: { memberId: { name, rawScore, percentage } }[]
  scores: text("scores").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});

// Human-readable log of what an AI analysis run changed, for the
// "Recent Changes" panel on the dashboard.
export const recordChanges = sqliteTable("record_changes", {
  id: id(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  recordId: text("record_id")
    .notNull()
    .references(() => records.id, { onDelete: "cascade" }),
  taskId: text("task_id"),
  taskTitle: text("task_title").notNull(),
  changeType: text("change_type").notNull(),
  // free-form human readable summary, e.g. "TODO → IN_PROGRESS"
  summary: text("summary").notNull(),
  reason: text("reason"),
  confidence: real("confidence"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});
