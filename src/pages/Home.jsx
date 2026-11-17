import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, MODULES } from '../data/modules';
import { Badge } from '../components/Shared';
import { Btn } from '../components/Buttons';
import { ContactForm } from '../components/ContactForm';
import { FaqList } from '../components/FaqList';
import { Icon } from '../components/Icon';

/* ─── Mock dashboard data ─── */
const MOCK_DATA = [
    {
        stats: [
            { label: "Active Visitors", val: "142", sub: "↑ 18% vs yesterday", color: "#1E8DE7" },
            { label: "Rooms Booked", val: "31/48", sub: "65% utilization", color: "#EEF4FF" },
            { label: "Open Tickets", val: "7", sub: "3 high priority", color: "#EEF4FF" },
            { label: "Facilities", val: "12", sub: "4 cities, 3 countries", color: "#EEF4FF" },
        ],
        visitors: [
            { init: "AK", name: "Anika Kapoor", time: "09:14", status: "Checked In", sCol: "#1E8DE7", bCol: "rgba(30,141,231,0.12)" },
            { init: "RJ", name: "Rohit Jain", time: "09:45", status: "Pre-registered", sCol: "#00D4FF", bCol: "rgba(0,212,255,0.08)" },
            { init: "SM", name: "Sara Menon", time: "10:02", status: "Checked In", sCol: "#1E8DE7", bCol: "rgba(30,141,231,0.12)" },
            { init: "DK", name: "Dev Kumar", time: "08:30", status: "Checked Out", sCol: "rgba(238,244,255,0.3)", bCol: "rgba(255,255,255,0.04)" },
        ],
        bars: [40, 60, 90, 70, 100, 50, 85],
        rooms: [
            { room: "Horizon A", status: "Booked", col: "#1E8DE7" },
            { room: "Summit B", status: "Available", col: "#00D4FF" },
            { room: "Apex C", status: "Booked", col: "#1E8DE7" },
        ],
    },
    {
        stats: [
            { label: "Active Visitors", val: "158", sub: "↑ 24% vs yesterday", color: "#1E8DE7" },
            { label: "Rooms Booked", val: "38/48", sub: "79% utilization", color: "#EEF4FF" },
            { label: "Open Tickets", val: "12", sub: "2 high priority", color: "#EEF4FF" },
            { label: "Facilities", val: "12", sub: "4 cities, 3 countries", color: "#EEF4FF" },
        ],
        visitors: [
            { init: "PK", name: "Priya Krishnan", time: "10:15", status: "Checked In", sCol: "#1E8DE7", bCol: "rgba(30,141,231,0.12)" },
            { init: "MS", name: "Mohan Sharma", time: "10:30", status: "Checked In", sCol: "#1E8DE7", bCol: "rgba(30,141,231,0.12)" },
            { init: "NR", name: "Nisha Reddy", time: "11:00", status: "Pre-registered", sCol: "#00D4FF", bCol: "rgba(0,212,255,0.08)" },
            { init: "AT", name: "Arjun Trivedi", time: "09:00", status: "Checked Out", sCol: "rgba(238,244,255,0.3)", bCol: "rgba(255,255,255,0.04)" },
        ],
        bars: [55, 75, 85, 95, 80, 65, 90],
        rooms: [
            { room: "Horizon A", status: "Available", col: "#00D4FF" },
            { room: "Summit B", status: "Booked", col: "#1E8DE7" },
            { room: "Apex C", status: "Available", col: "#00D4FF" },
        ],
    },
    {
        stats: [
            { label: "Active Visitors", val: "93", sub: "↑ 5% vs yesterday", color: "#1E8DE7" },
            { label: "Rooms Booked", val: "22/48", sub: "46% utilization", color: "#EEF4FF" },
            { label: "Open Tickets", val: "4", sub: "1 high priority", color: "#EEF4FF" },
            { label: "Facilities", val: "12", sub: "4 cities, 3 countries", color: "#EEF4FF" },
        ],
        visitors: [
            { init: "VN", name: "Vikram Nair", time: "08:45", status: "Checked In", sCol: "#1E8DE7", bCol: "rgba(30,141,231,0.12)" },
            { init: "KP", name: "Kavya Pillai", time: "09:10", status: "Checked In", sCol: "#1E8DE7", bCol: "rgba(30,141,231,0.12)" },
            { init: "RA", name: "Rahul Anand", time: "09:50", status: "Pre-registered", sCol: "#00D4FF", bCol: "rgba(0,212,255,0.08)" },
            { init: "SG", name: "Sandhya Gopal", time: "08:00", status: "Checked Out", sCol: "rgba(238,244,255,0.3)", bCol: "rgba(255,255,255,0.04)" },
        ],
        bars: [30, 45, 65, 50, 75, 40, 60],
        rooms: [
            { room: "Horizon A", status: "Booked", col: "#1E8DE7" },
            { room: "Summit B", status: "Booked", col: "#1E8DE7" },
            { room: "Apex C", status: "Available", col: "#00D4FF" },
        ],
    },
];

const MODULE_PATHS = {
    visitor: "/visitor-management", rooms: "/meeting-room-booking",
    helpdesk: "/helpdesk-ticketing", facility: "/facility-management",
    roles: "/role-user-management", analytics: "/analytics-insights",
};
const MODULE_RGB = { [T.blue]: "30,141,231", [T.purple]: "30,155,233", [T.amber]: "245,158,11" };

/* ─── Small reusable pieces ─── */
const SL = ({ children, center }) => (
    <div className={`section-label${center ? " center" : ""}`}>{children}</div>
);

const IBox = ({ name, color, rgb, size = 22, boxSize = 48 }) => (
    <div style={{
        width: boxSize, height: boxSize, borderRadius: 14, flexShrink: 0,
        background: `linear-gradient(135deg,rgba(${rgb},.14) 0%,rgba(${rgb},.05) 100%)`,
        border: `1px solid rgba(${rgb},.22)`,
        display: "flex", alignItems: "center", justifyContent: "center",
    }}>
        <Icon name={name} size={size} color={color} />
    </div>
);

/* Section wrapper */
const S = ({ id, bg = "#040C19", py = "140px", children }) => (
    <section id={id} style={{ padding: `${py} 5%`, background: bg, position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
    </section>
);

/* ════════════════════════════════════════ */
const Home = () => {
    const navigate = useNavigate();
    const [mockStep, setMockStep] = useState(0);
    const [mockLoading, setMockLoading] = useState(false);
    const interactiveRef = useRef(null);

    useEffect(() => {
        const cycle = setInterval(() => {
            setMockLoading(true);
            setTimeout(() => { setMockStep(s => (s + 1) % 3); setMockLoading(false); }, 600);
        }, 5000);

        let curX = 0, curY = 0, tgX = 0, tgY = 0;
        const tick = () => {
            curX += (tgX - curX) / 20; curY += (tgY - curY) / 20;
            if (interactiveRef.current)
                interactiveRef.current.style.transform = `translate(${Math.round(curX)}px,${Math.round(curY)}px)`;
            requestAnimationFrame(tick);
        };
        const onMouse = e => { tgX = e.clientX; tgY = e.clientY; };
        window.addEventListener('mousemove', onMouse); tick();

        const dMap = { d1: "0.06s", d2: "0.12s", d3: "0.18s", d4: "0.24s", d5: "0.30s", d6: "0.36s" };
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const cl = e.target.classList;
                if (cl.contains('reveal-left') || cl.contains('reveal-right') || cl.contains('reveal-scale')) cl.add('visible');
                else if (cl.contains('reveal')) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => {
            if (el.classList.contains('reveal')) {
                const delay = Object.entries(dMap).find(([c]) => el.classList.contains(c))?.[1] ?? "0s";
                el.style.opacity = "0"; el.style.transform = "translateY(22px)";
                el.style.transition = `opacity .85s cubic-bezier(.16,1,.3,1) ${delay},transform .85s cubic-bezier(.16,1,.3,1) ${delay}`;
            }
            obs.observe(el);
        });

        return () => { obs.disconnect(); window.removeEventListener('mousemove', onMouse); clearInterval(cycle); };
    }, []);

    const data = MOCK_DATA[mockStep];

    return (
        <div style={{ background: "#040C19" }}>

            {/* ══════════════════════════════════════
                HERO — two-column split
            ══════════════════════════════════════ */}
            <section className="hero-section">

                {/* Restrained gooey gradient */}
                <div className="gradient-bg" style={{ opacity: .5 }}>
                    <svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -9" result="goo" /><feBlend in="SourceGraphic" in2="goo" /></filter></defs></svg>
                    <div className="gradients-container">
                        <div className="g1" /><div className="g2" /><div className="g3" />
                        <div className="g4" /><div className="g5" />
                        <div ref={interactiveRef} className="interactive" />
                    </div>
                </div>

                {/* Dot grid */}
                <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: .4, zIndex: 1, pointerEvents: "none", maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 75%)" }} />

                {/* Radial glow */}
                <div style={{ position: "absolute", top: "-15%", left: "30%", width: 900, height: 800, background: "radial-gradient(ellipse at 40% 40%, rgba(30,141,231,.09) 0%, transparent 60%)", pointerEvents: "none", zIndex: 1 }} />


                <div className="hero-grid" style={{ maxWidth: 1160, margin: "0 auto", width: "100%", position: "relative", zIndex: 10 }}>

                    {/* LEFT: copy */}
                    <div className="hero-copy">
                        <div style={{ animation: "fadeUp .55s ease both", animationDelay: "0s" }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 100, background: "rgba(30,141,231,.08)", border: "1px solid rgba(30,141,231,.22)", marginBottom: 28 }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1E8DE7", display: "inline-block", animation: "glowPulse 2s ease-in-out infinite" }} />
                                <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1E8DE7" }}>Intelligent Facility Management</span>
                            </div>
                        </div>

                        <div style={{ animation: "fadeUp .65s ease both", animationDelay: "0.1s" }}>
                            <h1 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: "clamp(2.8rem,5.5vw,4.4rem)", letterSpacing: "-0.055em", color: "#EEF4FF", lineHeight: 1.0, marginBottom: 22 }}>
                                Your Facilities,<br />
                                <span className="grad-text">Intelligently</span><br />
                                Managed.
                            </h1>
                        </div>

                        <div style={{ animation: "fadeUp .65s ease both", animationDelay: "0.18s" }}>
                            <p style={{ fontSize: "0.98rem", color: "rgba(238,244,255,.52)", lineHeight: 1.85, fontWeight: 300, maxWidth: 430, marginBottom: 38 }}>
                                Nexspace unifies visitor management, room booking, helpdesk, and facility operations — one intelligent platform for the modern enterprise.
                            </p>
                        </div>

                        <div style={{ animation: "fadeUp .65s ease both", animationDelay: "0.25s" }}>
                            <div className="hero-btns">
                                <Btn onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Request a Demo</Btn>
                                <Btn variant="ghost" onClick={() => document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" })}>Explore Platform →</Btn>
                            </div>
                        </div>

                        {/* Trust metrics */}
                        <div style={{ animation: "fadeUp .65s ease both", animationDelay: "0.32s" }}>
                            <div className="hero-metrics">
                                {[{ num: "6", label: "Core Modules" }, { num: "DPDP", label: "Compliant" }, { num: "100%", label: "Multi-Tenant" }].map((m, i, arr) => (
                                    <div key={i} style={{ flex: 1, padding: "0 20px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,.07)" : "none", ...(i === 0 ? { paddingLeft: 0 } : {}) }}>
                                        <div style={{ fontFamily: "Inter", fontSize: "1.45rem", fontWeight: 800, color: "#EEF4FF", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4 }}>{m.num}</div>
                                        <div style={{ fontSize: "0.65rem", color: "rgba(238,244,255,.3)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: dashboard */}
                    <div style={{ animation: "scaleIn .9s cubic-bezier(.16,1,.3,1) both", animationDelay: "0.22s" }}>
                        <div className="float" style={{ background: "#080F1E", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, boxShadow: "0 56px 140px rgba(0,0,0,.7),0 0 0 1px rgba(30,141,231,.1),0 0 80px rgba(30,141,231,.05)", overflow: "hidden" }}>
                            {/* Title bar */}
                            <div style={{ background: "#0A1525", padding: "11px 18px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                                <div style={{ display: "flex", gap: 5 }}>
                                    {["#ff5f57", "#febc2e", "#28c840"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                                </div>
                                <div style={{ fontSize: "0.68rem", color: "rgba(238,244,255,.28)", fontWeight: 500 }}>Nexspace — Facility Dashboard</div>
                            </div>

                            <div style={{ padding: "20px 20px 22px" }}>
                                {/* Stats */}
                                <div className="dash-stats-grid">
                                    {data.stats.map((s, i) => (
                                        <div key={i} style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
                                            <div style={{ fontSize: "0.55rem", color: "rgba(238,244,255,.32)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.07em", marginBottom: 6 }}>{s.label}</div>
                                            <div style={{ height: 44, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                {mockLoading ? (
                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
                                                        <div className="skeleton-box" style={{ height: 26, width: "55%", margin: "0 auto 5px" }} />
                                                        <div className="skeleton-box" style={{ height: 9, width: "75%", margin: "0 auto" }} />
                                                    </div>
                                                ) : (
                                                    <div className="animate-fade-in" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                        <div style={{ fontFamily: "Inter", fontSize: "1.5rem", fontWeight: 800, color: s.color, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 2 }}>{s.val}</div>
                                                        <div style={{ fontSize: "0.58rem", color: "rgba(238,244,255,.28)" }}>{s.sub}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="dash-main-grid">
                                    {/* Visitors */}
                                    <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 12, padding: 18, minHeight: 210 }}>
                                        <div style={{ fontSize: "0.58rem", color: "rgba(238,244,255,.28)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Today's Visitors</div>
                                        {data.visitors.map((v, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.04)" : "none", height: 41 }}>
                                                {mockLoading ? (
                                                    <div style={{ display: "flex", gap: 10, width: "100%", alignItems: "center", height: 26 }}>
                                                        <div className="skeleton-box" style={{ width: 26, height: 26, borderRadius: "50%" }} />
                                                        <div className="skeleton-box" style={{ flex: 1, height: 12 }} />
                                                        <div className="skeleton-box" style={{ width: 55, height: 16, borderRadius: 100 }} />
                                                    </div>
                                                ) : (
                                                    <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", height: 26 }}>
                                                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: ["#1E8DE7", "#00A8D4", "#1E8DE7", "rgba(100,120,150,.4)"][i], color: "#040C19", fontSize: "0.62rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{v.init}</div>
                                                        <div style={{ flex: 1, fontSize: "0.75rem", color: "#EEF4FF", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.name}</div>
                                                        <div style={{ fontSize: "0.6rem", color: "rgba(238,244,255,.28)", whiteSpace: "nowrap" }}>{v.time}</div>
                                                        <div style={{ fontSize: "0.57rem", padding: "3px 8px", borderRadius: 100, background: v.bCol, color: v.sCol, fontWeight: 700, whiteSpace: "nowrap" }}>{v.status}</div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Rooms */}
                                    <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 12, padding: 18, minHeight: 210 }}>
                                        <div style={{ fontSize: "0.58rem", color: "rgba(238,244,255,.28)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Meeting Rooms</div>
                                        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 3, height: 52, marginBottom: 18, padding: "0 4px" }}>
                                            {data.bars.map((h, i) => (
                                                mockLoading
                                                    ? <div key={i} className="skeleton-box" style={{ width: "12%", height: `${h}%`, borderRadius: "2px 2px 0 0" }} />
                                                    : <div key={i} className="animate-fade-in" style={{ width: "12%", height: `${h}%`, background: i === 2 || i === 4 || i === 6 ? "#1E8DE7" : "rgba(30,141,231,.18)", borderRadius: "2px 2px 0 0", transition: "height 0.5s ease" }} />
                                            ))}
                                        </div>
                                        {data.rooms.map((r, i) => (
                                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.04)" : "none", height: 21 }}>
                                                {mockLoading
                                                    ? <div style={{ display: "flex", justifyContent: "space-between", width: "100%", height: 10 }}><div className="skeleton-box" style={{ width: 64, height: 10 }} /><div className="skeleton-box" style={{ width: 44, height: 10 }} /></div>
                                                    : <div className="animate-fade-in" style={{ display: "flex", justifyContent: "space-between", width: "100%", height: 10 }}><span style={{ fontSize: "0.7rem", color: "rgba(238,244,255,.4)" }}>{r.room}</span><span style={{ fontSize: "0.58rem", color: r.col, fontWeight: 700, textTransform: "uppercase" }}>{r.status}</span></div>
                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                TRUST PILLARS
            ══════════════════════════════════════ */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", background: "#060F1E" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 5%" }}>
                    <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
                        {[
                            { icon: "Zap", title: "Live in Days", desc: "First facility online within a week — no lengthy implementation cycles." },
                            { icon: "ShieldCheck", title: "DPDP Compliant", desc: "Architected around India's Digital Personal Data Protection Act, 2023." },
                            { icon: "Puzzle", title: "Modular by Design", desc: "Enable exactly the modules you need. Pay only for what you use." },
                            { icon: "Handshake", title: "Hands-On Onboarding", desc: "Dedicated support — real people, no ticket queues, no scripted calls." },
                        ].map((t, i, arr) => (
                            <div key={i} className={`reveal d${i + 1}`} style={{ padding: "0 28px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,.06)" : "none", ...(i === 0 ? { paddingLeft: 0 } : {}) }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 16, background: "linear-gradient(135deg,rgba(30,141,231,.12),rgba(0,212,255,.05))", border: "1px solid rgba(30,141,231,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Icon name={t.icon} size={18} color="#1E8DE7" />
                                </div>
                                <div style={{ fontFamily: "Inter", fontSize: "0.875rem", fontWeight: 700, color: "#EEF4FF", letterSpacing: "-0.02em", marginBottom: 8 }}>{t.title}</div>
                                <div style={{ fontSize: "0.78rem", color: "rgba(238,244,255,.38)", fontWeight: 300, lineHeight: 1.65 }}>{t.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                01 — MODULES
            ══════════════════════════════════════ */}
            <S id="modules">
                <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
                    <SL center>01 — Core Modules</SL>
                    <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,2.9rem)", letterSpacing: "-0.045em", color: "#EEF4FF", lineHeight: 1.05, marginBottom: 16 }}>Everything your facility needs.</h2>
                    <p style={{ fontSize: "0.95rem", color: "rgba(238,244,255,.42)", fontWeight: 300, lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}>Six purpose-built modules, each a product in its own right. Use one or combine all — they're stronger together.</p>
                </div>

                <div className="responsive-grid" style={{ "--cols": 3, "--cols-lg": 2, "--cols-md": 1, "--gap": "18px" }}>
                    {MODULES.map((m, i) => {
                        const rgb = MODULE_RGB[m.color] ?? "30,141,231";
                        return (
                            <div key={m.id} className={`reveal card-lift d${i + 1}`}
                                style={{ background: "#08111F", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, padding: "28px 26px", cursor: "pointer", display: "flex", flexDirection: "column" }}
                                onClick={() => navigate(MODULE_PATHS[m.id])}
                            >
                                <IBox name={m.icon} color={m.color} rgb={rgb} size={22} boxSize={48} />
                                <div style={{ flex: 1, marginTop: 20 }}>
                                    <div style={{ fontFamily: "Inter", fontSize: "0.95rem", fontWeight: 700, color: "#EEF4FF", letterSpacing: "-0.02em", marginBottom: 4 }}>{m.name}</div>
                                    <div style={{ fontSize: "0.74rem", color: m.color, fontWeight: 600, marginBottom: 12, opacity: .85 }}>{m.tagline}</div>
                                    <div style={{ fontSize: "0.81rem", color: "rgba(238,244,255,.42)", lineHeight: 1.72, fontWeight: 300 }}>{m.heroDesc}</div>
                                </div>
                                <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "0.75rem", color: "#1E8DE7", fontWeight: 600 }}>Learn more</span>
                                    <span style={{ fontSize: "0.82rem", color: "#1E8DE7" }}>→</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </S>

            {/* ══════════════════════════════════════
                02 — SECURITY
            ══════════════════════════════════════ */}
            <S id="security" bg="#060F1E">
                <div className="responsive-grid" style={{ "--cols": 2, "--cols-md": 1, "--gap": "80px", alignItems: "center" }}>
                    <div className="reveal-left">
                        <SL>02 — Security & Compliance</SL>
                        <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: "clamp(1.9rem,3vw,2.6rem)", letterSpacing: "-0.045em", color: "#EEF4FF", lineHeight: 1.05, marginBottom: 18 }}>Built secure.<br />Compliant by design.</h2>
                        <p style={{ fontSize: "0.9rem", color: "rgba(238,244,255,.45)", lineHeight: 1.82, fontWeight: 300, marginBottom: 36 }}>Nexspace is architected around India's Digital Personal Data Protection Act — so your facility data is always protected, private, and in your control.</p>
                        <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
                            <Badge>DPDP Compliant</Badge>
                            <Badge color={T.whiteMute}>End-to-End Secure</Badge>
                            <Badge color={T.whiteMute}>India-First</Badge>
                        </div>
                        {[
                            { icon: "UserCog", title: "Role-Based Access Control", desc: "Admins, SPOCs, and Frontdesk staff operate in fully scoped, isolated contexts." },
                            { icon: "ShieldCheck", title: "OTP & Passcode Verification", desc: "Visitor entry secured with time-bound OTPs — only authorised individuals gain access." },
                            { icon: "Fingerprint", title: "JWT Token Authentication", desc: "Separate App IDs ensure Admin Console and Tenant App are fully isolated." },
                        ].map((p, i) => (
                            <div key={i} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                                <IBox name={p.icon} color="#1E8DE7" rgb="30,141,231" size={17} boxSize={40} />
                                <div>
                                    <div style={{ fontFamily: "Inter", fontSize: "0.875rem", fontWeight: 700, color: "#EEF4FF", marginBottom: 4 }}>{p.title}</div>
                                    <div style={{ fontSize: "0.8rem", color: "rgba(238,244,255,.4)", fontWeight: 300, lineHeight: 1.65 }}>{p.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="reveal-right" style={{ background: "#08111F", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: "32px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#1E8DE7,#00D4FF,transparent)", opacity: .4 }} />
                        <div style={{ fontSize: "0.6rem", color: "rgba(238,244,255,.32)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "glowPulse 2s infinite" }} />
                            Compliance Status — Live
                        </div>
                        <div style={{ background: "rgba(30,141,231,.07)", border: "1px solid rgba(30,141,231,.18)", borderRadius: 14, padding: "18px 20px", marginBottom: 18 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1E8DE7,#00C8FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", color: "#040C19", fontWeight: 800, fontFamily: "Inter", flexShrink: 0 }}>D</div>
                                <div>
                                    <div style={{ fontFamily: "Inter", fontSize: "0.85rem", fontWeight: 700, color: "#EEF4FF" }}>DPDP Act, 2023</div>
                                    <div style={{ fontSize: "0.62rem", color: "rgba(238,244,255,.32)" }}>Digital Personal Data Protection Act — India</div>
                                </div>
                            </div>
                            <p style={{ fontSize: "0.78rem", color: "rgba(238,244,255,.4)", lineHeight: 1.65, fontWeight: 300 }}>Built in alignment with India's landmark data privacy legislation.</p>
                        </div>
                        {["Lawful purpose for all personal data", "Consent-based visitor data capture", "Data minimisation — only what's necessary", "Tenant-level data isolation enforced", "Secure credential storage, no plain-text", "Audit-ready access logs per facility"].map((c, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.78rem", color: "rgba(238,244,255,.42)", padding: "9px 14px", borderRadius: 10, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.05)", marginBottom: 6 }}>
                                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(0,212,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.58rem", color: "#00D4FF", flexShrink: 0 }}>✓</div>
                                {c}
                            </div>
                        ))}
                    </div>
                </div>
            </S>

            {/* ══════════════════════════════════════
                03 — MOBILE APPS
            ══════════════════════════════════════ */}
            <S id="apps">
                <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
                    <SL center>03 — Mobile Apps</SL>
                    <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,2.9rem)", letterSpacing: "-0.045em", color: "#EEF4FF", lineHeight: 1.05, marginBottom: 16 }}>Your facility, in your pocket.</h2>
                    <p style={{ fontSize: "0.95rem", color: "rgba(238,244,255,.42)", fontWeight: 300, lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>Purpose-built apps for tenants and operations teams — launching Q3 2026.</p>
                </div>

                <div className="responsive-grid" style={{ "--cols": 2, "--cols-md": 1, "--gap": "20px" }}>
                    {[
                        { name: "Nexspace", accent: "#1E8DE7", rgb: "30,141,231", icon: "Smartphone", audience: "Tenants & Visitors", tagline: "Employee Experience & Access", desc: "Empower your workforce with self-service tools that eliminate operational friction and enhance safety across every facility.", feats: [{ title: "Smart Access", desc: "Digital keys and meeting room QR check-ins." }, { title: "One-Click Booking", desc: "Reserve rooms or hot desks in under 5 seconds." }, { title: "Guest Invitations", desc: "Automated visitor invites with secure OTPs." }, { title: "Instant Helpdesk", desc: "Raise tickets with photos directly to operations." }] },
                        { name: "Opstrack", accent: "#00D4FF", rgb: "0,212,255", icon: "LayoutDashboard", audience: "Operations & Admin", tagline: "Field Operations & Control", desc: "The operational command center for on-ground staff to manage every inch of your facility with real-time visibility.", feats: [{ title: "Live Verify", desc: "Real-time visitor identity & credential validation." }, { title: "Task Dispatch", desc: "Automated ticket routing for maintenance teams." }, { title: "Facility Ops", desc: "Full operational visibility across all inventory." }, { title: "Audit Readiness", desc: "Instant digital logs for every facility event." }] },
                    ].map((app, i) => (
                        <div key={i} className="reveal card-lift" style={{ background: "#08111F", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: "40px 36px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                            <div style={{ position: "absolute", top: 0, left: 36, width: 56, height: 2, background: `linear-gradient(90deg,${app.accent},transparent)` }} />
                            <div style={{ position: "absolute", bottom: 0, right: 36, width: 56, height: 2, background: `linear-gradient(270deg,${app.accent},transparent)` }} />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                                <IBox name={app.icon} color={app.accent} rgb={app.rgb} size={26} boxSize={56} />
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "0.62rem", fontWeight: 700, color: app.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>{app.audience}</div>
                                    <div style={{ fontSize: "0.72rem", color: "rgba(238,244,255,.28)" }}>Native iOS & Android</div>
                                </div>
                            </div>
                            <div style={{ fontFamily: "Inter", fontSize: "1.75rem", fontWeight: 800, color: "#EEF4FF", letterSpacing: "-0.04em", marginBottom: 4 }}>{app.name}</div>
                            <div style={{ fontSize: "0.85rem", color: app.accent, fontWeight: 600, marginBottom: 16, opacity: .9 }}>{app.tagline}</div>
                            <p style={{ fontSize: "0.85rem", color: "rgba(238,244,255,.4)", lineHeight: 1.75, fontWeight: 300, marginBottom: 32, maxWidth: "92%" }}>{app.desc}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, marginBottom: 32 }}>
                                {app.feats.map((f, j) => (
                                    <div key={j} style={{ display: "flex", gap: 12 }}>
                                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: app.accent, marginTop: 8, flexShrink: 0, opacity: .7 }} />
                                        <div>
                                            <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#EEF4FF", marginBottom: 2 }}>{f.title}</div>
                                            <div style={{ fontSize: "0.76rem", color: "rgba(238,244,255,.35)", fontWeight: 300 }}>{f.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", animation: "glowPulse 2s infinite" }} />
                                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#EEF4FF", letterSpacing: "0.05em" }}>AVAILABLE Q3 2026</span>
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
                                    <Icon name="Apple" size={16} color="rgba(238,244,255,.28)" />
                                    <Icon name="PlayCircle" size={16} color="rgba(238,244,255,.28)" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </S>

            {/* ══════════════════════════════════════
                04 — PRICING
            ══════════════════════════════════════ */}
            <S id="pricing" bg="#060F1E">
                <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
                    <SL center>04 — Pricing</SL>
                    <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,2.9rem)", letterSpacing: "-0.045em", color: "#EEF4FF", lineHeight: 1.05, marginBottom: 16 }}>Simple, transparent pricing.</h2>
                    <p style={{ fontSize: "0.95rem", color: "rgba(238,244,255,.42)", fontWeight: 300, lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>Start free, scale as you grow. No hidden fees, no lock-in.</p>
                </div>

                <div className="responsive-grid" style={{ "--cols": 3, "--cols-lg": 2, "--cols-md": 1, "--gap": "20px", alignItems: "stretch" }}>
                    {[
                        { plan: "Starter", price: "₹0", period: "/mo", desc: "For small teams exploring Nexspace.", featured: false, feats: ["1 Facility", "Up to 10 users", "Visitor Management", "Meeting Room Booking"], missing: ["Helpdesk & Ticketing", "Analytics Dashboard", "Priority Support"], cta: "Get Started Free" },
                        { plan: "Growth", price: "₹4,999", period: "/mo", desc: "For growing organisations.", featured: true, feats: ["Up to 5 Facilities", "Up to 100 users", "Visitor Management", "Meeting Room Booking", "Helpdesk & Ticketing", "Analytics Dashboard"], missing: ["Priority Support"], cta: "Request a Demo" },
                        { plan: "Enterprise", price: "Custom", period: "", desc: "For large enterprises.", featured: false, feats: ["Unlimited Facilities", "Unlimited users", "All modules included", "DPDP compliance support", "Dedicated onboarding", "Priority Support + SLA"], missing: [], cta: "Talk to Sales" },
                    ].map((p, i) => {
                        const inner = (
                            <div className={`reveal d${i + 1}`} style={{ display: "flex", flexDirection: "column", background: "#08111F", border: p.featured ? "none" : "1px solid rgba(255,255,255,.07)", borderRadius: p.featured ? 21 : 20, padding: "36px 28px", position: "relative", overflow: "hidden", height: "100%" }}>
                                {p.featured && <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#1E8DE7,#00C8FF)", color: "#040C19", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 18px", borderRadius: "0 0 10px 10px", whiteSpace: "nowrap" }}>Most Popular</div>}
                                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: p.featured ? "#1E8DE7" : "rgba(238,244,255,.28)", marginBottom: 14 }}>{p.plan}</div>
                                <div style={{ fontFamily: "Inter", fontSize: "2.6rem", fontWeight: 800, color: "#EEF4FF", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 6 }}>{p.price}<span style={{ fontSize: "0.8rem", color: "rgba(238,244,255,.28)", fontWeight: 400 }}>{p.period}</span></div>
                                <div style={{ fontSize: "0.8rem", color: "rgba(238,244,255,.32)", marginBottom: 22, fontWeight: 300 }}>{p.desc}</div>
                                <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${p.featured ? "rgba(30,141,231,.35)" : "rgba(255,255,255,.07)"},transparent)`, marginBottom: 22 }} />
                                <ul style={{ listStyle: "none", flex: 1, marginBottom: 28 }}>
                                    {p.feats.map((f, j) => <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.82rem", color: "rgba(238,244,255,.58)", marginBottom: 11 }}><span style={{ color: "#10b981", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{f}</li>)}
                                    {p.missing.map((f, j) => <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.82rem", color: "rgba(238,244,255,.18)", marginBottom: 11 }}><span style={{ flexShrink: 0, marginTop: 1 }}>–</span>{f}</li>)}
                                </ul>
                                <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                                    style={{ padding: "13px 24px", borderRadius: 10, fontFamily: "Inter", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", transition: "all 0.22s ease", background: p.featured ? "linear-gradient(135deg,#1E8DE7,#00C8FF)" : "transparent", color: p.featured ? "#040C19" : "#EEF4FF", border: p.featured ? "none" : "1px solid rgba(255,255,255,.1)", boxShadow: p.featured ? "0 4px 20px rgba(30,141,231,.4)" : "none" }}
                                    onMouseEnter={e => { if (p.featured) { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)"; } else { e.currentTarget.style.borderColor = "rgba(30,141,231,.4)"; e.currentTarget.style.background = "rgba(30,141,231,.07)"; } }}
                                    onMouseLeave={e => { if (p.featured) { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; } else { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.background = "transparent"; } }}
                                >{p.cta}</button>
                            </div>
                        );
                        return p.featured
                            ? <div key={i} className="pricing-featured-wrap" style={{ transform: "scale(1.025)" }}><div className="pricing-featured-inner">{inner}</div></div>
                            : <div key={i}>{inner}</div>;
                    })}
                </div>
                <p className="reveal" style={{ textAlign: "center", fontSize: "0.76rem", color: "rgba(238,244,255,.25)", marginTop: 28 }}>All prices exclusive of GST. Annual billing available at 20% discount.{" "}<button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", color: "#1E8DE7", cursor: "pointer", fontSize: "0.76rem", fontFamily: "DM Sans" }}>Need a custom bundle?</button></p>
            </S>

            {/* ══════════════════════════════════════
                05 — ROADMAP
            ══════════════════════════════════════ */}
            <S id="roadmap">
                <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
                    <SL center>05 — Product Roadmap</SL>
                    <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,2.9rem)", letterSpacing: "-0.045em", color: "#EEF4FF", lineHeight: 1.05, marginBottom: 16 }}>What we're building — openly.</h2>
                    <p style={{ fontSize: "0.95rem", color: "rgba(238,244,255,.42)", fontWeight: 300, lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}>We believe in full transparency. Here's what's live and what's coming next.</p>
                </div>

                {[
                    { phase: "Live Now", color: "#00D4FF", rgb: "0,212,255", dot: "#10b981", items: [{ icon: "Users", title: "Visitor Management", q: "Available Today", desc: "Secure check-ins and digital logbooks for your lobby." }, { icon: "Calendar", title: "Meeting Room Booking", q: "Available Today", desc: "Real-time room availability and smart booking." }, { icon: "Ticket", title: "Helpdesk & Ticketing", q: "Available Today", desc: "Issue reporting and SLA-tracked resolution." }] },
                    { phase: "Coming Soon", color: "#F59E0B", rgb: "245,158,11", dot: "#F59E0B", items: [{ icon: "Gamepad2", title: "Gaming Room Bookings", q: "Q2 2026", desc: "Enable employees to book recreational spaces easily." }, { icon: "HardDrive", title: "Asset Management", q: "Q3 2026", desc: "Track and manage facility assets with precision." }] },
                    { phase: "Planned", color: "rgba(238,244,255,.22)", rgb: "238,244,255", dot: "rgba(238,244,255,.22)", items: [{ icon: "Package", title: "Procurement", q: "Q4 2026", desc: "Integrated vendor management and purchase approvals." }] },
                ].map((phase, pi) => (
                    <div key={pi} className="reveal" style={{ marginBottom: 48 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 16px", borderRadius: 100, whiteSpace: "nowrap", background: `rgba(${phase.rgb},.08)`, color: phase.color, border: `1px solid rgba(${phase.rgb},.18)` }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: phase.dot, display: "inline-block", animation: pi === 0 ? "glowPulse 2s infinite" : "none" }} />
                                {phase.phase}
                            </div>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
                        </div>
                        <div className="responsive-grid" style={{ "--cols": phase.items.length, "--cols-lg": Math.min(phase.items.length, 2), "--cols-md": 1, "--gap": "16px" }}>
                            {phase.items.map((item, ii) => (
                                <div key={ii} className="card-lift" style={{ background: "#08111F", border: `1px solid ${pi === 0 ? `rgba(${phase.rgb},.14)` : "rgba(255,255,255,.06)"}`, borderRadius: 16, padding: 24, position: "relative", overflow: "hidden" }}>
                                    {pi === 0 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${phase.color},transparent)`, opacity: .3 }} />}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                        <IBox name={item.icon} color={phase.color} rgb={phase.rgb} size={20} boxSize={42} />
                                        <div style={{ fontSize: "0.62rem", color: "rgba(238,244,255,.28)", letterSpacing: "0.05em" }}>{item.q}</div>
                                    </div>
                                    <div style={{ fontFamily: "Inter", fontSize: "0.9rem", fontWeight: 700, color: "#EEF4FF", letterSpacing: "-0.02em", marginBottom: 6 }}>{item.title}</div>
                                    <div style={{ fontSize: "0.78rem", color: "rgba(238,244,255,.38)", fontWeight: 300, lineHeight: 1.6 }}>{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="reveal" style={{ padding: "26px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", background: "rgba(30,141,231,.05)", border: "1px solid rgba(30,141,231,.12)", borderRadius: 14 }}>
                    <div>
                        <div style={{ fontFamily: "Inter", fontSize: "0.92rem", fontWeight: 700, color: "#EEF4FF", marginBottom: 4 }}>Have a feature in mind?</div>
                        <div style={{ fontSize: "0.8rem", color: "rgba(238,244,255,.35)", fontWeight: 300 }}>We build with our customers — your input shapes what we prioritise next.</div>
                    </div>
                    <Btn onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Suggest a Feature →</Btn>
                </div>
            </S>

            {/* ══════════════════════════════════════
                06 — FAQ
            ══════════════════════════════════════ */}
            <S id="faq" bg="#060F1E">
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
                        <SL center>06 — FAQ</SL>
                        <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,2.9rem)", letterSpacing: "-0.045em", color: "#EEF4FF" }}>Questions we get asked.</h2>
                    </div>
                    <FaqList />
                </div>
            </S>

            {/* ══════════════════════════════════════
                07 — CONTACT
            ══════════════════════════════════════ */}
            <S id="contact">
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 500, background: "radial-gradient(ellipse,rgba(30,141,231,.06) 0%,transparent 70%)", pointerEvents: "none" }} />
                <div className="responsive-grid" style={{ "--cols": 2, "--cols-md": 1, "--gap": "72px", alignItems: "start" }}>
                    <div className="reveal-left">
                        <SL>07 — Get in Touch</SL>
                        <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: "clamp(1.9rem,3vw,2.6rem)", letterSpacing: "-0.045em", color: "#EEF4FF", lineHeight: 1.05, marginBottom: 18 }}>Let's show you what Nexspace can do.</h2>
                        <p style={{ fontSize: "0.9rem", color: "rgba(238,244,255,.42)", lineHeight: 1.82, fontWeight: 300, marginBottom: 44 }}>We'll walk you through the platform, answer every question, and set up a trial tailored to your facility — at no cost.</p>
                        {[
                            { icon: "Timer", title: "Same-day response", desc: "We respond to every demo request within a few hours during business hours." },
                            { icon: "Target", title: "Tailored walkthrough", desc: "We customise the demo to your industry, facility size, and specific use case." },
                            { icon: "Handshake", title: "No commitment required", desc: "No pressure, no contracts. Just a real conversation about your needs." },
                        ].map((pt, i) => (
                            <div key={i} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                                <IBox name={pt.icon} color="#1E8DE7" rgb="30,141,231" size={17} boxSize={40} />
                                <div>
                                    <div style={{ fontFamily: "Inter", fontSize: "0.875rem", fontWeight: 700, color: "#EEF4FF", marginBottom: 4 }}>{pt.title}</div>
                                    <div style={{ fontSize: "0.8rem", color: "rgba(238,244,255,.35)", fontWeight: 300, lineHeight: 1.65 }}>{pt.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="reveal-right"><ContactForm /></div>
                </div>
            </S>

            <style>{`
                @media (max-width: 768px) { .trust-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; } .trust-grid > div { padding: 0 !important; } }
                @media (max-width: 480px) { .trust-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </div>
    );
};

export default Home;
