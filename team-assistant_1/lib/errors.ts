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
  ownerRequired: () =>
    new AppError(
      "OWNER_REQUIRED",
      "팀장만 사용할 수 있는 기능입니다.",
      403
    ),
  memberNotRegistered: () =>
    new AppError(
      "MEMBER_NOT_REGISTERED",
      "팀장이 등록한 팀원 이름과 회원가입 실명이 일치하지 않습니다. 팀원 등록 이름을 확인해주세요.",
      409
    ),
  memberAlreadyClaimed: () =>
    new AppError(
      "MEMBER_ALREADY_CLAIMED",
      "같은 이름의 팀원이 이미 다른 계정과 연결되어 있습니다.",
      409
    ),
  ambiguousMemberName: () =>
    new AppError(
      "AMBIGUOUS_MEMBER_NAME",
      "같은 이름의 팀원이 여러 명 있어 자동으로 연결할 수 없습니다. 팀장에게 팀원 목록 확인을 요청해주세요.",
      409
    ),
  cannotDeleteOwner: () =>
    new AppError(
      "CANNOT_DELETE_OWNER",
      "팀장은 삭제할 수 없습니다. 먼저 다른 팀원에게 팀장을 양도해주세요.",
      409
    ),
  invalidTransferTarget: (message = "팀장 권한을 양도할 수 없는 팀원입니다.") =>
    new AppError("INVALID_TRANSFER_TARGET", message, 400),
  recordTooLarge: () =>
    new AppError(
      "RECORD_TOO_LARGE",
      "기록이 너무 깁니다. 50,000자 이하로 입력해주세요.",
      413
    ),
  aiTimeout: () =>
    new AppError(
      "AI_TIMEOUT",
      "AI 분석 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
      504
    ),
  invalidAvatar: () =>
    new AppError(
      "INVALID_AVATAR",
      "선택할 수 없는 프로필 아바타입니다.",
      400
    ),
  invalidCurrentPassword: () =>
    new AppError(
      "INVALID_CURRENT_PASSWORD",
      "현재 비밀번호가 올바르지 않습니다.",
      400
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
