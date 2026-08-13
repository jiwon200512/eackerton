# Team Project Assistant

카카오톡 대화·회의 기록을 지속적으로 입력받아 기존 프로젝트 상태(Task/담당자/상태/Evidence)와 비교하며 누적 업데이트하고, 팀원별 기여도를 계산하는 해커톤 MVP입니다.

## 기술 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- Drizzle ORM + better-sqlite3 (SQLite, 로컬 파일 DB)
- Google Gemini API (`@google/genai`, structured JSON output via `responseJsonSchema`) — AI 분석
- Vitest — 단위/통합 테스트

> 원래 계획은 Prisma였으나, 이 실행 환경에서 Prisma의 엔진 바이너리 CDN(binaries.prisma.sh)이 네트워크 차단되어 있어 순수 JS 드라이버 기반의 Drizzle + better-sqlite3로 전환했습니다. 기능/스키마는 동일합니다.

#안녕하세요. 반갑습니다.

## 실행 방법

```bash
npm install
cp .env.example .env.local   # GEMINI_API_KEY 입력 (https://aistudio.google.com/apikey 에서 발급)
npm run db:migrate           # DB 마이그레이션 적용 (최초 1회, 이미 적용됨)
npm run seed                 # 데모 프로젝트("Team Project Assistant Demo") + 팀원 3명 생성
npm run dev                  # http://localhost:3000
```

테스트/빌드:

```bash
npm run test       # vitest (기여도 계산 unit test + 전체 파이프라인 integration test)
npm run typecheck  # 또는 npx tsc --noEmit
npm run build
```

## 환경 변수 (`.env.example` 참고)

| 변수 | 설명 |
|---|---|
| `GEMINI_API_KEY` | AI 분석에 사용하는 Google Gemini API 키. 없으면 분석 시 "AI 분석 서비스에 연결할 수 없습니다" 오류를 안전하게 반환합니다. |
| `GEMINI_MODEL` | 사용할 모델 (기본 `gemini-2.0-flash`, structured JSON output(`responseJsonSchema`) 지원 모델 필요) |
| `DATABASE_PATH` | SQLite 파일 경로 (기본 `./data/app.db`) |

## 핵심 데모 시나리오

1. 프로젝트 생성 → 팀원(김지원/박민수/이철수) 등록
2. 1차 기록 입력 ("로그인 페이지 내가 만들게" 등) → AI 분석 → Task 3개 생성
3. 2차 기록 입력 ("로그인 페이지 거의 다 만들었어" 등) → 기존 Task와 비교하여
   - 로그인 페이지: TODO → IN_PROGRESS
   - DB 연결: TODO → DONE
   - API 연동: 신규 Task 생성
   - 발표자료 제작: 변화 없음 (그대로 유지)
   - Evidence 누적, 기여도 재계산, Recent Changes 갱신

`npm run seed`로 프로젝트/팀원을 만든 뒤 위 대화를 "기록 추가" 화면에 붙여넣어 확인할 수 있습니다. `tests/demoScenario.integration.test.ts`가 이 시나리오 전체를 AI 호출만 mocking한 채 실제 API 라우트로 검증합니다.

## 코드 구조

```
app/
  page.tsx                              프로젝트 생성/선택 (화면 1)
  projects/[projectId]/
    members/page.tsx                    팀원 등록 (화면 2)
    page.tsx                            Dashboard (화면 3)
    tasks/[taskId]/page.tsx             Task 상세 (화면 4)
    records/new/page.tsx                기록 추가 (화면 5)
  api/projects/...                      Project/Member/Record/Task/Contribution API

services/
  parser/kakaoParser.ts                 카카오톡 txt / 수동 텍스트 파서 (정규식, fallback 지원)
  ai/
    systemPrompt.ts                     AI 시스템 프롬프트 (hallucination 방지 규칙 포함)
    buildContext.ts                     현재 프로젝트 상태 컨텍스트 생성
    analyzeRecord.ts                    Gemini 호출 (@google/genai)
    validate.ts                         AI 응답 런타임 검증/보정
    schema.ts                           zod 스키마 + structured output json schema (Gemini responseJsonSchema로 사용)
  tasks/applyEvents.ts                  검증된 이벤트를 DB 트랜잭션으로 반영
  contribution/calculate.ts             결정론적 기여도 계산 (LLM이 퍼센트를 정하지 않음)

lib/
  db/schema.ts, db/client.ts            Drizzle 스키마/커넥션
  types.ts, errors.ts, taskDto.ts, apiClient.ts

tests/
  contribution.test.ts                  기여도 계산 unit test
  demoScenario.integration.test.ts      핵심 데모 시나리오 end-to-end 통합 테스트
```

## DB 구조

Project 1—N Member, Project 1—N Record, Project 1—N Task 1—N Evidence, Project 1—N ContributionSnapshot, Record별 변경 로그(RecordChange, "최근 변경사항" 표시용). 상세 컬럼은 `lib/db/schema.ts` 참고.

## AI 분석 흐름

```
parseInput() → buildAIContext() → analyzeWithAI() → validateAIResult()
→ applyTaskEvents() (DB transaction) → calculateContribution() → saveSnapshot()
```

- AI는 이벤트(JSON)만 반환하고, 기여도 퍼센트는 코드가 결정합니다.
- 모든 AI 응답은 zod + 수동 검증을 거쳐 범위를 벗어난 값(잘못된 status enum, importance=99 등)을 정상 범위로 보정하거나 해당 이벤트를 폐기합니다.
- 확신도(confidence)가 낮은 상태/담당자 변경은 적용하지 않고 기존 값을 유지합니다.
- Task/Evidence/ContributionSnapshot/RecordChange는 하나의 SQLite 트랜잭션으로 함께 반영되어, 중간 실패 시 부분 반영을 방지합니다.

## 알려진 제한사항

- 공동 작업 기여도 분배 미지원 (spec대로 대표 담당자 1명 기준)
- 음성 STT, PDF 리포트, 실시간 연동(Slack/Github/Email) 등은 범위 밖
- 카카오톡 내보내기 포맷은 대표적인 몇 가지 패턴만 정규식으로 인식하며, 인식 실패 시 raw text를 그대로 AI에 전달하는 fallback으로 동작합니다.
- `GEMINI_API_KEY`가 없으면 분석 자체는 실행되지 않으며(사용자 친화적 오류만 반환), 이 세션의 클라우드 샌드박스는 `generativelanguage.googleapis.com`으로 나가는 아웃바운드가 막혀 있어 실제 키로 end-to-end를 검증하지 못했습니다 — 대신 AI 호출부만 mocking한 통합 테스트로 나머지 파이프라인 전체(파싱→검증→DB반영→기여도계산→스냅샷)를 검증했습니다. 로컬 환경에서는 정상적으로 API를 호출할 수 있습니다.
