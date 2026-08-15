# Effortly445

## 공동 Task 참여자와 기여도

Task는 한 명 또는 여러 명의 참여자를 지원합니다. `task_contributors`는 Task와 팀원을 연결하고 각 Task 내부의 정수 비율 `share`를 저장합니다. 동일한 Task/팀원 조합은 한 번만 저장되며, share는 1~100이고 한 Task의 전체 share 합은 애플리케이션에서 항상 100으로 검증합니다.

기존 `tasks.assignee_id`는 호환성을 위해 유지합니다. 연결된 contributor가 없는 기존 Task는 assignee를 100% 참여자로 계산합니다. 공동 Task는 `assignee_id`를 `NULL`로 두고 `task_contributors`를 authoritative 데이터로 사용합니다.

```text
TaskScore = importance*0.3 + difficulty*0.3 + workload*0.4
TaskWeightedScore = TaskScore * StatusMultiplier
MemberTaskScore = TaskWeightedScore * (share / 100)
Contribution(member) = MemberRawScore / AllMemberRawScore * 100

StatusMultiplier: TODO=0.2, IN_PROGRESS=0.6, DONE=1.0
```

AI는 Evidence를 바탕으로 Task 내부의 참여자와 상대 비율만 판단합니다. 메시지 수나 발언량은 계산 기준으로 사용하지 않으며, 최종 프로젝트 기여도는 서버의 결정적 계산 코드가 산출합니다. 잘못된 멤버와 share는 제거하고, 유효한 share의 합계만 어긋난 경우 largest-remainder 방식으로 합계 100이 되도록 정규화합니다.

공동작업 스키마를 적용하려면 배포 대상 환경에서 다음 명령을 실행하세요.

```bash
npm run db:migrate
```

## 설명 가능한 기여도와 프로젝트 활동

- `GET /api/projects/[projectId]/contribution/breakdown`은 기존 기여도 계산기와 동일한 내부 배분 결과를 사용해 팀원별 Task 점수, 상태 배율, 참여율과 MemberTaskScore를 반환합니다.
- `task_contributors.source`는 새 AI 판단을 `AI`, 사용자가 직접 저장한 참여 비율을 `MANUAL`로 기록합니다. 출처 추적 이전 행은 `NULL`로 유지해 출처를 임의로 추정하지 않습니다.
- `record_changes.confidence`가 `0.7` 미만인 AI 변경은 Dashboard의 확인 필요 목록에 표시하며, legacy `NULL` 값은 경고로 분류하지 않습니다.
- `GET /api/projects/[projectId]/activity`는 기존 Record, AI `record_changes`, 최소 수동 변경 로그를 시간순으로 합쳐 반환합니다.
- 수동 Task 변경은 Record와 연결되지 않으므로 `manual_task_changes`에 필요한 정보만 저장합니다. 별도의 범용 audit/notification 시스템은 추가하지 않습니다.

위 source와 수동 변경 로그를 추가하는 비파괴 migration은 `0007_keen_phil_sheldon.sql`입니다. 기존 프로젝트와 Task 데이터는 삭제하거나 backfill하지 않습니다.

## 프로젝트 종료와 최종 결과

프로젝트 OWNER는 대시보드의 `프로젝트 종료` 버튼으로 현재 기여도를 확정할 수 있습니다. 종료 처리는 한 트랜잭션에서 프로젝트를 `COMPLETED`로 전환하고 최종 기여도 스냅샷을 저장합니다. 종료된 프로젝트는 홈의 아카이브 영역과 `/projects/[projectId]/result`에서 조회할 수 있습니다.

- `POST /api/projects/[projectId]/complete`: OWNER 전용 종료 및 최종 스냅샷 저장
- `POST /api/projects/[projectId]/reopen`: OWNER 전용 재시작. 기존 스냅샷은 보존
- `GET /api/projects/[projectId]/contribution/history`: 접근 가능한 팀원의 기여도 이력 조회
- 종료 후에도 프로젝트, Task, Evidence, 기록, 기여도는 조회 가능
- 종료 후 기록 생성/분석, Task 수정/삭제, 팀원·초대·팀장 권한 변경, 초대 참가 요청은 서버에서 차단

DB 반영은 기존 데이터와 테이블을 삭제하지 않는 `0005_rich_northstar.sql` 마이그레이션을 사용합니다. 배포 전 다음 명령을 실행하세요.

```bash
npm run db:migrate
```

주요 검증 명령은 다음과 같습니다.

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

팀 대화 기록을 AI로 분석해 Task, Evidence, 기여도와 최근 변경사항을 관리하는 프로젝트 협업 서비스입니다.

## 기술 스택

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS
- Drizzle ORM, Turso/libSQL
- OpenAI Responses API와 Structured Outputs
- Vitest

## 로컬 실행

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run dev
```

Windows PowerShell에서 `npm` 실행 정책 오류가 발생하면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd run dev
```

앱은 `http://localhost:3000`에서 열립니다. 로컬 DB를 사용할 때는 `TURSO_DATABASE_URL`과 `TURSO_AUTH_TOKEN`을 비워 두면 `data/app.db`가 사용됩니다.

## 환경 변수

| 변수 | 설명 |
| --- | --- |
| `OPENAI_API_KEY` | OpenAI API 키. 없으면 기록 저장은 가능하지만 AI 분석은 실패합니다. |
| `OPENAI_MODEL` | Structured Outputs를 지원하는 모델. 기본값은 `gpt-5.4-mini`입니다. |
| `TURSO_DATABASE_URL` | 원격 Turso의 `libsql://...` URL. 개발 환경에서 비우면 로컬 파일 DB를 사용합니다. |
| `TURSO_AUTH_TOKEN` | 원격 Turso 인증 토큰입니다. |

실제 비밀값은 `.env.local`에만 저장하고 커밋하지 마세요. 운영 환경에서는 `TURSO_DATABASE_URL`이 필수이며, 원격 `libsql://` URL에는 `TURSO_AUTH_TOKEN`도 반드시 필요합니다.

## DB 준비와 기존 프로젝트 보정

```bash
npm run db:migrate
npm run backfill:owner-members
```

`backfill:owner-members`는 기존 프로젝트의 OWNER 계정을 기여도 계산용 팀원 행과 연결합니다. 이미 연결된 행은 건너뛰므로 여러 번 실행해도 안전합니다. 앱 시작 시 자동 실행하지 않습니다.

현재 DB 구조의 `project_users.role`(`OWNER`/`MEMBER`)과 `members.user_id`를 그대로 사용합니다. 별도의 LEADER 역할이나 역할 테이블은 추가하지 않습니다. UI에서는 OWNER를 “팀장”으로 표시합니다.

`0004_conscious_morlocks.sql` migration은 기존 `users` 행을 삭제하지 않고 `avatar_emoji` 컬럼만 `NOT NULL DEFAULT '🐶'`로 추가합니다. 기존 사용자와 신규 사용자 모두 기본 🐶 아바타를 사용합니다.

## 인증과 프로젝트 참여

- 회원가입은 실명, 아이디, 비밀번호, 이메일을 입력합니다.
- 로그인은 이메일이 아닌 아이디와 비밀번호를 사용합니다.
- 세션은 HttpOnly/SameSite 쿠키와 DB 세션으로 유지됩니다.
- 프로젝트를 만든 사용자는 OWNER가 되고 같은 트랜잭션에서 연결된 팀원 행도 생성됩니다.
- 초대 코드로 참여하려면 가입한 실명과 팀장이 미리 등록한 팀원 이름이 일치해야 합니다.
- 이름 비교는 앞뒤 공백, 연속 공백, 유니코드 전각/반각, 영문 대소문자 차이를 정규화합니다.
- 이름이 없거나 중복으로 모호하거나 이미 다른 계정에 연결됐으면 접근 권한을 새로 부여하지 않습니다.
- 과거 버전에서 이미 `project_users` 접근 권한만 가진 사용자의 권한은 제거하지 않습니다.

## 프로필

- `/profile`에서 16개의 동물 이모지 중 프로필 아바타를 선택할 수 있습니다.
- 서버는 공통 whitelist에 포함된 이모지만 저장합니다.
- 연결된 프로젝트 팀원, Task 담당자와 기여도 화면에도 같은 아바타가 표시됩니다.
- 이름, 아이디와 이메일은 조회만 가능하며 실명 기반 팀원 자동 연결을 보호하기 위해 수정하지 않습니다.
- 현재 비밀번호를 확인한 뒤 새 비밀번호로 변경할 수 있습니다. 기존 scrypt hashing과 현재 session 구조를 그대로 사용하므로 변경 후에도 현재 로그인은 유지됩니다.
- 이미지 업로드나 외부 이미지 저장소는 사용하지 않습니다.

## 팀장 권한

OWNER만 다음 작업을 할 수 있습니다.

- 팀원 추가 및 삭제
- 초대 코드 조회, 생성, 재발급
- 참여가 완료된 MEMBER에게 팀장 권한 양도

일반 MEMBER는 팀원 목록과 참여 상태만 조회할 수 있습니다. 팀장 본인은 삭제할 수 없고, 연결된 일반 팀원을 삭제하면 프로젝트 접근 권한도 함께 제거되며 해당 팀원의 Task 담당자는 미지정 상태가 됩니다. 팀장 양도 후에는 이전 팀장이 MEMBER로 바뀌며 프로젝트에는 OWNER가 정확히 한 명만 남습니다.

## 기록 분석 흐름

```text
기록 저장 → 대화 파싱 → 현재 Task 컨텍스트 구성 → OpenAI 분석
→ Zod 및 서버 규칙 검증 → Task/Evidence 반영 → 기여도 스냅샷 저장
```

안정성을 위해 다음 규칙을 적용합니다.

- 기록 원문은 최대 50,000자입니다.
- OpenAI 호출은 40초 후 중단합니다.
- 파서 fallback이 발생하거나 메시지가 0개면 원문 전체를 `UNKNOWN` 메시지로 전달합니다.
- AI 결과는 Zod 검증 후 이벤트 수와 Evidence 수를 제한합니다.
- CREATE가 아닌 이벤트의 Task ID가 현재 프로젝트에 없으면 버립니다.
- Evidence 문구가 원문에 실제로 존재하지 않거나 speaker가 허용되지 않으면 저장하지 않습니다.
- 중대한 변경에 유효한 Evidence가 없으면 이벤트를 적용하지 않습니다.
- 동일 기록의 같은 Evidence는 중복 저장하지 않습니다.
- 분석 상태를 원자적으로 선점해 동시 분석과 `ANALYZING` 고착을 방지합니다.
- Task, Evidence, 변경 로그, 기여도 스냅샷과 분석 완료 처리는 하나의 트랜잭션으로 반영됩니다.

기여도 변화량은 가장 최근 스냅샷과 바로 이전 스냅샷의 퍼센트 차이입니다. 리포트 화면은 실제 퍼센트 내림차순으로 표시합니다.

## 주요 API

- `GET /api/profile`: 로그인 사용자의 안전한 프로필 DTO 조회
- `PATCH /api/profile/avatar`: whitelist 동물 아바타 변경
- `POST /api/profile/password`: 현재 비밀번호 검증 후 비밀번호 변경
- `GET/POST /api/projects`: 프로젝트 목록 및 생성
- `POST /api/projects/join`: 초대 코드와 실명으로 프로젝트 참여
- `GET /api/projects/[projectId]`: 프로젝트 상세, 현재 사용자 역할과 팀원 조회
- `GET/POST /api/projects/[projectId]/members`: 팀원 조회 및 OWNER 전용 추가
- `DELETE /api/projects/[projectId]/members/[memberId]`: OWNER 전용 팀원 삭제
- `GET/POST /api/projects/[projectId]/invite-code`: OWNER 전용 초대 코드 조회/재발급
- `POST /api/projects/[projectId]/transfer-owner`: OWNER 권한 양도
- `POST /api/projects/[projectId]/records`: 기록 저장
- `POST /api/projects/[projectId]/records/[recordId]/analyze`: 기록 AI 분석
- `GET /api/projects/[projectId]/contribution`: 기여도와 직전 대비 변화량 조회

모든 프로젝트 API는 로그인 사용자와 프로젝트 접근 권한을 서버에서 확인합니다. 관리자 작업은 추가로 OWNER 역할을 검사합니다.

## 검증 명령

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

테스트에는 Profile 접근 제어, 아바타 whitelist와 팀원 DTO, 비밀번호 변경 후 로그인, 기여도 계산, AI 응답 검증과 fallback, 프로젝트 생성/실명 참여/팀장 양도/권한 차단/팀원 삭제, 전체 2회 기록 분석 시나리오가 포함됩니다.
