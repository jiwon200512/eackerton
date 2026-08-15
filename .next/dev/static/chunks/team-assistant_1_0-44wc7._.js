(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/team-assistant_1/app/(protected)/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/lib/apiClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/EmptyState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/Spinner.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function HomePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [projects, setProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [taskStats, setTaskStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [creating, setCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [projectListError, setProjectListError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [inviteCode, setInviteCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [joining, setJoining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [joinError, setJoinError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadProjects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HomePage.useCallback[loadProjects]": async ()=>{
            setProjects(null);
            setProjectListError(null);
            try {
                const { projects: loadedProjects } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listProjects"])();
                setProjects(loadedProjects);
                const entries = await Promise.all(loadedProjects.map({
                    "HomePage.useCallback[loadProjects]": async (project)=>{
                        try {
                            const { tasks } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listTasks"])(project.id);
                            return [
                                project.id,
                                {
                                    total: tasks.length,
                                    done: tasks.filter({
                                        "HomePage.useCallback[loadProjects]": (task)=>task.status === "DONE"
                                    }["HomePage.useCallback[loadProjects]"]).length
                                }
                            ];
                        } catch  {
                            return [
                                project.id,
                                {
                                    total: 0,
                                    done: 0
                                }
                            ];
                        }
                    }
                }["HomePage.useCallback[loadProjects]"]));
                setTaskStats(Object.fromEntries(entries));
            } catch (caught) {
                setProjects([]);
                setProjectListError(caught instanceof __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? caught.message : "프로젝트를 불러오지 못했습니다.");
            }
        }
    }["HomePage.useCallback[loadProjects]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
            loadProjects();
        }
    }["HomePage.useEffect"], [
        loadProjects
    ]);
    async function handleCreate(event) {
        event.preventDefault();
        if (!name.trim()) return;
        setCreating(true);
        setError(null);
        try {
            const { project } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createProject"])(name.trim());
            router.push(`/projects/${project.id}/members`);
        } catch (caught) {
            setError(caught instanceof __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? caught.message : "프로젝트 생성에 실패했습니다.");
        } finally{
            setCreating(false);
        }
    }
    async function handleJoin(event) {
        event.preventDefault();
        if (!inviteCode.trim()) return;
        setJoining(true);
        setJoinError(null);
        try {
            const { projectId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["joinProjectByCode"])(inviteCode.trim());
            router.push(`/projects/${projectId}`);
        } catch (caught) {
            setJoinError(caught instanceof __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? caught.message : "참가에 실패했습니다.");
        } finally{
            setJoining(false);
        }
    }
    const activeProjects = projects?.filter((project)=>project.status === "ACTIVE") ?? [];
    const completedProjects = projects?.filter((project)=>project.status === "COMPLETED") ?? [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "max-w-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "page-eyebrow",
                        children: "EFFORTLY"
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl",
                        children: "팀의 진행 상황을 한눈에 확인하세요."
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base",
                        children: "대화와 회의 기록을 바탕으로 업무 현황과 팀원별 기여도를 정리합니다."
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-10 grid overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleCreate,
                        className: "p-5 sm:p-7 lg:border-r lg:border-slate-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "section-title",
                                children: "새 프로젝트"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-sm text-slate-500",
                                children: "프로젝트 이름을 입력하고 팀원 등록부터 시작하세요."
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-5 flex flex-col gap-2 sm:flex-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "project-name",
                                        "aria-label": "프로젝트 이름",
                                        value: name,
                                        onChange: (event)=>setName(event.target.value),
                                        placeholder: "예: 캠퍼스 디자인 프로젝트",
                                        className: "glass-input min-w-0 flex-1 rounded-xl px-4 py-3 text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: creating || !name.trim(),
                                        className: "btn-primary rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-50",
                                        children: creating ? "생성 중..." : "만들기"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                        lineNumber: 96,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                role: "alert",
                                className: "mt-2 text-sm text-rose-600",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                lineNumber: 98,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleJoin,
                        className: "border-t border-slate-200 p-5 sm:p-7 lg:border-t-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "section-title",
                                children: "초대 코드로 참가"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-sm text-slate-500",
                                children: "팀장이 공유한 코드를 입력하세요."
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-5 flex flex-col gap-2 sm:flex-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "invite-code",
                                        "aria-label": "초대 코드",
                                        value: inviteCode,
                                        onChange: (event)=>setInviteCode(event.target.value),
                                        placeholder: "예: AB12CD34",
                                        className: "glass-input min-w-0 flex-1 rounded-xl px-4 py-3 text-sm uppercase"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: joining || !inviteCode.trim(),
                                        className: "btn-secondary rounded-xl px-5 py-3 text-sm font-semibold text-[#6541f3] disabled:opacity-50",
                                        children: joining ? "참가 중..." : "참가하기"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            joinError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                role: "alert",
                                className: "mt-2 text-sm text-rose-600",
                                children: joinError
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                lineNumber: 108,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        title: "진행 중인 프로젝트",
                        count: projects ? activeProjects.length : null
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    projects === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "프로젝트를 불러오는 중..."
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 114,
                        columnNumber: 30
                    }, this) : projectListError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadError, {
                        message: projectListError,
                        onRetry: loadProjects
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 114,
                        columnNumber: 87
                    }, this) : projects.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "첫 프로젝트를 만들어보세요.",
                        description: "위에서 프로젝트 이름을 입력하고 시작할 수 있습니다."
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 114,
                        columnNumber: 177
                    }, this) : activeProjects.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "진행 중인 프로젝트가 없습니다.",
                        description: "새 프로젝트를 만들거나 종료된 프로젝트를 다시 시작할 수 있습니다."
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 114,
                        columnNumber: 292
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProjectList, {
                        projects: activeProjects,
                        taskStats: taskStats,
                        onOpen: (project)=>router.push(`/projects/${project.id}`)
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 114,
                        columnNumber: 387
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            projects !== null && !projectListError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        title: "종료된 프로젝트",
                        count: completedProjects.length,
                        muted: true
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this),
                    completedProjects.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "아직 종료된 프로젝트가 없습니다.",
                        description: "프로젝트를 종료하면 최종 결과를 이곳에서 확인할 수 있습니다."
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 120,
                        columnNumber: 45
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProjectList, {
                        projects: completedProjects,
                        taskStats: taskStats,
                        onOpen: (project)=>router.push(`/projects/${project.id}/result`),
                        completed: true
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                        lineNumber: 120,
                        columnNumber: 138
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                lineNumber: 118,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_s(HomePage, "U53b1qrKccnQyogkf2zY5xJssNQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = HomePage;
function LoadError({ message, onRetry }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-rose-100 bg-rose-50 p-6 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-rose-600",
                children: message
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                lineNumber: 128,
                columnNumber: 88
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onRetry,
                className: "btn-secondary mt-3 rounded-xl px-4 py-2 text-sm font-semibold",
                children: "다시 시도"
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                lineNumber: 128,
                columnNumber: 138
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
        lineNumber: 128,
        columnNumber: 10
    }, this);
}
_c1 = LoadError;
function SectionTitle({ title, count, muted = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-4 flex items-end justify-between gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: `text-xl font-bold tracking-tight ${muted ? "text-slate-600" : "text-slate-900"}`,
                children: title
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                lineNumber: 132,
                columnNumber: 69
            }, this),
            count !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-slate-400",
                children: [
                    "총 ",
                    count,
                    "개"
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                lineNumber: 132,
                columnNumber: 198
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
        lineNumber: 132,
        columnNumber: 10
    }, this);
}
_c2 = SectionTitle;
function ProjectList({ projects, taskStats, onOpen, completed = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        className: "overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-200",
        children: projects.map((project)=>{
            const stats = taskStats[project.id] ?? {
                total: 0,
                done: 0
            };
            const percentage = stats.total ? Math.round(stats.done / stats.total * 100) : 0;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>onOpen(project),
                    className: "group w-full p-5 text-left hover:bg-slate-50 sm:px-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "truncate text-sm font-bold text-slate-900 group-hover:text-[#6541f3]",
                                                    children: project.name
                                                }, void 0, false, {
                                                    fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 62
                                                }, this),
                                                completed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500",
                                                    children: "종료됨"
                                                }, void 0, false, {
                                                    fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 180
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                            lineNumber: 146,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-xs text-slate-400",
                                            children: completed && project.completedAt ? `종료 ${new Date(project.completedAt).toLocaleDateString("ko-KR")}` : `최근 업데이트 ${new Date(project.updatedAt).toLocaleDateString("ko-KR")}`
                                        }, void 0, false, {
                                            fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                            lineNumber: 147,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                    lineNumber: 145,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 text-sm text-slate-400 group-hover:text-[#6541f3]",
                                    children: "열기 →"
                                }, void 0, false, {
                                    fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                            lineNumber: 144,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `h-full rounded-full ${completed ? "bg-slate-400" : "bg-[#6541f3]"}`,
                                        style: {
                                            width: `${percentage}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                        lineNumber: 152,
                                        columnNumber: 89
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                    lineNumber: 152,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 text-xs text-slate-500",
                                    children: [
                                        "완료 ",
                                        stats.done,
                                        "/",
                                        stats.total,
                                        " · ",
                                        percentage,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                                    lineNumber: 153,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                            lineNumber: 151,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                    lineNumber: 143,
                    columnNumber: 13
                }, this)
            }, project.id, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
                lineNumber: 142,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/team-assistant_1/app/(protected)/page.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
_c3 = ProjectList;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "HomePage");
__turbopack_context__.k.register(_c1, "LoadError");
__turbopack_context__.k.register(_c2, "SectionTitle");
__turbopack_context__.k.register(_c3, "ProjectList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/team-assistant_1/components/EmptyState.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EmptyState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function EmptyState({ title, description, action }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-12 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-medium text-slate-700",
                children: title
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/EmptyState.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-slate-500",
                children: description
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/EmptyState.tsx",
                lineNumber: 13,
                columnNumber: 23
            }, this),
            action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3",
                children: action
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/EmptyState.tsx",
                lineNumber: 14,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/components/EmptyState.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = EmptyState;
var _c;
__turbopack_context__.k.register(_c, "EmptyState");
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

//# sourceMappingURL=team-assistant_1_0-44wc7._.js.map