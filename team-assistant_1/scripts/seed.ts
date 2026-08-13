/**
 * Demo seed script (spec #35): creates the demo project + 3 members so a
 * hackathon presentation can start straight from "add a record" instead of
 * manually typing project/member setup every time.
 *
 * This intentionally does NOT fake any Task/Evidence/Contribution data -
 * those only ever get created through the real AI analysis pipeline, so the
 * demo still proves the actual feature works end-to-end.
 *
 * Usage: npm run seed
 */
import { db } from "../lib/db/client";
import { members, projects } from "../lib/db/schema";
import { eq } from "drizzle-orm";

const DEMO_PROJECT_NAME = "Team Project Assistant Demo";
const DEMO_MEMBERS = ["김지원", "박민수", "이철수"];

const DEMO_RECORD_1 = `김지원: 로그인 페이지 내가 만들게.
박민수: 그러면 나는 DB 연결할게.
이철수: 발표자료는 내가 준비할게.`;

const DEMO_RECORD_2 = `김지원: 로그인 페이지 거의 다 만들었어.
박민수: DB 연결 완료했음.
김지원: API 연동도 내가 할게.`;

async function main() {
  const existing = await db
    .select()
    .from(projects)
    .where(eq(projects.name, DEMO_PROJECT_NAME));

  let project = existing[0];
  if (!project) {
    [project] = await db.insert(projects).values({ name: DEMO_PROJECT_NAME }).returning();
    console.log(`Created demo project: ${project.name} (${project.id})`);
  } else {
    console.log(`Demo project already exists: ${project.name} (${project.id})`);
  }

  const existingMembers = await db
    .select()
    .from(members)
    .where(eq(members.projectId, project.id));
  const existingNames = new Set(existingMembers.map((m) => m.name));

  for (const name of DEMO_MEMBERS) {
    if (existingNames.has(name)) continue;
    await db.insert(members).values({ projectId: project.id, name });
    console.log(`  + added member: ${name}`);
  }

  console.log("\nDemo setup complete. Next steps for the live demo:");
  console.log(`  1. Open the app and select "${DEMO_PROJECT_NAME}"`);
  console.log("  2. Go to 기록 추가 and paste the 1st record:\n");
  console.log(DEMO_RECORD_1.split("\n").map((l) => "     " + l).join("\n"));
  console.log("\n  3. Click AI로 분석하기, review the dashboard, then add the 2nd record:\n");
  console.log(DEMO_RECORD_2.split("\n").map((l) => "     " + l).join("\n"));
  console.log("\n  4. Analyze again and confirm task/contribution updates.\n");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
