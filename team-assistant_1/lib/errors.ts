// Central place for turning internal errors into user-friendly messages.
// Never leak stack traces or raw provider errors to the client.

export class AppError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const Errors = {
  unauthorized: () =>
    new AppError("UNAUTHORIZED", "로그인이 필요합니다.", 401),
  emptyInput: () =>
    new AppError("EMPTY_INPUT", "입력 내용이 비어 있습니다.", 400),
  noMembers: () =>
    new AppError(
      "NO_MEMBERS",
      "프로젝트에 팀원이 없습니다. 먼저 팀원을 등록해주세요.",
      400
    ),
  invalidKakaoFile: () =>
    new AppError(
      "INVALID_KAKAO_FILE",
      "카카오톡 대화 파일을 읽을 수 없습니다. txt 파일 형식을 확인해주세요.",
      400
    ),
  notFound: (what: string) =>
    new AppError("NOT_FOUND", `${what}을(를) 찾을 수 없습니다.`, 404),
  aiUnavailable: () =>
    new AppError(
      "AI_UNAVAILABLE",
      "AI 분석 서비스에 연결할 수 없습니다. API 키 설정을 확인해주세요.",
      502
    ),
  aiParsingFailed: () =>
    new AppError(
      "AI_PARSING_FAILED",
      "AI 응답을 해석하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
      502
    ),
  alreadyAnalyzed: () =>
    new AppError(
      "ALREADY_ANALYZED",
      "이미 분석된 기록입니다. 다시 분석하려면 재분석을 명시적으로 요청하세요.",
      409
    ),
  dbError: () =>
    new AppError(
      "DB_ERROR",
      "데이터를 저장하는 중 오류가 발생했습니다.",
      500
    ),
  invalidInviteCode: () =>
    new AppError(
      "INVALID_INVITE_CODE",
      "유효하지 않은 초대 코드입니다.",
      404
    ),
};

export function toErrorResponse(err: unknown): { status: number; body: { error: string; code: string } } {
  if (err instanceof AppError) {
    return { status: err.status, body: { error: err.message, code: err.code } };
  }
  console.error("Unhandled error:", err);
  return {
    status: 500,
    body: { error: "알 수 없는 오류가 발생했습니다.", code: "UNKNOWN" },
  };
}
