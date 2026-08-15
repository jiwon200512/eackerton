import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  check,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { DEFAULT_AVATAR_EMOJI } from "@/lib/avatar";
import { PROJECT_STATUS } from "@/lib/projects/status";

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
  avatarEmoji: text("avatar_emoji")
    .notNull()
    .default(DEFAULT_AVATAR_EMOJI),
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
  status: text("status").notNull().default(PROJECT_STATUS.ACTIVE),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});

// Which authenticated users can access a project. Distinct from `members`
// below, which is just a name tag used for AI attribution/contribution and
// has no login of its own.
export const projectUsers = sqliteTable(
  "project_users",
  {
    id: id(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // OWNER | MEMBER
    role: text("role").notNull().default("MEMBER"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(strftime('%s','now') * 1000)`),
  },
  (table) => [
    uniqueIndex("project_users_project_id_user_id_idx").on(
      table.projectId,
      table.userId
    ),
  ]
);

// One active invite code per project; regenerating overwrites `code` in
// place rather than keeping old codes around.
export const inviteCodes = sqliteTable("invite_codes", {
  id: id(),
  projectId: text("project_id")
    .notNull()
    .unique()
    .references(() => projects.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});

export const members = sqliteTable(
  "members",
  {
    id: id(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    // Set once a real account "claims" this name tag by joining via invite
    // code and picking it - the member row's id (and every Task/Evidence
    // that already references it) stays the same, it just gains a real
    // owner. NULL means this is still just a placeholder name.
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(strftime('%s','now') * 1000)`),
  },
  (table) => [
    // SQLite treats each NULL as distinct, so this only blocks a user from
    // claiming two member rows in the same project - unclaimed (NULL) rows
    // are unaffected.
    uniqueIndex("members_project_id_user_id_idx").on(table.projectId, table.userId),
  ]
);

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

export const taskContributors = sqliteTable(
  "task_contributors",
  {
    id: id(),
    taskId: text("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    share: integer("share").notNull(),
    // AI | MANUAL. NULL means the row predates source tracking and is not
    // guessed as either source in the UI.
    source: text("source"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(strftime('%s','now') * 1000)`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(strftime('%s','now') * 1000)`),
  },
  (table) => [
    check(
      "task_contributors_share_check",
      sql`${table.share} >= 1 AND ${table.share} <= 100`
    ),
    uniqueIndex("task_contributors_task_id_member_id_idx").on(
      table.taskId,
      table.memberId
    ),
  ]
);

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

// Minimal audit trail for human Task edits. AI changes continue to live in
// record_changes because they belong to a Record; manual changes do not have
// a recordId, so keeping them separate avoids a destructive table rebuild.
export const manualTaskChanges = sqliteTable("manual_task_changes", {
  id: id(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  taskId: text("task_id").references(() => tasks.id, { onDelete: "set null" }),
  actorUserId: text("actor_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  taskTitle: text("task_title").notNull(),
  changeType: text("change_type").notNull(),
  summary: text("summary").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(strftime('%s','now') * 1000)`),
});
