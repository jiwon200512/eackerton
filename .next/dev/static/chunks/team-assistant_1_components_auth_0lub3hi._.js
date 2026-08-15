(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/team-assistant_1/components/auth/LoginForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthCard",
    ()=>AuthCard,
    "Field",
    ()=>Field,
    "default",
    ()=>LoginForm,
    "inputClassName",
    ()=>inputClassName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './SocialLoginButtons'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function LoginForm() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            const body = await response.json().catch(()=>null);
            if (!response.ok) {
                setError(body?.error ?? "로그인에 실패했습니다.");
                return;
            }
            router.replace("/");
            router.refresh();
        } catch  {
            setError("로그인 요청을 처리하지 못했습니다.");
        } finally{
            setSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthCard, {
        title: "로그인",
        description: "팀 프로젝트 현황을 이어서 확인하세요.",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "grid gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                        label: "아이디",
                        htmlFor: "username",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "username",
                            name: "username",
                            value: username,
                            onChange: (event)=>setUsername(event.target.value),
                            autoComplete: "username",
                            required: true,
                            className: inputClassName
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                        label: "비밀번호",
                        htmlFor: "password",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "password",
                            name: "password",
                            type: "password",
                            value: password,
                            onChange: (event)=>setPassword(event.target.value),
                            autoComplete: "current-password",
                            required: true,
                            className: inputClassName
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        role: "alert",
                        className: "text-sm text-rose-600",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: submitting,
                        className: "btn-primary mt-1 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50",
                        children: submitting ? "로그인 중..." : "로그인"
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SocialLoginButtons, {}, void 0, false, {
                    fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-6 text-center text-sm text-slate-500",
                children: [
                    "계정이 없나요?",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/signup",
                        className: "font-semibold text-[#6541f3] hover:text-[#5632d8]",
                        children: "회원가입"
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(LoginForm, "+Chsl2VCZ5xeff8dEX6DClVf6dM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginForm;
const inputClassName = "glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm";
function Field({ label, htmlFor, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        htmlFor: htmlFor,
        className: "block text-sm font-semibold text-slate-700",
        children: [
            label,
            children
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_c1 = Field;
function AuthCard({ title, description, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex min-h-screen w-full items-center justify-center bg-slate-50 px-5 py-10 sm:py-14",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "glass-card-strong w-full max-w-[460px] rounded-2xl p-6 sm:p-9",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto mb-6 flex w-fit items-center gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/logo.png",
                                    alt: "",
                                    width: 42,
                                    height: 42,
                                    className: "h-10 w-10 rounded-xl",
                                    priority: true
                                }, void 0, false, {
                                    fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                                    lineNumber: 138,
                                    columnNumber: 73
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl font-bold tracking-tight text-slate-900",
                                    children: "Effortly"
                                }, void 0, false, {
                                    fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                                    lineNumber: 138,
                                    columnNumber: 170
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold tracking-tight text-slate-900",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-slate-500",
                            children: description
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
            lineNumber: 136,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/team-assistant_1/components/auth/LoginForm.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_c2 = AuthCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "LoginForm");
__turbopack_context__.k.register(_c1, "Field");
__turbopack_context__.k.register(_c2, "AuthCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/team-assistant_1/components/auth/SignupForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignupForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/team-assistant_1/components/auth/LoginForm.tsx [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './SocialLoginButtons'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const DOMAIN_OPTIONS = [
    "gmail.com",
    "naver.com",
    "daum.net",
    "hanmail.net",
    "kakao.com",
    "outlook.com"
];
const CUSTOM_DOMAIN = "custom";
function SignupForm() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [passwordConfirm, setPasswordConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [emailLocal, setEmailLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [domainOption, setDomainOption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DOMAIN_OPTIONS[0]);
    const [customDomain, setCustomDomain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        if (password !== passwordConfirm) {
            setError("비밀번호 확인이 일치하지 않습니다.");
            return;
        }
        const domain = domainOption === CUSTOM_DOMAIN ? customDomain.trim() : domainOption;
        if (!emailLocal.trim() || !domain) {
            setError("이메일 주소를 입력해주세요.");
            return;
        }
        setSubmitting(true);
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    passwordConfirm,
                    email: `${emailLocal.trim()}@${domain}`
                })
            });
            const body = await response.json().catch(()=>null);
            if (!response.ok) {
                setError(body?.error ?? "회원가입에 실패했습니다.");
                return;
            }
            router.replace("/");
            router.refresh();
        } catch  {
            setError("회원가입 요청을 처리하지 못했습니다.");
        } finally{
            setSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthCard"], {
        title: "회원가입",
        description: "팀 프로젝트를 함께 관리할 계정을 만드세요.",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "grid gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                        label: "이름(실명)",
                        htmlFor: "name",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "name",
                                name: "name",
                                value: name,
                                onChange: (event)=>setName(event.target.value),
                                autoComplete: "name",
                                required: true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inputClassName"]
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-1 block text-xs font-normal text-slate-400",
                                children: "팀 프로젝트 초대 시 등록된 팀원과 자동으로 연결하는 데 사용됩니다."
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                        label: "아이디",
                        htmlFor: "username",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "username",
                                name: "username",
                                value: username,
                                onChange: (event)=>setUsername(event.target.value),
                                autoComplete: "username",
                                minLength: 3,
                                maxLength: 30,
                                required: true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inputClassName"]
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-1 block text-xs font-normal text-slate-400",
                                children: "이메일이 아닌 로그인용 아이디입니다."
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                        label: "비밀번호",
                        htmlFor: "password",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "password",
                            name: "password",
                            type: "password",
                            value: password,
                            onChange: (event)=>setPassword(event.target.value),
                            autoComplete: "new-password",
                            minLength: 8,
                            required: true,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inputClassName"]
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                        label: "비밀번호 확인",
                        htmlFor: "password-confirm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "password-confirm",
                            name: "passwordConfirm",
                            type: "password",
                            value: passwordConfirm,
                            onChange: (event)=>setPasswordConfirm(event.target.value),
                            autoComplete: "new-password",
                            minLength: 8,
                            required: true,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inputClassName"]
                        }, void 0, false, {
                            fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                className: "text-sm font-medium text-slate-700",
                                children: "이메일"
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1.15fr)] items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        "aria-label": "이메일 아이디",
                                        value: emailLocal,
                                        onChange: (event)=>setEmailLocal(event.target.value),
                                        autoComplete: "email",
                                        required: true,
                                        className: "glass-input min-w-0 rounded-xl px-3 py-2.5 text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-slate-500",
                                        children: "@"
                                    }, void 0, false, {
                                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                        lineNumber: 154,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        "aria-label": "이메일 도메인",
                                        value: domainOption,
                                        onChange: (event)=>setDomainOption(event.target.value),
                                        className: "glass-input min-w-0 rounded-xl px-3 py-2.5 text-sm",
                                        children: [
                                            DOMAIN_OPTIONS.map((domain)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: domain,
                                                    children: domain
                                                }, domain, false, {
                                                    fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 17
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: CUSTOM_DOMAIN,
                                                children: "직접 입력"
                                            }, void 0, false, {
                                                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                                lineNumber: 166,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            domainOption === CUSTOM_DOMAIN && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                "aria-label": "직접 입력 이메일 도메인",
                                value: customDomain,
                                onChange: (event)=>setCustomDomain(event.target.value),
                                placeholder: "예: company.co.kr",
                                required: true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$components$2f$auth$2f$LoginForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inputClassName"]
                            }, void 0, false, {
                                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        role: "alert",
                        className: "text-sm text-rose-600",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: submitting,
                        className: "btn-primary mt-1 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50",
                        children: submitting ? "가입 중..." : "회원가입"
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SocialLoginButtons, {}, void 0, false, {
                    fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                    lineNumber: 197,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-6 text-center text-sm text-slate-500",
                children: [
                    "이미 계정이 있나요?",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/login",
                        className: "font-semibold text-[#6541f3] hover:text-[#5632d8]",
                        children: "로그인"
                    }, void 0, false, {
                        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/team-assistant_1/components/auth/SignupForm.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
_s(SignupForm, "iHk0YCC8LHjo7FYX80w9r4wmpsk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$team$2d$assistant_1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SignupForm;
var _c;
__turbopack_context__.k.register(_c, "SignupForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=team-assistant_1_components_auth_0lub3hi._.js.map