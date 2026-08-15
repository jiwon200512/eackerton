"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import Spinner from "@/components/Spinner";
import { AVATAR_EMOJIS } from "@/lib/avatar";
import {
  getPasswordPolicyError,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/lib/auth/passwordPolicy";
import {
  ApiError,
  changePassword,
  getProfile,
  updateProfileAvatar,
  type ProfileUser,
} from "@/lib/apiClient";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    getProfile()
      .then(({ user }) => {
        if (active) setProfile(user);
      })
      .catch((error) => {
        if (active) {
          setMessage({
            tone: "error",
            text:
              error instanceof ApiError
                ? error.message
                : "프로필을 불러오지 못했습니다.",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function selectAvatar(avatarEmoji: string) {
    if (!profile || avatarSaving || profile.avatarEmoji === avatarEmoji) return;
    setAvatarSaving(true);
    setMessage(null);
    try {
      const result = await updateProfileAvatar(avatarEmoji);
      setProfile({ ...profile, avatarEmoji: result.avatarEmoji });
      setMessage({ tone: "success", text: "프로필 아바타가 저장되었습니다." });
      router.refresh();
    } catch (error) {
      setMessage({
        tone: "error",
        text:
          error instanceof ApiError
            ? error.message
            : "프로필 아바타를 저장하지 못했습니다.",
      });
    } finally {
      setAvatarSaving(false);
    }
  }

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (newPassword !== newPasswordConfirm) {
      setMessage({
        tone: "error",
        text: "새 비밀번호 확인이 일치하지 않습니다.",
      });
      return;
    }
    const policyError = getPasswordPolicyError(newPassword);
    if (policyError) {
      setMessage({ tone: "error", text: policyError });
      return;
    }
    if (currentPassword === newPassword) {
      setMessage({
        tone: "error",
        text: "새 비밀번호는 현재 비밀번호와 다르게 입력해주세요.",
      });
      return;
    }

    setPasswordSaving(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setMessage({ tone: "success", text: result.message });
    } catch (error) {
      setMessage({
        tone: "error",
        text:
          error instanceof ApiError
            ? error.message
            : "비밀번호를 변경하지 못했습니다.",
      });
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container flex min-h-[60vh] items-center justify-center">
        <Spinner label="프로필을 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="page-container max-w-4xl">
      <div>
        <p className="page-eyebrow">프로필</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          프로필 설정
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          동물 아바타와 비밀번호를 안전하게 관리하세요.
        </p>
      </div>

      {message && (
        <p
          role="status"
          className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
            message.tone === "success"
              ? "border-emerald-100 bg-emerald-50/75 text-emerald-700"
              : "border-rose-100 bg-rose-50/75 text-rose-600"
          }`}
        >
          {message.text}
        </p>
      )}

      {profile && (
        <>
          <section className="glass-card mt-7 rounded-2xl p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar
                emoji={profile.avatarEmoji}
                name={profile.name}
                size="xl"
              />
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-slate-900">
                  {profile.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-[#6541f3]">
                  @{profile.username}
                </p>
                <p className="mt-0.5 truncate text-sm text-slate-500">
                  {profile.email}
                </p>
              </div>
            </div>

            <dl className="mt-7 grid gap-3 sm:grid-cols-3">
              <ProfileField label="이름(실명)" value={profile.name} />
              <ProfileField label="아이디" value={profile.username} />
              <ProfileField label="이메일" value={profile.email} />
            </dl>
            <p className="mt-3 text-xs text-slate-400">
              실명은 프로젝트 팀원 자동 연결에 사용됩니다. 이번 버전에서는
              이름, 아이디, 이메일을 변경할 수 없습니다.
            </p>
          </section>

          <section className="glass-card mt-5 rounded-2xl p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  프로필 아바타
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Effortly에서 사용할 동물 친구를 선택하세요.
                </p>
              </div>
              {avatarSaving && (
                <span className="text-xs font-semibold text-[#6541f3]">
                  저장 중...
                </span>
              )}
            </div>
            <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-8">
              {AVATAR_EMOJIS.map((emoji) => {
                const selected = profile.avatarEmoji === emoji;
                return (
                  <button
                    key={emoji}
                    type="button"
                    aria-label={`${emoji} 아바타 선택`}
                    aria-pressed={selected}
                    onClick={() => selectAvatar(emoji)}
                    disabled={avatarSaving}
                    className={`relative flex aspect-square items-center justify-center rounded-full border text-2xl transition sm:text-3xl ${
                      selected
                        ? "border-[#6541f3] bg-violet-50 ring-4 ring-violet-100"
                        : "border-slate-200 bg-white hover:border-violet-300 hover:bg-slate-50"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {emoji}
                    {selected && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#6541f3] text-[10px] font-bold text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="glass-card mt-5 rounded-2xl p-5 sm:p-7">
            <h2 className="text-base font-bold text-slate-800">
              비밀번호 변경
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              새 비밀번호는 {PASSWORD_MIN_LENGTH}자 이상 입력해주세요.
            </p>
            <form
              onSubmit={submitPassword}
              className="mt-5 grid gap-4 sm:max-w-lg"
            >
              <PasswordField
                id="current-password"
                label="현재 비밀번호"
                value={currentPassword}
                onChange={setCurrentPassword}
                autoComplete="current-password"
              />
              <PasswordField
                id="new-password"
                label="새 비밀번호"
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />
              <PasswordField
                id="new-password-confirm"
                label="새 비밀번호 확인"
                value={newPasswordConfirm}
                onChange={setNewPasswordConfirm}
                autoComplete="new-password"
              />
              <button
                type="submit"
                disabled={
                  passwordSaving ||
                  !currentPassword ||
                  !newPassword ||
                  !newPasswordConfirm
                }
                className="btn-primary mt-1 w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 sm:w-fit sm:px-6"
              >
                {passwordSaving ? "변경 중..." : "비밀번호 변경"}
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-slate-200 pl-4 py-1">
      <dt className="text-[11px] font-semibold text-slate-400">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium text-slate-700">
        {value}
      </dd>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-slate-700">
      {label}
      <input
        id={id}
        type="password"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        minLength={id === "current-password" ? undefined : PASSWORD_MIN_LENGTH}
        maxLength={PASSWORD_MAX_LENGTH}
        className="glass-input mt-1.5 w-full rounded-xl px-4 py-2.5 text-sm"
      />
    </label>
  );
}
