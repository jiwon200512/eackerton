(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/lib/apiClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/StatusBadge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$ContributionBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/ContributionBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/EmptyState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/Spinner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$TaskContributors$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/TaskContributors.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const CHANGE_TYPE_LABEL = {
    TASK_CREATE: "신규 Task 생성",
    TASK_STATUS_CHANGE: "상태 변경",
    TASK_ASSIGNEE_CHANGE: "담당자 변경",
    TASK_CONTRIBUTORS_CHANGE: "참여자 변경",
    TASK_UPDATE: "정보 업데이트",
    EVIDENCE_ADD: "근거 추가"
};
function DashboardPage({ params }) {
    _s();
    const { projectId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [project, setProject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [members, setMembers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [contribution, setContribution] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [changes, setChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [lowConfidenceChanges, setLowConfidenceChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activityVisibleCount, setActivityVisibleCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(8);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [role, setRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("MEMBER");
    const [completing, setCompleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DashboardPage.useCallback[load]": async ()=>{
            setLoading(true);
            setError(null);
            try {
                const [projectRes, taskRes, contribRes, changesRes, activityRes] = await Promise.all([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProject"])(projectId),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listTasks"])(projectId),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getContribution"])(projectId),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRecentChanges"])(projectId),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectActivity"])(projectId, 20)
                ]);
                if (projectRes.project.status === "COMPLETED") {
                    router.replace(`/projects/${projectId}/result`);
                    return;
                }
                setProject(projectRes.project);
                setRole(projectRes.currentUserRole);
                setMembers(projectRes.members);
                setTasks(taskRes.tasks);
                setContribution(contribRes.contribution);
                setChanges(changesRes.changes);
                setActivities(activityRes.activities);
                setLowConfidenceChanges(activityRes.lowConfidenceChanges);
            } catch (err) {
                setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : "대시보드를 불러오지 못했습니다.");
            } finally{
                setLoading(false);
            }
        }
    }["DashboardPage.useCallback[load]"], [
        projectId,
        router
    ]);
    async function handleComplete() {
        if (!window.confirm("프로젝트를 종료하면 모든 기록과 Task가 읽기 전용으로 전환되고 현재 기여도가 최종 결과로 저장됩니다. 종료할까요?")) return;
        setCompleting(true);
        setError(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeProject"])(projectId);
            router.push(`/projects/${projectId}/result`);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? caught.message : "프로젝트 종료에 실패했습니다.");
        } finally{
            setCompleting(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
            load();
        }
    }["DashboardPage.useEffect"], [
        load
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-6 py-16",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                label: "불러오는 중..."
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
            lineNumber: 113,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-3 px-6 py-16",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-rose-600",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: load,
                            className: "btn-primary rounded-xl px-4 py-2 text-sm font-semibold",
                            children: "다시 시도"
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push("/"),
                            className: "text-sm text-slate-500 underline",
                            children: "프로젝트 목록으로"
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
            lineNumber: 121,
            columnNumber: 7
        }, this);
    }
    const counts = {
        total: tasks.length,
        todo: tasks.filter((task)=>task.status === "TODO").length,
        progress: tasks.filter((task)=>task.status === "IN_PROGRESS").length,
        done: tasks.filter((task)=>task.status === "DONE").length
    };
    const visibleTasks = filter === "ALL" ? tasks : tasks.filter((task)=>task.status === filter);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "border-b border-slate-200 pb-7",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-end justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "h-2 w-2 rounded-full bg-emerald-500"
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 144,
                                                columnNumber: 52
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-semibold text-slate-500",
                                                children: "진행 중"
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 144,
                                                columnNumber: 108
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 144,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl",
                                        children: project?.name
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 145,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1.5 text-sm text-slate-500",
                                        children: "팀의 업무와 최근 변화를 확인하세요."
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 146,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 143,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    role === "OWNER" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleComplete,
                                        disabled: completing,
                                        className: "btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50",
                                        children: completing ? "종료 중..." : "프로젝트 종료"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push(`/projects/${projectId}/members`),
                                        className: "btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold",
                                        children: "팀원 관리"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 159,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push(`/projects/${projectId}/records/new`),
                                        className: "btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold",
                                        children: "기록 추가"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 165,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 148,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                        className: "mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:gap-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryMetric, {
                                label: "전체",
                                value: counts.total
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryMetric, {
                                label: "할 일",
                                value: counts.todo
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryMetric, {
                                label: "진행 중",
                                value: counts.progress
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryMetric, {
                                label: "완료",
                                value: counts.done
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-9",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex items-end justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-bold text-slate-900",
                                        children: "팀 기여도"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 182,
                                        columnNumber: 73
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-slate-500",
                                        children: "현재 Task를 기준으로 계산한 팀원별 비율입니다."
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 182,
                                        columnNumber: 132
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 182,
                                columnNumber: 68
                            }, this),
                            members.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push(`/projects/${projectId}/contribution`),
                                className: "text-sm font-semibold text-[#6541f3] hover:text-[#5632d8]",
                                children: "상세 보기 →"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 182,
                                columnNumber: 236
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    members.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "아직 팀원이 없습니다.",
                        description: "대화 속 화자를 연결하려면 먼저 팀원을 등록해주세요.",
                        action: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push(`/projects/${projectId}/members`),
                            className: "btn-primary rounded-xl px-4 py-2 text-sm font-semibold",
                            children: "팀원 등록"
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                            lineNumber: 184,
                            columnNumber: 96
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-5 md:grid-cols-2",
                            children: contribution.map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$ContributionBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    member: member
                                }, member.memberId, false, {
                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                    lineNumber: 186,
                                    columnNumber: 157
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                            lineNumber: 186,
                            columnNumber: 84
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 186,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-bold text-slate-900",
                                        children: "현재 Task"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 126
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-slate-500",
                                        children: [
                                            "프로젝트 업무 ",
                                            tasks.length,
                                            "개"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 187
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 191,
                                columnNumber: 121
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex w-fit rounded-xl bg-slate-100 p-1",
                                children: [
                                    [
                                        'ALL',
                                        '전체'
                                    ],
                                    [
                                        'TODO',
                                        '할 일'
                                    ],
                                    [
                                        'IN_PROGRESS',
                                        '진행 중'
                                    ],
                                    [
                                        'DONE',
                                        '완료'
                                    ]
                                ].map(([value, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFilter(value),
                                        "aria-pressed": filter === value,
                                        className: `rounded-lg px-3 py-1.5 text-xs font-semibold ${filter === value ? "bg-white text-[#6541f3] shadow-sm" : "text-slate-500 hover:text-slate-800"}`,
                                        children: label
                                    }, value, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 421
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 191,
                                columnNumber: 263
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    visibleTasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            title: tasks.length ? "이 상태의 Task가 없습니다." : "아직 분석된 업무가 없습니다.",
                            description: tasks.length ? "다른 상태 필터를 선택해보세요." : "첫 번째 회의 기록을 추가해보세요.",
                            action: !tasks.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push(`/projects/${projectId}/records/new`),
                                className: "btn-primary rounded-xl px-4 py-2 text-sm font-semibold",
                                children: "기록 추가하기"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 193,
                                columnNumber: 207
                            }, this) : undefined
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                            lineNumber: 193,
                            columnNumber: 34
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-200",
                        children: visibleTasks.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push(`/projects/${projectId}/tasks/${t.id}`),
                                    className: "group w-full p-4 text-left hover:bg-slate-50 sm:px-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "truncate text-sm font-semibold text-slate-900 group-hover:text-[#6541f3]",
                                                            children: t.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                            lineNumber: 196,
                                                            columnNumber: 275
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$TaskContributors$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                contributors: t.contributors,
                                                                compact: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                                lineNumber: 196,
                                                                columnNumber: 398
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                            lineNumber: 196,
                                                            columnNumber: 376
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 250
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    status: t.status
                                                }, void 0, false, {
                                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 468
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                            lineNumber: 196,
                                            columnNumber: 194
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "중요도 ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            className: "text-slate-600",
                                                            children: t.importance
                                                        }, void 0, false, {
                                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                            lineNumber: 196,
                                                            columnNumber: 597
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 587
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "난이도 ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            className: "text-slate-600",
                                                            children: t.difficulty
                                                        }, void 0, false, {
                                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                            lineNumber: 196,
                                                            columnNumber: 662
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 652
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "작업량 ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            className: "text-slate-600",
                                                            children: t.workload
                                                        }, void 0, false, {
                                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                            lineNumber: 196,
                                                            columnNumber: 727
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 717
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                            lineNumber: 196,
                                            columnNumber: 507
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                    lineNumber: 196,
                                    columnNumber: 53
                                }, this)
                            }, t.id, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 196,
                                columnNumber: 38
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-10 border-t border-slate-200 pt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-bold text-slate-900",
                        children: "최근 변화"
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-slate-500",
                        children: "새 기록을 분석하며 반영된 변경 사항입니다."
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this),
                    changes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-5 text-sm text-slate-500",
                        children: "아직 분석으로 발생한 변경 사항이 없습니다."
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "mt-5 divide-y divide-slate-200 border-y border-slate-200",
                        children: changes.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-start gap-3 py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6541f3]"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 210,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-slate-900",
                                                children: c.taskTitle
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 212,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-slate-600",
                                                children: c.summary
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 213,
                                                columnNumber: 19
                                            }, this),
                                            c.reason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-0.5 text-xs text-slate-400",
                                                children: c.reason
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 214,
                                                columnNumber: 32
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-1 inline-block text-[10px] font-semibold text-[#6541f3]",
                                                children: CHANGE_TYPE_LABEL[c.changeType] ?? c.changeType
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 215,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 211,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, c.id, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 209,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 207,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            lowConfidenceChanges.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-base font-bold text-slate-900",
                                        children: "확인이 필요한 판단"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 225,
                                        columnNumber: 73
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-slate-600",
                                        children: "신뢰도가 낮은 항목은 직접 근거를 확인해주세요."
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 225,
                                        columnNumber: 139
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 225,
                                columnNumber: 68
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700",
                                children: [
                                    lowConfidenceChanges.length,
                                    "개"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 225,
                                columnNumber: 218
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 225,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "mt-4 divide-y divide-amber-200",
                        children: lowConfidenceChanges.slice(0, 4).map((change)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "py-3 first:pt-0 last:pb-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-sm font-semibold text-slate-900",
                                                        children: change.taskTitle
                                                    }, void 0, false, {
                                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 154
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-xs leading-5 text-slate-600",
                                                        children: change.reason || "판단 근거를 직접 확인해주세요."
                                                    }, void 0, false, {
                                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 237
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 228,
                                                columnNumber: 129
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "shrink-0 text-xs text-amber-700",
                                                children: [
                                                    Math.round(change.confidence * 100),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 228,
                                                columnNumber: 338
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 228,
                                        columnNumber: 73
                                    }, this),
                                    change.taskId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>router.push(`/projects/${projectId}/tasks/${change.taskId}`),
                                        className: "mt-2 text-xs font-semibold text-[#6541f3]",
                                        children: "Task 확인 →"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 228,
                                        columnNumber: 461
                                    }, this)
                                ]
                            }, change.id, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 226,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                lineNumber: 224,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-10 border-t border-slate-200 pt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-slate-900",
                                children: "프로젝트 활동"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 235,
                                columnNumber: 31
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "기록과 Task가 누적된 흐름입니다."
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 235,
                                columnNumber: 92
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    activities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-500",
                        children: "아직 프로젝트 활동이 없습니다."
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 237,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "relative ml-1 flex flex-col gap-5 before:absolute before:bottom-3 before:left-[5px] before:top-3 before:w-px before:bg-slate-200",
                        children: activities.slice(0, activityVisibleCount).map((activity)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "relative pl-5 before:absolute before:left-0 before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:border-2 before:border-white before:bg-[#6541f3]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center gap-x-2 gap-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-slate-800",
                                                children: activity.title
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 242,
                                                columnNumber: 78
                                            }, this),
                                            activity.source && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${activity.source === "MANUAL" ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-[#6541f3]"}`,
                                                children: activity.source === "MANUAL" ? "직접 수정" : "AI 분석"
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 242,
                                                columnNumber: 170
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 242,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-0.5 text-xs leading-5 text-slate-500",
                                        children: activity.description
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 243,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 flex items-center gap-2 text-[10px] text-slate-400",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                                                children: formatActivityTime(activity.timestamp)
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 90
                                            }, this),
                                            activity.actor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "· ",
                                                    activity.actor
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 162
                                            }, this),
                                            activity.taskId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>router.push(`/projects/${projectId}/tasks/${activity.taskId}`),
                                                className: "font-semibold text-[#6541f3]",
                                                children: "Task 보기"
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 214
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                        lineNumber: 244,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, activity.id, true, {
                                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                                lineNumber: 241,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 239,
                        columnNumber: 11
                    }, this),
                    activities.length > activityVisibleCount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setActivityVisibleCount((count)=>Math.min(activities.length, count + 8)),
                        className: "mt-4 text-xs font-semibold text-[#6541f3]",
                        children: "더 보기"
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                        lineNumber: 249,
                        columnNumber: 54
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                lineNumber: 234,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "22D5a4S5HwGNMmBJaWguc7eJ1Mc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DashboardPage;
function formatActivityTime(timestamp) {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(timestamp));
}
function SummaryMetric({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                className: "text-xs font-medium text-slate-400",
                children: label
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                lineNumber: 265,
                columnNumber: 15
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                className: "mt-1 text-xl font-bold text-slate-900",
                children: value
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
                lineNumber: 265,
                columnNumber: 78
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/app/(protected)/projects/[projectId]/page.tsx",
        lineNumber: 265,
        columnNumber: 10
    }, this);
}
_c1 = SummaryMetric;
var _c, _c1;
__turbopack_context__.k.register(_c, "DashboardPage");
__turbopack_context__.k.register(_c1, "SummaryMetric");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/team-assistant_1/components/ContributionBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContributionBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/Avatar.tsx [app-client] (ecmascript)");
;
;
function ContributionBar({ member }) {
    const delta = member.deltaPercentage;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 flex items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex min-w-0 items-center gap-2 text-sm font-medium text-slate-800",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                emoji: member.avatarEmoji,
                                name: member.name,
                                size: "sm"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/ContributionBar.tsx",
                                lineNumber: 9,
                                columnNumber: 94
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                children: member.name
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/ContributionBar.tsx",
                                lineNumber: 9,
                                columnNumber: 160
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/components/ContributionBar.tsx",
                        lineNumber: 9,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-slate-600",
                        children: [
                            member.percentage.toFixed(1),
                            "%",
                            delta !== null && delta !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `ml-1.5 text-xs font-medium ${delta > 0 ? "text-emerald-600" : "text-rose-600"}`,
                                children: [
                                    delta > 0 ? "+" : "",
                                    delta.toFixed(1),
                                    "%p"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/components/ContributionBar.tsx",
                                lineNumber: 13,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/components/ContributionBar.tsx",
                        lineNumber: 10,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/components/ContributionBar.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-1.5 w-full overflow-hidden rounded-full bg-slate-100",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full rounded-full bg-[#6541f3] transition-all",
                    style: {
                        width: `${Math.min(100, Math.max(0, member.percentage))}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/team-assistant_1/components/ContributionBar.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/ContributionBar.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/components/ContributionBar.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = ContributionBar;
var _c;
__turbopack_context__.k.register(_c, "ContributionBar");
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
"[project]/team-assistant_1/components/StatusBadge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const CONFIG = {
    TODO: {
        label: "할 일",
        className: "bg-slate-100 text-slate-600 ring-slate-200"
    },
    IN_PROGRESS: {
        label: "진행 중",
        className: "bg-violet-50 text-[#6541f3] ring-violet-200"
    },
    DONE: {
        label: "완료",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200"
    }
};
function StatusBadge({ status }) {
    const cfg = CONFIG[status];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${cfg.className}`,
        children: cfg.label
    }, void 0, false, {
        fileName: "[project]/team-assistant_1/components/StatusBadge.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = StatusBadge;
var _c;
__turbopack_context__.k.register(_c, "StatusBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/team-assistant_1/components/TaskContributors.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TaskContributors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/Avatar.tsx [app-client] (ecmascript)");
;
;
function TaskContributors({ contributors, compact = false }) {
    if (contributors.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-xs text-slate-400",
            children: "참여자 미지정"
        }, void 0, false, {
            fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
            lineNumber: 12,
            columnNumber: 12
        }, this);
    }
    if (compact) {
        const visible = contributors.slice(0, 3);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap items-center gap-x-2.5 gap-y-1.5",
            children: [
                visible.map((contributor)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1 text-xs text-slate-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                emoji: contributor.avatarEmoji,
                                name: contributor.name,
                                size: "sm"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: contributor.name
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                                lineNumber: 22,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                className: "font-semibold text-slate-700",
                                children: [
                                    contributor.share,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                                lineNumber: 23,
                                columnNumber: 13
                            }, this)
                        ]
                    }, contributor.memberId, true, {
                        fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                        lineNumber: 20,
                        columnNumber: 11
                    }, this)),
                contributors.length > visible.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[11px] font-semibold text-[#6541f3]",
                    children: [
                        "+",
                        contributors.length - visible.length,
                        "명"
                    ]
                }, void 0, true, {
                    fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                    lineNumber: 27,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid gap-3",
        children: contributors.map((contributor)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex min-w-0 items-center gap-2 text-sm font-medium text-slate-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        emoji: contributor.avatarEmoji,
                                        name: contributor.name,
                                        size: "sm"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                                        lineNumber: 39,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: contributor.name
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                                        lineNumber: 40,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex shrink-0 items-center gap-2",
                                children: [
                                    contributor.source && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${contributor.source === "MANUAL" ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-[#6541f3]"}`,
                                        children: contributor.source === "MANUAL" ? "직접 수정" : "AI 분석"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                                        lineNumber: 44,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        className: "text-sm text-[#6541f3]",
                                        children: [
                                            contributor.share,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/70",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full bg-[#6541f3]",
                            style: {
                                width: `${contributor.share}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                ]
            }, contributor.memberId, true, {
                fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/team-assistant_1/components/TaskContributors.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c = TaskContributors;
var _c;
__turbopack_context__.k.register(_c, "TaskContributors");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=team-assistant_1_1mgj6vp._.js.map