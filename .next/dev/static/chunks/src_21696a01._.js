(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/dashboard_analyst/Topbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Topbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function Topbar() {
    _s();
    const [hasNotification, setHasNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Topbar.useEffect": ()=>{
            const fetchNotifications = {
                "Topbar.useEffect.fetchNotifications": async ()=>{
                    try {
                        const res = await fetch("/api/admin/pending-requests", {
                            cache: "no-store"
                        });
                        const data = await res.json();
                        setHasNotification(data.requests && data.requests.length > 0);
                    } catch (error) {
                        console.log(error);
                    }
                }
            }["Topbar.useEffect.fetchNotifications"];
            fetchNotifications();
        }
    }["Topbar.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#0a1e3f] to-[#020617] border-b border-[#0a1e4f]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-semibold text-white tracking-wide",
                children: "Ranger Command Console"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/analyst/notifications",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative cursor-pointer hover:opacity-80 transition",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                    className: "text-white w-6 h-6"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, this),
                                hasNotification && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
                                    lineNumber: 39,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white text-lg cursor-pointer hover:opacity-80 transition",
                        children: "🇮🇳"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 cursor-pointer hover:opacity-80 transition",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/admin.jpg",
                                alt: "Analyst Image",
                                className: "w-[35px] h-[35px] rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-200 text-sm",
                                children: "Analyst"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard_analyst/Topbar.tsx",
        lineNumber: 23,
        columnNumber: 10
    }, this);
}
_s(Topbar, "3v5r0EDjQ4iwTR+34J/I2dpZ8gU=");
_c = Topbar;
var _c;
__turbopack_context__.k.register(_c, "Topbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard_analyst/AttackCards.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AttackCards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// 2. UPDATE ATTACKS ARRAY with a placeholder photoUrl for each attack
const attacks = [
    {
        id: 1,
        name: "Bot Traffic",
        shortDesc: "Automated scripts generating abnormal requests.",
        longDesc: "Automated scripts or bots sending repeated requests to your server, generating fake or abnormal traffic patterns.",
        route: "/analyst/attacks/Bottraffic",
        photoUrl: "/attack_images/bot_traffic.jpg"
    },
    {
        id: 2,
        name: "Brute Force",
        shortDesc: "Repeated login attempts guessing passwords.",
        longDesc: "An attacker tries many username–password combinations repeatedly until one works.",
        route: "/analyst/attacks/Bruteforce",
        photoUrl: "/attack_images/brute_force.jpg"
    },
    {
        id: 3,
        name: "Dirscan",
        shortDesc: "Scanning server directories for exposure.",
        longDesc: "A scan that checks for hidden or unlisted directories and files on a server (e.g., /admin, /backup, /login_old).",
        route: "/analyst/attacks/Dir",
        photoUrl: "/attack_images/dir_scan.jpg"
    },
    {
        id: 4,
        name: "DOS(Denial of Service)",
        shortDesc: "Traffic overload crashing the server.",
        longDesc: "Overloading a server with too many requests so it becomes slow or completely unavailable.",
        route: "/analyst/attacks/Dos",
        photoUrl: "/attack_images/dos.jpg"
    },
    {
        id: 5,
        name: "Gobuster Scan",
        shortDesc: "Fast directory brute-force discovery.",
        longDesc: "A fast directory and file brute-forcer used to discover folders, files, and virtual hosts on a web server.",
        route: "/analyst/attacks/Gobuster",
        photoUrl: "/attack_images/gobuster.jpg"
    },
    {
        id: 6,
        name: "Nmap Scan",
        shortDesc: "Port scanning to detect services.",
        longDesc: "A network scanner that detects open ports, running services, and operating system details.",
        route: "/analyst/attacks/Nmap",
        photoUrl: "/attack_images/nmap.jpg"
    },
    {
        id: 7,
        name: "XSS(Cross-Site Scripting)",
        shortDesc: "Injecting scripts into user browsers.",
        longDesc: "Injecting malicious JavaScript into web pages so it runs in the victim’s browser.",
        route: "/analyst/attacks/Xss",
        photoUrl: "/attack_images/xss.jpg"
    },
    {
        id: 8,
        name: "SQLI(SQL Injection)",
        shortDesc: "Injecting SQL to access data.",
        longDesc: "Injecting malicious SQL code into input fields to manipulate or extract data from the database.",
        route: "/analyst/attacks/Sqli",
        photoUrl: "/attack_images/sqli.jpg"
    },
    {
        id: 9,
        name: "Sensitive Paths",
        shortDesc: "Searching for exposed critical files.",
        longDesc: "Scanning for locations like /admin, /config, /backup.zip that may expose sensitive data if publicly accessible",
        route: "/analyst/attacks/Sensitive",
        photoUrl: "/attack_images/sensitive.jpg"
    },
    {
        id: 10,
        name: "Nikto Scan",
        shortDesc: "Scans servers for dangerous vulnerabilities.",
        longDesc: "A vulnerability scanner that checks web servers for outdated versions, misconfigurations, and common security issues.Injects harmful code into systems.",
        route: "/analyst/attacks/Nikto",
        photoUrl: "/attack_images/nikto.jpg"
    }
];
function AttackCards() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "4b04c8d3615c731524079daf1e54d3e0a3ee44d850c689d9046bd17fb082c6d4") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4b04c8d3615c731524079daf1e54d3e0a3ee44d850c689d9046bd17fb082c6d4";
    }
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    let t0;
    if ($[1] !== expanded) {
        t0 = attacks.find({
            "AttackCards[attacks.find()]": (a)=>a.id === expanded
        }["AttackCards[attacks.find()]"]);
        $[1] = expanded;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    const expandedAttack = t0;
    let t1;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6",
            children: attacks.map({
                "AttackCards[attacks.map()]": (atk)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        layoutId: `attack-${atk.id}`,
                        onMouseEnter: {
                            "AttackCards[attacks.map() > <motion.div>.onMouseEnter]": ()=>setExpanded(atk.id)
                        }["AttackCards[attacks.map() > <motion.div>.onMouseEnter]"],
                        className: "p-5 bg-[#0b1220] border border-blue-900/40 \r\n                        rounded-xl cursor-pointer hover:scale-105 transition shadow-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-blue-300",
                                children: atk.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
                                lineNumber: 117,
                                columnNumber: 218
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 mt-2",
                                children: atk.shortDesc
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
                                lineNumber: 117,
                                columnNumber: 285
                            }, this)
                        ]
                    }, atk.id, true, {
                        fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
                        lineNumber: 115,
                        columnNumber: 46
                    }, this)
            }["AttackCards[attacks.map()]"])
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
            lineNumber: 114,
            columnNumber: 10
        }, this);
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[4] !== expanded || $[5] !== expandedAttack || $[6] !== router) {
        t2 = expanded !== null && expandedAttack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            className: "fixed inset-0 bg-black/70 backdrop-blur-md z-50 \r\n                        flex items-center justify-center",
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            exit: {
                opacity: 0
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                layoutId: `attack-${expanded}`,
                onMouseLeave: {
                    "AttackCards[<motion.div>.onMouseLeave]": ()=>setExpanded(null)
                }["AttackCards[<motion.div>.onMouseLeave]"],
                className: "bg-[#0b1220] border border-blue-900/40 rounded-2xl \r\n                          shadow-2xl text-center max-w-xl w-80 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex mb-2 w-80 h-36 overflow-hidden rounded-t-xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: expandedAttack.photoUrl,
                            alt: expandedAttack.name,
                            className: "rounded-lg object-cover h-full w-80"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
                            lineNumber: 133,
                            columnNumber: 266
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
                        lineNumber: 133,
                        columnNumber: 200
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-300 leading-relaxed mb-2 w-[30%] p-10",
                        children: expandedAttack.longDesc
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
                        lineNumber: 133,
                        columnNumber: 383
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "AttackCards[<button>.onClick]": ()=>router.push(expandedAttack.route)
                        }["AttackCards[<button>.onClick]"],
                        className: "px-3 py-3 bg-blue-600 hover:bg-blue-700 \r\n                            rounded-xl text-white text-lg p-10 mb-5",
                        children: "View Details →"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
                        lineNumber: 133,
                        columnNumber: 475
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
                lineNumber: 131,
                columnNumber: 8
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
            lineNumber: 125,
            columnNumber: 49
        }, this);
        $[4] = expanded;
        $[5] = expandedAttack;
        $[6] = router;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    let t3;
    if ($[8] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full mt-12",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: t2
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
                    lineNumber: 145,
                    columnNumber: 53
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard_analyst/AttackCards.tsx",
            lineNumber: 145,
            columnNumber: 10
        }, this);
        $[8] = t2;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    return t3;
}
_s(AttackCards, "0Whevj+s0ocovjwOdfm/I4qOBps=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AttackCards;
var _c;
__turbopack_context__.k.register(_c, "AttackCards");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/analyst/dashboard/AttackerIPTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AttackerIPTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function AttackerIPTable() {
    _s();
    const [ipMap, setIpMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const severityRank = (s)=>{
        if (!s) return 0;
        const map = {
            critical: 5,
            high: 4,
            medium: 3,
            low: 2,
            info: 1
        };
        return map[(s || "").toLowerCase()] || 1;
    };
    const addIncident = (inc)=>{
        const ip = inc.source_ip || inc.sourceIp || inc.source || "unknown";
        const timestamp = inc.timestamp || new Date().toISOString();
        setIpMap((prev)=>{
            const copy = {
                ...prev
            };
            const existing = copy[ip];
            if (existing) {
                const newSeverity = severityRank(inc.severity) > severityRank(existing.highestSeverity || undefined) ? inc.severity || existing.highestSeverity : existing.highestSeverity;
                copy[ip] = {
                    ip,
                    count: existing.count + 1,
                    lastSeen: timestamp,
                    highestSeverity: newSeverity
                };
            } else {
                copy[ip] = {
                    ip,
                    count: 1,
                    lastSeen: timestamp,
                    highestSeverity: inc.severity || null
                };
            }
            return copy;
        });
    };
    // seed from /incidents
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AttackerIPTable.useEffect": ()=>{
            (async function seed() {
                try {
                    const res = await fetch("http://127.0.0.1:8000/incidents");
                    if (!res.ok) return;
                    const data = await res.json();
                    const reduced = {};
                    data.forEach({
                        "AttackerIPTable.useEffect.seed": (inc_0)=>{
                            const ip_0 = inc_0.source_ip || inc_0.sourceIp || "unknown";
                            const ts = inc_0.timestamp || new Date().toISOString();
                            const sev = inc_0.severity || null;
                            if (reduced[ip_0]) {
                                reduced[ip_0].count += 1;
                                if (new Date(ts) > new Date(reduced[ip_0].lastSeen || 0)) reduced[ip_0].lastSeen = ts;
                                if (severityRank(sev) > severityRank(reduced[ip_0].highestSeverity || undefined)) reduced[ip_0].highestSeverity = sev;
                            } else {
                                reduced[ip_0] = {
                                    ip: ip_0,
                                    count: 1,
                                    lastSeen: ts,
                                    highestSeverity: sev
                                };
                            }
                        }
                    }["AttackerIPTable.useEffect.seed"]);
                    setIpMap(reduced);
                } catch (e) {
                    console.warn("Could not seed incidents:", e);
                }
            })();
        }
    }["AttackerIPTable.useEffect"], []);
    // WebSocket live updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AttackerIPTable.useEffect": ()=>{
            const wsUrl = "ws://127.0.0.1:8000/ws/incidents";
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;
            ws.onopen = ({
                "AttackerIPTable.useEffect": ()=>{
                    console.log("WS connected to", wsUrl);
                    try {
                        ws.send("hello");
                    } catch  {}
                }
            })["AttackerIPTable.useEffect"];
            ws.onmessage = ({
                "AttackerIPTable.useEffect": (evt)=>{
                    try {
                        const msg = JSON.parse(evt.data);
                        if (msg?.event === "new_incident" && msg?.data) {
                            addIncident(msg.data);
                        } else if (msg?.source_ip || msg?.sourceIp) {
                            addIncident(msg);
                        }
                    } catch (err) {
                        console.warn("WS message parse error:", err, evt.data);
                    }
                }
            })["AttackerIPTable.useEffect"];
            ws.onclose = ({
                "AttackerIPTable.useEffect": ()=>console.log("WS disconnected")
            })["AttackerIPTable.useEffect"];
            ws.onerror = ({
                "AttackerIPTable.useEffect": (err_0)=>console.warn("WS error", err_0)
            })["AttackerIPTable.useEffect"];
            return ({
                "AttackerIPTable.useEffect": ()=>{
                    try {
                        ws.close();
                    } catch  {}
                    wsRef.current = null;
                }
            })["AttackerIPTable.useEffect"];
        }
    }["AttackerIPTable.useEffect"], []);
    const rows = Object.values(ipMap).sort((a, b)=>b.count - a.count);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 bg-[#0b1220] rounded-xl border border-white/10 shadow-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xl font-semibold mb-3 text-white",
                children: "Live Attacker IPs"
            }, void 0, false, {
                fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full text-left text-sm text-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "border-b border-white/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "p-2",
                                        children: "#"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "p-2",
                                        children: "IP Address"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "p-2",
                                        children: "Hits"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "p-2",
                                        children: "Last Seen"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "p-2",
                                        children: "Highest Severity"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                        lineNumber: 134,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: rows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: 5,
                                    className: "p-4 text-center text-gray-400",
                                    children: "No attacker IPs yet — run an attack to test."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                    lineNumber: 140,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                lineNumber: 139,
                                columnNumber: 34
                            }, this) : rows.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-b border-white/5 hover:bg-white/2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "p-2 align-top",
                                            children: i + 1
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                            lineNumber: 144,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "p-2 font-mono",
                                            children: r.ip
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                            lineNumber: 145,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "p-2",
                                            children: r.count
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                            lineNumber: 146,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "p-2",
                                            children: r.lastSeen ? new Date(r.lastSeen).toLocaleString() : "-"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                            lineNumber: 147,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "p-2",
                                            children: r.highestSeverity ?? "-"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                            lineNumber: 148,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, r.ip, true, {
                                    fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                                    lineNumber: 143,
                                    columnNumber: 42
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/analyst/dashboard/AttackerIPTable.tsx",
        lineNumber: 124,
        columnNumber: 10
    }, this);
}
_s(AttackerIPTable, "MYygQbBAO/ZhjUnzMOhwHZonC50=");
_c = AttackerIPTable;
var _c;
__turbopack_context__.k.register(_c, "AttackerIPTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/analyst/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnalystDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard_analyst$2f$Topbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard_analyst/Topbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard_analyst$2f$AttackCards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard_analyst/AttackCards.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analyst$2f$dashboard$2f$AttackerIPTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/analyst/dashboard/AttackerIPTable.tsx [app-client] (ecmascript)"); // ✅ ADD THIS IMPORT
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function AnalystDashboard() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "f48eb00abc5b6ddc0adab0fb47a055fe5b11e71badc30663a99c86de138d0341") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f48eb00abc5b6ddc0adab0fb47a055fe5b11e71badc30663a99c86de138d0341";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [assignedTasks, setAssignedTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t0);
    let t1;
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ({
            "AnalystDashboard[useEffect()]": ()=>{
                setAssignedTasks([
                    {
                        id: 1,
                        title: "Investigate Suspicious IP",
                        details: "IP: 103.88.1.44 \u2014 Possible Brute Force activity.",
                        deadline: "Today",
                        color: "blue"
                    },
                    {
                        id: 2,
                        title: "Analyze SQL Injection Pattern",
                        details: "Logs from Singapore Data Center.",
                        deadline: "2 Days",
                        color: "purple"
                    },
                    {
                        id: 3,
                        title: "Critical Alert Review",
                        details: "Critical Threat flagged at 02:11 AM.",
                        deadline: "Immediate",
                        color: "red"
                    }
                ]);
            }
        })["AnalystDashboard[useEffect()]"];
        t2 = [];
        $[2] = t1;
        $[3] = t2;
    } else {
        t1 = $[2];
        t2 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard_analyst$2f$Topbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/analyst/dashboard/page.tsx",
            lineNumber: 68,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#0b1220] p-6 rounded-2xl border border-blue-900/40 shadow-lg flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: "/analyst_landing.jpg",
                alt: "Ranger",
                className: "w-full max-w-sm drop-shadow-[0_0_25px_rgba(0,150,255,0.5)] rounded-xl"
            }, void 0, false, {
                fileName: "[project]/src/app/analyst/dashboard/page.tsx",
                lineNumber: 75,
                columnNumber: 125
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/analyst/dashboard/page.tsx",
            lineNumber: 75,
            columnNumber: 10
        }, this);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    let t6;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-2xl font-bold text-blue-400 mb-3",
            children: "Work Assigned"
        }, void 0, false, {
            fileName: "[project]/src/app/analyst/dashboard/page.tsx",
            lineNumber: 83,
            columnNumber: 10
        }, this);
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-gray-300 mb-6",
            children: "Below are the tasks assigned to you by the Admin."
        }, void 0, false, {
            fileName: "[project]/src/app/analyst/dashboard/page.tsx",
            lineNumber: 84,
            columnNumber: 10
        }, this);
        $[6] = t5;
        $[7] = t6;
    } else {
        t5 = $[6];
        t6 = $[7];
    }
    let t7;
    if ($[8] !== assignedTasks) {
        t7 = assignedTasks.map(_AnalystDashboardAssignedTasksMap);
        $[8] = assignedTasks;
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-6",
            children: [
                t4,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#0b1220] p-6 rounded-2xl border border-purple-900/40 shadow-lg",
                    children: [
                        t5,
                        t6,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: t7
                        }, void 0, false, {
                            fileName: "[project]/src/app/analyst/dashboard/page.tsx",
                            lineNumber: 101,
                            columnNumber: 161
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/analyst/dashboard/page.tsx",
                    lineNumber: 101,
                    columnNumber: 69
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/analyst/dashboard/page.tsx",
            lineNumber: 101,
            columnNumber: 10
        }, this);
        $[10] = t7;
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    let t9;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard_analyst$2f$AttackCards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/analyst/dashboard/page.tsx",
                lineNumber: 109,
                columnNumber: 31
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/analyst/dashboard/page.tsx",
            lineNumber: 109,
            columnNumber: 10
        }, this);
        $[12] = t9;
    } else {
        t9 = $[12];
    }
    let t10;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analyst$2f$dashboard$2f$AttackerIPTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/analyst/dashboard/page.tsx",
                lineNumber: 116,
                columnNumber: 33
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/analyst/dashboard/page.tsx",
            lineNumber: 116,
            columnNumber: 11
        }, this);
        $[13] = t10;
    } else {
        t10 = $[13];
    }
    let t11;
    if ($[14] !== t8) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t3,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full min-h-screen px-6 py-8 bg-[#020617] text-white",
                    children: [
                        t8,
                        t9,
                        t10
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/analyst/dashboard/page.tsx",
                    lineNumber: 123,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true);
        $[14] = t8;
        $[15] = t11;
    } else {
        t11 = $[15];
    }
    return t11;
}
_s(AnalystDashboard, "cq9m19ApHMMtRZSAe5A21NJmakQ=");
_c = AnalystDashboard;
function _AnalystDashboardAssignedTasksMap(task) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `p-4 rounded-xl bg-black/20 border shadow-md transition hover:scale-[1.02]
                    ${task.color === "blue" ? "border-blue-800/40 hover:bg-blue-900/10" : task.color === "purple" ? "border-purple-800/40 hover:bg-purple-900/10" : "border-red-800/40 hover:bg-red-900/10"}
                  `,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: `text-lg font-semibold ${task.color === "blue" ? "text-blue-300" : task.color === "purple" ? "text-purple-300" : "text-red-300"}`,
                children: task.title
            }, void 0, false, {
                fileName: "[project]/src/app/analyst/dashboard/page.tsx",
                lineNumber: 134,
                columnNumber: 22
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400 text-sm mt-1",
                children: task.details
            }, void 0, false, {
                fileName: "[project]/src/app/analyst/dashboard/page.tsx",
                lineNumber: 134,
                columnNumber: 185
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `text-xs mt-2 ${task.color === "blue" ? "text-blue-400" : task.color === "purple" ? "text-purple-400" : "text-red-400"}`,
                children: [
                    "Deadline: ",
                    task.deadline
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/analyst/dashboard/page.tsx",
                lineNumber: 134,
                columnNumber: 245
            }, this)
        ]
    }, task.id, true, {
        fileName: "[project]/src/app/analyst/dashboard/page.tsx",
        lineNumber: 132,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "AnalystDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_21696a01._.js.map