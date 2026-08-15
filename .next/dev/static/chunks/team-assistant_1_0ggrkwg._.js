(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MembersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/lib/apiClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/Spinner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/Avatar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function MembersPage({ params }) {
    _s();
    const { projectId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [project, setProject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [members, setMembers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [role, setRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("MEMBER");
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [inviteCode, setInviteCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [inviteBusy, setInviteBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function load() {
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProject"])(projectId);
            setProject(res.project);
            setMembers(res.members);
            setRole(res.currentUserRole);
            if (res.currentUserRole === "OWNER" && res.project.status === "ACTIVE") {
                const { code } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInviteCode"])(projectId);
                setInviteCode(code);
            } else {
                setInviteCode(null);
            }
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : "프로젝트를 불러오지 못했습니다.");
        } finally{
            setLoading(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MembersPage.useEffect": ()=>{
            // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
            load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["MembersPage.useEffect"], [
        projectId
    ]);
    async function handleAdd(event) {
        event.preventDefault();
        if (!name.trim()) return;
        setBusy(true);
        setError(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addMember"])(projectId, name.trim());
            setName("");
            await load();
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : "팀원 추가에 실패했습니다.");
        } finally{
            setBusy(false);
        }
    }
    async function handleDelete(member) {
        const warning = member.claimed ? `${member.name}님을 삭제하면 프로젝트 접근 권한도 함께 제거되며 담당 Task는 미배정 처리됩니다. 계속하시겠습니까?` : `${member.name} 팀원을 삭제하시겠습니까?`;
        if (!window.confirm(warning)) return;
        setBusy(true);
        setError(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteMember"])(projectId, member.id);
            await load();
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : "팀원 삭제에 실패했습니다.");
        } finally{
            setBusy(false);
        }
    }
    async function handleTransfer(member) {
        if (!window.confirm(`${member.name}님에게 팀장 권한을 양도하시겠습니까?\n양도 후 팀원 관리 및 초대 권한은 새 팀장에게 넘어갑니다.`)) return;
        setBusy(true);
        setError(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transferProjectOwner"])(projectId, member.id);
            await load();
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : "팀장 양도에 실패했습니다.");
        } finally{
            setBusy(false);
        }
    }
    async function regenerateCode() {
        setInviteBusy(true);
        setCopied(false);
        try {
            const { code } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["regenerateInviteCode"])(projectId);
            setInviteCode(code);
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : "초대 코드를 재발급하지 못했습니다.");
        } finally{
            setInviteBusy(false);
        }
    }
    async function copyCode() {
        if (!inviteCode) return;
        try {
            await navigator.clipboard.writeText(inviteCode);
            setCopied(true);
            setTimeout(()=>setCopied(false), 1500);
        } catch  {
        // Code remains visible for manual copying.
        }
    }
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-[60vh] items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            label: "불러오는 중..."
        }, void 0, false, {
            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
            lineNumber: 129,
            columnNumber: 86
        }, this)
    }, void 0, false, {
        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
        lineNumber: 129,
        columnNumber: 23
    }, this);
    const isOwner = role === "OWNER";
    const isCompleted = project?.status === "COMPLETED";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-container max-w-4xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "page-eyebrow",
                        children: "팀원"
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl",
                        children: [
                            project?.name,
                            " 팀원 관리"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-slate-500",
                        children: "팀장이 등록한 실명과 회원가입 실명이 일치하면 초대 참가 시 자동으로 연결됩니다."
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-6 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600",
                children: "종료된 프로젝트입니다. 팀원 정보는 읽기 전용으로 제공됩니다."
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                lineNumber: 141,
                columnNumber: 23
            }, this),
            !isOwner && !isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-6 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-slate-600",
                children: "팀원 현황을 조회할 수 있습니다. 추가·삭제·초대 관리는 팀장만 가능합니다."
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                lineNumber: 142,
                columnNumber: 36
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "alert",
                className: "mt-4 text-sm text-rose-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                lineNumber: 143,
                columnNumber: 17
            }, this),
            isOwner && !isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "glass-card mt-7 rounded-2xl p-5 sm:p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-bold text-slate-800",
                                children: "초대 코드"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs text-slate-500",
                                children: "팀원이 회원가입 실명으로 자동 연결될 수 있도록 이 코드를 공유하세요."
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 flex flex-col gap-2 sm:flex-row sm:items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1 rounded-xl bg-violet-50 px-4 py-3 text-center font-mono text-lg font-bold tracking-[0.3em] text-[#6541f3]",
                                        children: inviteCode ?? "……"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: copyCode,
                                                disabled: !inviteCode,
                                                className: "btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold text-[#6541f3] disabled:opacity-50",
                                                children: copied ? "복사됨" : "복사"
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                                lineNumber: 152,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: regenerateCode,
                                                disabled: inviteBusy,
                                                className: "btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50",
                                                children: inviteBusy ? "재발급 중..." : "재발급"
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                                lineNumber: 153,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleAdd,
                        className: "glass-card mt-4 rounded-2xl p-5 sm:p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-slate-700",
                                htmlFor: "member-name",
                                children: "팀원 실명 추가"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "member-name",
                                        value: name,
                                        onChange: (event)=>setName(event.target.value),
                                        placeholder: "예: 박민수",
                                        className: "glass-input min-w-0 flex-1 rounded-xl px-4 py-2.5 text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                        lineNumber: 160,
                                        columnNumber: 44
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: busy || !name.trim(),
                                        className: "btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50",
                                        children: "추가"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                        lineNumber: 160,
                                        columnNumber: 224
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                lineNumber: 145,
                columnNumber: 35
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "glass-card mt-6 overflow-hidden rounded-2xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "divide-y divide-slate-200",
                    children: members.map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "flex flex-wrap items-center justify-between gap-3 px-5 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            emoji: member.avatarEmoji,
                                            name: member.name,
                                            size: "md"
                                        }, void 0, false, {
                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                            lineNumber: 167,
                                            columnNumber: 54
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-semibold text-slate-800",
                                                            children: member.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 176
                                                        }, this),
                                                        member.isLeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                            tone: "indigo",
                                                            children: "팀장"
                                                        }, void 0, false, {
                                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 271
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                            tone: member.claimed ? "green" : "slate",
                                                            children: member.claimed ? "참여 완료" : "초대 대기"
                                                        }, void 0, false, {
                                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 303
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 125
                                                }, this),
                                                member.claimedByMe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-[11px] text-[#6541f3]",
                                                    children: "내 계정"
                                                }, void 0, false, {
                                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 425
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                            lineNumber: 167,
                                            columnNumber: 120
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, this),
                                isOwner && !isCompleted && !member.isLeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        member.claimed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>handleTransfer(member),
                                            disabled: busy,
                                            className: "text-xs font-semibold text-[#6541f3] disabled:opacity-50",
                                            children: "팀장 양도"
                                        }, void 0, false, {
                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                            lineNumber: 168,
                                            columnNumber: 121
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>handleDelete(member),
                                            disabled: busy,
                                            className: "text-xs font-medium text-rose-500 disabled:opacity-50",
                                            children: "삭제"
                                        }, void 0, false, {
                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                            lineNumber: 168,
                                            columnNumber: 282
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                                    lineNumber: 168,
                                    columnNumber: 61
                                }, this)
                            ]
                        }, member.id, true, {
                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                            lineNumber: 166,
                            columnNumber: 36
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                    lineNumber: 165,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>router.push(isCompleted ? `/projects/${projectId}/result` : `/projects/${projectId}`),
                className: "btn-primary mt-6 ml-auto block rounded-xl px-5 py-2.5 text-sm font-semibold",
                children: isCompleted ? "최종 결과로 이동 →" : "대시보드로 이동 →"
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
_s(MembersPage, "F3cgXLxRmQnGNyYojf4LaQGrnik=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = MembersPage;
function Badge({ children, tone }) {
    const styles = {
        indigo: "bg-violet-50 text-[#6541f3]",
        green: "bg-emerald-50 text-emerald-700",
        slate: "bg-slate-100 text-slate-500"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles[tone]}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/members/page.tsx",
        lineNumber: 180,
        columnNumber: 10
    }, this);
}
_c1 = Badge;
var _c, _c1;
__turbopack_context__.k.register(_c, "MembersPage");
__turbopack_context__.k.register(_c1, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/team-assistant_1/components/Spinner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Spinner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Spinner({ label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 text-sm text-slate-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#6541f3]"
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/Spinner.tsx",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: label
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/Spinner.tsx",
                lineNumber: 5,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/components/Spinner.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = Spinner;
var _c;
__turbopack_context__.k.register(_c, "Spinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=team-assistant_1_0ggrkwg._.js.map