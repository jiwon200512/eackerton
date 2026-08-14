import { z } from "zod";

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

const usernameSchema = z
  .string()
  .transform(normalizeUsername)
  .pipe(
    z
      .string()
      .min(USERNAME_MIN_LENGTH, "아이디는 3자 이상 입력해주세요.")
      .max(USERNAME_MAX_LENGTH, "아이디는 30자 이하로 입력해주세요.")
      .regex(
        /^[a-z0-9._-]+$/,
        "아이디는 영문 소문자, 숫자, 마침표, 밑줄, 하이픈만 사용할 수 있습니다."
      )
  );

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "이름은 2자 이상 입력해주세요.")
      .max(50, "이름은 50자 이하로 입력해주세요."),
    username: usernameSchema,
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상 입력해주세요.")
      .max(128, "비밀번호는 128자 이하로 입력해주세요."),
    passwordConfirm: z.string(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("올바른 이메일 주소를 입력해주세요.")
      .max(254, "이메일 주소가 너무 깁니다."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, "비밀번호를 입력해주세요.").max(128),
});

export function firstValidationError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "입력값을 확인해주세요.";
}
