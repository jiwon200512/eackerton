(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/team-assistant_1/components/Avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Avatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/lib/avatar.ts [app-client] (ecmascript)");
;
;
const SIZE_CLASSES = {
    sm: "h-8 w-8 text-base",
    md: "h-10 w-10 text-xl",
    lg: "h-14 w-14 text-3xl",
    xl: "h-20 w-20 text-5xl"
};
function Avatar({ emoji = __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_AVATAR_EMOJI"], name, size = "md", className = "" }) {
    const safeEmoji = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAvatarEmoji"])(emoji);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        role: "img",
        "aria-label": name ? `${name} 프로필 아바타` : "프로필 아바타",
        title: name ?? undefined,
        className: `inline-flex shrink-0 items-center justify-center rounded-full border border-violet-100 bg-violet-50 ${SIZE_CLASSES[size]} ${className}`,
        children: safeEmoji
    }, void 0, false, {
        fileName: "[project]/team-assistant_1/components/Avatar.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = Avatar;
var _c;
__turbopack_context__.k.register(_c, "Avatar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/team-assistant_1/components/BrandMark.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrandMark
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
;
function BrandMark({ compact = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: "/",
        className: "inline-flex items-center gap-2.5",
        "aria-label": "Effortly 홈",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: "/logo.png",
                alt: "",
                width: 36,
                height: 36,
                className: "h-9 w-9 rounded-xl",
                priority: true
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/BrandMark.tsx",
                lineNumber: 5,
                columnNumber: 94
            }, this),
            !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-lg font-bold tracking-tight text-slate-900",
                children: "Effortly"
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/BrandMark.tsx",
                lineNumber: 5,
                columnNumber: 202
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/components/BrandMark.tsx",
        lineNumber: 5,
        columnNumber: 10
    }, this);
}
_c = BrandMark;
var _c;
__turbopack_context__.k.register(_c, "BrandMark");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/team-assistant_1/components/layout/ProtectedShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProtectedShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$BrandMark$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/BrandMark.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/Avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/lib/apiClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const NAV_ITEMS = [
    {
        segment: "",
        label: "대시보드"
    },
    {
        segment: "/records/new",
        label: "기록 추가"
    },
    {
        segment: "/members",
        label: "팀원 관리"
    },
    {
        segment: "/contribution",
        label: "기여도 리포트"
    }
];
function ProtectedShell({ user, children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const projectId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProtectedShell.useMemo[projectId]": ()=>pathname.match(/^\/projects\/([^/]+)/)?.[1] ?? null
    }["ProtectedShell.useMemo[projectId]"], [
        pathname
    ]);
    if (!projectId) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HomeHeader, {
                user: user
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                lineNumber: 21,
                columnNumber: 56
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
        lineNumber: 21,
        columnNumber: 26
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProjectShell, {
        projectId: projectId,
        user: user,
        children: children
    }, void 0, false, {
        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
_s(ProtectedShell, "hZNadmYrzh38RcQi/l9Q5/elfB8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ProtectedShell;
function ProjectShell({ projectId, user, children }) {
    _s1();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [projectName, setProjectName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("프로젝트");
    const [projectStatus, setProjectStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ACTIVE");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectShell.useEffect": ()=>{
            let active = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProject"])(projectId).then({
                "ProjectShell.useEffect": ({ project })=>{
                    if (active) {
                        setProjectName(project.name);
                        setProjectStatus(project.status);
                    }
                }
            }["ProjectShell.useEffect"]).catch({
                "ProjectShell.useEffect": ()=>undefined
            }["ProjectShell.useEffect"]);
            return ({
                "ProjectShell.useEffect": ()=>{
                    active = false;
                }
            })["ProjectShell.useEffect"];
        }
    }["ProjectShell.useEffect"], [
        projectId
    ]);
    const visibleItems = projectStatus === "COMPLETED" ? [
        {
            segment: "/result",
            label: "최종 결과"
        },
        NAV_ITEMS[2],
        NAV_ITEMS[3]
    ] : NAV_ITEMS;
    const nav = visibleItems.map((item)=>({
            ...item,
            href: `/projects/${projectId}${item.segment}`
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen lg:flex",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$BrandMark$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                            lineNumber: 45,
                            columnNumber: 31
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-2 mt-9 border-b border-slate-200 pb-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400",
                                children: "현재 프로젝트"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 truncate text-sm font-semibold text-slate-900",
                                children: projectName
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            projectStatus === "COMPLETED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600",
                                children: "종료됨"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                lineNumber: 49,
                                columnNumber: 45
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "mt-5 flex flex-col gap-1.5",
                        "aria-label": "프로젝트 메뉴",
                        children: nav.map((item)=>{
                            const active = item.segment === "" ? pathname === item.href : pathname.startsWith(item.href);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                "aria-current": active ? "page" : undefined,
                                className: `rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "bg-violet-50 text-[#6541f3]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`,
                                children: item.label
                            }, item.href, false, {
                                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                lineNumber: 54,
                                columnNumber: 20
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto border-t border-slate-200 pt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "mb-3 block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                                children: "← 모든 프로젝트"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserPanel, {
                                user: user,
                                compact: true
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1 lg:pl-60",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3 lg:hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$BrandMark$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                        lineNumber: 64,
                                        columnNumber: 68
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "max-w-32 truncate text-xs font-semibold text-slate-600",
                                        children: projectName
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                        lineNumber: 64,
                                        columnNumber: 81
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/profile",
                                        "aria-label": "프로필 설정",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            emoji: user.avatarEmoji,
                                            name: user.name,
                                            size: "sm"
                                        }, void 0, false, {
                                            fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                            lineNumber: 64,
                                            columnNumber: 216
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                        lineNumber: 64,
                                        columnNumber: 174
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "mt-3 flex gap-1.5 overflow-x-auto pb-1",
                                "aria-label": "프로젝트 모바일 메뉴",
                                children: nav.map((item)=>{
                                    const active = item.segment === "" ? pathname === item.href : pathname.startsWith(item.href);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        "aria-current": active ? "page" : undefined,
                                        className: `shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${active ? "bg-violet-50 text-[#6541f3]" : "text-slate-600 hover:bg-slate-50"}`,
                                        children: item.label
                                    }, item.href, false, {
                                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                        lineNumber: 68,
                                        columnNumber: 22
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "min-h-screen",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s1(ProjectShell, "0E/veHVDZB5bUStGyQAY4qFL32g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c1 = ProjectShell;
function HomeHeader({ user }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-20 border-b border-slate-200 bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$BrandMark$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                    lineNumber: 79,
                    columnNumber: 172
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserPanel, {
                    user: user
                }, void 0, false, {
                    fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                    lineNumber: 79,
                    columnNumber: 185
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
            lineNumber: 79,
            columnNumber: 83
        }, this)
    }, void 0, false, {
        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
        lineNumber: 79,
        columnNumber: 10
    }, this);
}
_c2 = HomeHeader;
function UserPanel({ user, compact = false }) {
    _s2();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [loggingOut, setLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function logout() {
        setLoggingOut(true);
        try {
            await fetch("/api/auth/logout", {
                method: "POST"
            });
        } finally{
            router.replace("/login");
            router.refresh();
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center ${compact ? "px-2 py-1" : "gap-3"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/profile",
                className: "flex min-w-0 items-center gap-2",
                title: "프로필 설정",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        emoji: user.avatarEmoji,
                        name: user.name,
                        size: "sm"
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${compact ? "min-w-0 flex-1" : "hidden sm:block"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-xs font-semibold text-slate-800",
                                children: user.name
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-[11px] text-slate-400",
                                children: "프로필 설정"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: logout,
                disabled: loggingOut,
                className: `${compact ? "ml-auto px-2 hover:text-slate-900" : "btn-secondary rounded-lg px-3"} py-1.5 text-xs font-semibold text-slate-500 disabled:opacity-50`,
                children: loggingOut ? "처리 중" : "로그아웃"
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/components/layout/ProtectedShell.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s2(UserPanel, "/pePGCsedlDmuaOohM5tkOzqyG8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c3 = UserPanel;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ProtectedShell");
__turbopack_context__.k.register(_c1, "ProjectShell");
__turbopack_context__.k.register(_c2, "HomeHeader");
__turbopack_context__.k.register(_c3, "UserPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/team-assistant_1/lib/apiClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "addMember",
    ()=>addMember,
    "analyzeRecord",
    ()=>analyzeRecord,
    "changePassword",
    ()=>changePassword,
    "completeProject",
    ()=>completeProject,
    "createProject",
    ()=>createProject,
    "createRecord",
    ()=>createRecord,
    "deleteMember",
    ()=>deleteMember,
    "deleteTask",
    ()=>deleteTask,
    "getContribution",
    ()=>getContribution,
    "getContributionBreakdown",
    ()=>getContributionBreakdown,
    "getContributionHistory",
    ()=>getContributionHistory,
    "getInviteCode",
    ()=>getInviteCode,
    "getProfile",
    ()=>getProfile,
    "getProject",
    ()=>getProject,
    "getProjectActivity",
    ()=>getProjectActivity,
    "getRecentChanges",
    ()=>getRecentChanges,
    "getTask",
    ()=>getTask,
    "joinProjectByCode",
    ()=>joinProjectByCode,
    "listMembers",
    ()=>listMembers,
    "listProjects",
    ()=>listProjects,
    "listRecords",
    ()=>listRecords,
    "listTasks",
    ()=>listTasks,
    "regenerateInviteCode",
    ()=>regenerateInviteCode,
    "reopenProject",
    ()=>reopenProject,
    "transferProjectOwner",
    ()=>transferProjectOwner,
    "updateProfileAvatar",
    ()=>updateProfileAvatar,
    "updateTask",
    ()=>updateTask
]);
"use client";
class ApiError extends Error {
    constructor(message){
        super(message);
        this.name = "ApiError";
    }
}
async function request(url, init) {
    const res = await fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init?.headers ?? {}
        }
    });
    let body = null;
    try {
        body = await res.json();
    } catch  {
    // no body
    }
    if (!res.ok) {
        const message = body && typeof body === "object" && "error" in body ? String(body.error) : "요청 처리 중 오류가 발생했습니다.";
        throw new ApiError(message);
    }
    return body;
}
const listProjects = ()=>request("/api/projects");
const createProject = (name)=>request("/api/projects", {
        method: "POST",
        body: JSON.stringify({
            name
        })
    });
const getProject = (projectId)=>request(`/api/projects/${projectId}`);
const joinProjectByCode = (code)=>request("/api/projects/join", {
        method: "POST",
        body: JSON.stringify({
            code
        })
    });
const getInviteCode = (projectId)=>request(`/api/projects/${projectId}/invite-code`);
const regenerateInviteCode = (projectId)=>request(`/api/projects/${projectId}/invite-code`, {
        method: "POST"
    });
const listMembers = (projectId)=>request(`/api/projects/${projectId}/members`);
const addMember = (projectId, name)=>request(`/api/projects/${projectId}/members`, {
        method: "POST",
        body: JSON.stringify({
            name
        })
    });
const deleteMember = (projectId, memberId)=>request(`/api/projects/${projectId}/members/${memberId}`, {
        method: "DELETE"
    });
const transferProjectOwner = (projectId, memberId)=>request(`/api/projects/${projectId}/transfer-owner`, {
        method: "POST",
        body: JSON.stringify({
            memberId
        })
    });
const completeProject = (projectId)=>request(`/api/projects/${projectId}/complete`, {
        method: "POST"
    });
const reopenProject = (projectId)=>request(`/api/projects/${projectId}/reopen`, {
        method: "POST"
    });
const getProfile = ()=>request("/api/profile");
const updateProfileAvatar = (avatarEmoji)=>request("/api/profile/avatar", {
        method: "PATCH",
        body: JSON.stringify({
            avatarEmoji
        })
    });
const changePassword = (currentPassword, newPassword)=>request("/api/profile/password", {
        method: "POST",
        body: JSON.stringify({
            currentPassword,
            newPassword
        })
    });
const listRecords = (projectId)=>request(`/api/projects/${projectId}/records`);
const createRecord = (projectId, type, rawContent)=>request(`/api/projects/${projectId}/records`, {
        method: "POST",
        body: JSON.stringify({
            type,
            rawContent
        })
    });
const analyzeRecord = (projectId, recordId, force = false)=>request(`/api/projects/${projectId}/records/${recordId}/analyze`, {
        method: "POST",
        body: JSON.stringify({
            force
        })
    });
const listTasks = (projectId)=>request(`/api/projects/${projectId}/tasks`);
const getTask = (projectId, taskId)=>request(`/api/projects/${projectId}/tasks/${taskId}`);
const updateTask = (projectId, taskId, updates)=>request(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(updates)
    });
const deleteTask = (projectId, taskId)=>request(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "DELETE"
    });
const getContribution = (projectId)=>request(`/api/projects/${projectId}/contribution`);
const getContributionHistory = (projectId)=>request(`/api/projects/${projectId}/contribution/history`);
const getContributionBreakdown = (projectId)=>request(`/api/projects/${projectId}/contribution/breakdown`);
const getProjectActivity = (projectId, limit = 20)=>request(`/api/projects/${projectId}/activity?limit=${limit}`);
const getRecentChanges = (projectId)=>request(`/api/projects/${projectId}/recent-changes`);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/team-assistant_1/lib/avatar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AVATAR_EMOJIS",
    ()=>AVATAR_EMOJIS,
    "DEFAULT_AVATAR_EMOJI",
    ()=>DEFAULT_AVATAR_EMOJI,
    "isAvatarEmoji",
    ()=>isAvatarEmoji,
    "normalizeAvatarEmoji",
    ()=>normalizeAvatarEmoji
]);
const AVATAR_EMOJIS = [
    "🐶",
    "🐱",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐸",
    "🐵",
    "🐷",
    "🐧",
    "🐹",
    "🦄",
    "🐙"
];
const DEFAULT_AVATAR_EMOJI = "🐶";
function isAvatarEmoji(value) {
    return typeof value === "string" && AVATAR_EMOJIS.includes(value);
}
function normalizeAvatarEmoji(value) {
    return isAvatarEmoji(value) ? value : DEFAULT_AVATAR_EMOJI;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=team-assistant_1_0qmbck5._.js.map