import { useState, useEffect, useRef } from 'react';
import { T } from '../data/modules';
import { Logo } from '../components/Shared';

const sections = [
    {
        id: "eligibility",
        number: "01",
        title: "Eligibility & Account Registration",
        content: [
            {
                type: "numbered-prefix", items: [
                    { prefix: "1.1", text: "You must be legally capable of entering into a binding contract under Indian law to use Nexspace." },
                    { prefix: "1.2", text: "Accounts must be created using official company credentials. You are responsible for maintaining the confidentiality of login information." },
                    { prefix: "1.3", text: "You agree to provide accurate and complete information during registration and keep it updated." }
                ]
            }
        ]
    },
    {
        id: "scope",
        number: "02",
        title: "Scope of Services",
        content: [
            {
                type: "numbered-prefix", items: [
                    { prefix: "2.1", text: "Nexspace provides workplace and facility management services including, but not limited to, visitor management, meeting room booking, vendor management, attendance, reporting, and related modules." },
                    { prefix: "2.2", text: "Services are provided on a subscription basis and may vary depending on the plan selected." }
                ]
            }
        ]
    },
    {
        id: "acceptable-use",
        number: "03",
        title: "Acceptable Use",
        content: [
            { type: "text", value: "You agree not to:" },
            {
                type: "list", items: [
                    "Use the platform for unlawful, harmful, or fraudulent purposes",
                    "Interfere with or disrupt system integrity or security",
                    "Attempt unauthorized access to systems, data, or networks",
                    "Upload malicious software, viruses, or harmful code",
                    "Use Nexspace to infringe intellectual property or privacy rights"
                ]
            },
            { type: "highlight", value: "Nexspace reserves the right to suspend or terminate access for violations." }
        ]
    },
    {
        id: "payments",
        number: "04",
        title: "Subscriptions, Fees & Payments",
        content: [
            {
                type: "numbered-prefix", items: [
                    { prefix: "4.1", text: "Subscription fees, billing cycles, credits, and usage limits are defined in the applicable Order Form or invoice." },
                    { prefix: "4.2", text: "Fees are payable in advance and are non-refundable unless expressly stated otherwise." },
                    { prefix: "4.3", text: "Nexspace may suspend services for non-payment after due notice." }
                ]
            }
        ]
    },
    {
        id: "free-trials",
        number: "05",
        title: "Free Trials",
        content: [
            {
                type: "numbered-prefix", items: [
                    { prefix: "5.1", text: "Nexspace may offer free trials for a limited duration." },
                    { prefix: "5.2", text: "Free trials are provided on an \"AS IS\" basis without warranties or SLA commitments." },
                    { prefix: "5.3", text: "Nexspace may modify or terminate free trials at its discretion." }
                ]
            }
        ]
    },
    {
        id: "user-responsibilities",
        number: "06",
        title: "User Responsibilities",
        content: [
            {
                type: "numbered-prefix", items: [
                    { prefix: "6.1", text: "You are responsible for all activities performed through your account." },
                    { prefix: "6.2", text: "You shall ensure that your Authorized Users comply with these Terms." },
                    { prefix: "6.3", text: "You are responsible for compliance with applicable laws while using Nexspace." }
                ]
            }
        ]
    },
    {
        id: "data-privacy",
        number: "07",
        title: "Data & Privacy",
        content: [
            {
                type: "numbered-prefix", items: [
                    { prefix: "7.1", text: "You retain ownership of all data submitted to Nexspace." },
                    { prefix: "7.2", text: "Nexspace processes data as a Data Processor in accordance with applicable data protection laws." },
                    { prefix: "7.3", text: "By using the platform, you consent to data processing as described in Nexspace's Privacy Policy." }
                ]
            }
        ]
    },
    {
        id: "intellectual-property",
        number: "08",
        title: "Intellectual Property",
        content: [
            {
                type: "numbered-prefix", items: [
                    { prefix: "8.1", text: "All intellectual property rights in Nexspace, including software, branding, and documentation, remain the exclusive property of Nexspace." },
                    { prefix: "8.2", text: "You are granted a limited, non-exclusive, non-transferable right to use the platform during the subscription term." }
                ]
            }
        ]
    },
    {
        id: "availability",
        number: "09",
        title: "Service Availability & Support",
        content: [
            {
                type: "numbered-prefix", items: [
                    { prefix: "9.1", text: "Nexspace targets a monthly uptime of 99.5%, excluding scheduled maintenance." },
                    { prefix: "9.2", text: "Support is provided as per the applicable Service Level Agreement (SLA)." }
                ]
            }
        ]
    },
    {
        id: "third-party",
        number: "10",
        title: "Third-Party Services",
        content: [
            { type: "text", value: "Nexspace may integrate with third-party services. Nexspace is not responsible for third-party services or content." }
        ]
    },
    {
        id: "termination",
        number: "11",
        title: "Termination & Suspension",
        content: [
            {
                type: "numbered-prefix", items: [
                    { prefix: "11.1", text: "Nexspace may suspend or terminate access for violation of these Terms, non-payment, or unlawful usage." },
                    { prefix: "11.2", text: "Upon termination, access to the platform will cease." }
                ]
            }
        ]
    },
    {
        id: "warranties",
        number: "12",
        title: "Disclaimer of Warranties",
        content: [
            { type: "highlight", value: "Nexspace is provided on an \"AS IS\" and \"AS AVAILABLE\" basis. Nexspace disclaims all warranties, express or implied." }
        ]
    },
    {
        id: "liability",
        number: "13",
        title: "Limitation of Liability",
        content: [
            { type: "text", value: "To the maximum extent permitted by law, Nexspace shall not be liable for indirect, incidental, or consequential damages. Total liability shall not exceed fees paid in the preceding 12 months." }
        ]
    },
    {
        id: "indemnity",
        number: "14",
        title: "Indemnity",
        content: [
            { type: "text", value: "You agree to indemnify and hold harmless Nexspace from claims arising out of misuse of the platform or violation of these Terms." }
        ]
    },
    {
        id: "modifications",
        number: "15",
        title: "Modifications to Terms",
        content: [
            { type: "text", value: "Nexspace may update these Terms from time to time. Continued use after changes constitutes acceptance." }
        ]
    },
    {
        id: "governing-law",
        number: "16",
        title: "Governing Law & Jurisdiction",
        content: [
            { type: "highlight", value: "These Terms shall be governed by and construed in accordance with the laws of India. Courts at Bengaluru, Karnataka shall have exclusive jurisdiction." }
        ]
    },
    {
        id: "contact",
        number: "17",
        title: "Contact Information",
        content: [
            { type: "text", value: "For any questions regarding these Terms, please contact:" },
            { type: "contact", name: "Nexspace", email: "support@nexspace.app" }
        ]
    }
];

const renderContent = (content) => content.map((block, i) => {
    if (block.type === "text") return (
        <p key={i} style={{ fontSize: "0.95rem", color: T.whiteDim, lineHeight: 1.9, fontWeight: 300, marginBottom: 16 }}>
            {block.value}
        </p>
    );
    if (block.type === "highlight") return (
        <div key={i} style={{ background: "rgba(30,141,231,0.06)", border: `1px solid rgba(30,141,231,0.18)`, borderLeft: `3px solid ${T.blue}`, borderRadius: "0 10px 10px 0", padding: "16px 20px", marginBottom: 16 }}>
            <p style={{ fontSize: "0.95rem", color: T.white, lineHeight: 1.85, fontWeight: 300, margin: 0 }}>{block.value}</p>
        </div>
    );
    if (block.type === "list") return (
        <ul key={i} style={{ paddingLeft: 0, listStyle: "none", marginBottom: 16 }}>
            {block.items.map((item, j) => (
                <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10, fontSize: "0.95rem", color: T.whiteDim, lineHeight: 1.75, fontWeight: 300 }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(30,141,231,0.12)", border: "1px solid rgba(30,141,231,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.blue, display: "block" }} />
                    </span>
                    {item}
                </li>
            ))}
        </ul>
    );
    if (block.type === "numbered-prefix") return (
        <div key={i}>
            {block.items.map((item, j) => (
                <div key={j} style={{ display: "flex", gap: 14, marginBottom: 14, padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: `1px solid ${T.border}`, borderRadius: 10 }}>
                    <span style={{ fontSize: "0.72rem", fontFamily: "Inter, sans-serif", fontWeight: 700, color: T.blue, flexShrink: 0, marginTop: 3, minWidth: 28 }}>{item.prefix}</span>
                    <p style={{ fontSize: "0.95rem", color: T.whiteDim, lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{item.text}</p>
                </div>
            ))}
        </div>
    );
    if (block.type === "contact") return (
        <div key={i} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", background: T.navyCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(30,141,231,0.1)", border: "1px solid rgba(30,141,231,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            </div>
            <div>
                <p style={{ fontSize: "0.82rem", fontFamily: "Inter, sans-serif", fontWeight: 600, color: T.white, marginBottom: 3 }}>{block.name}</p>
                <a href={`mailto:${block.email}`} style={{ fontSize: "0.88rem", color: T.blue, textDecoration: "none", fontWeight: 400 }}>{block.email}</a>
            </div>
        </div>
    );
    return null;
});

const TermsOfService = () => {
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const [tocOpen, setTocOpen] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: "-20% 0px -70% 0px" }
        );
        sections.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setTocOpen(false);
    };

    return (
        <div style={{ background: T.navy, minHeight: "100vh", fontFamily: "DM Sans, sans-serif" }}>
            {/* Hero */}
            <div style={{ position: "relative", background: T.navyMid, borderBottom: `1px solid ${T.border}`, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 70% 120% at 60% 50%, rgba(30,141,231,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.blue}, rgba(30,141,231,0.3), transparent)` }} />
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(48px,8vw,80px) 5% clamp(40px,6vw,64px)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 32, position: "relative" }}>
                    <div>
                        <div style={{ marginBottom: 28 }}>
                            <Logo size={32} onClick={() => window.open("/", "_self")} />
                        </div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(30,141,231,0.1)", border: "1px solid rgba(30,141,231,0.2)", borderRadius: 20, padding: "4px 12px", marginBottom: 20 }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                            <span style={{ fontSize: "0.68rem", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.blue }}>Terms of Service</span>
                        </div>
                        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,3rem)", color: T.white, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16 }}>
                            Terms that<br />protect both sides.
                        </h1>
                        <p style={{ fontSize: "clamp(0.9rem,2vw,1rem)", color: T.whiteDim, lineHeight: 1.75, fontWeight: 300, maxWidth: 520 }}>
                            These Terms govern access to and use of Nexspace, owned and operated by Nexspace
                        </p>
                    </div>
                    <div className="legal-meta" style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                        <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: 10, textAlign: "right" }}>
                            <div style={{ fontSize: "0.68rem", color: T.whiteMute, fontFamily: "Inter, sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Last Updated</div>
                            <div style={{ fontSize: "0.88rem", color: T.whiteDim, fontWeight: 400 }}>March 2025</div>
                        </div>
                        <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: 10, textAlign: "right" }}>
                            <div style={{ fontSize: "0.68rem", color: T.whiteMute, fontFamily: "Inter, sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Jurisdiction</div>
                            <div style={{ fontSize: "0.88rem", color: T.whiteDim, fontWeight: 400 }}>Bengaluru, India</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile TOC toggle */}
            <div className="mobile-toc-toggle" style={{ display: "none" }}>
                <div style={{ padding: "0 5% 0", borderBottom: `1px solid ${T.border}`, background: T.navyMid }}>
                    <button
                        onClick={() => setTocOpen(!tocOpen)}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", background: "none", border: "none", color: T.whiteDim, fontSize: "0.85rem", fontFamily: "DM Sans, sans-serif", cursor: "pointer" }}
                    >
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                            Jump to section
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: tocOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    {tocOpen && (
                        <div style={{ paddingBottom: 16 }}>
                            {sections.map(s => (
                                <button key={s.id} onClick={() => scrollTo(s.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 0", background: "none", border: "none", fontSize: "0.85rem", color: activeSection === s.id ? T.blue : T.whiteDim, fontFamily: "DM Sans, sans-serif", cursor: "pointer" }}>
                                    <span style={{ color: T.whiteMute, marginRight: 8, fontSize: "0.72rem", fontFamily: "Inter, sans-serif" }}>{s.number}</span>
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Body: sidebar + content */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 5% clamp(48px,8vw,80px)", display: "flex", gap: "clamp(32px,5vw,72px)", alignItems: "flex-start" }}>

                {/* Sticky Sidebar */}
                <aside className="desktop-sidebar" style={{ width: 240, flexShrink: 0, position: "sticky", top: 32, paddingTop: 48 }}>
                    <p style={{ fontSize: "0.68rem", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.whiteMute, marginBottom: 16 }}>
                        Contents
                    </p>
                    <nav>
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => scrollTo(s.id)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                                    padding: "8px 10px", marginBottom: 2, background: activeSection === s.id ? "rgba(30,141,231,0.08)" : "none",
                                    border: activeSection === s.id ? "1px solid rgba(30,141,231,0.15)" : "1px solid transparent",
                                    borderRadius: 8, cursor: "pointer", transition: "all 0.2s", fontFamily: "DM Sans, sans-serif"
                                }}
                                onMouseEnter={e => { if (activeSection !== s.id) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                                onMouseLeave={e => { if (activeSection !== s.id) e.currentTarget.style.background = "none"; }}
                            >
                                <span style={{ fontSize: "0.65rem", fontFamily: "Inter, sans-serif", fontWeight: 700, color: activeSection === s.id ? T.blue : T.whiteMute, minWidth: 22, flexShrink: 0 }}>{s.number}</span>
                                <span style={{ fontSize: "0.82rem", color: activeSection === s.id ? T.white : T.whiteDim, lineHeight: 1.35, fontWeight: activeSection === s.id ? 500 : 300 }}>{s.title}</span>
                            </button>
                        ))}
                    </nav>

                    <div style={{ marginTop: 32, padding: "16px", background: "rgba(255,255,255,0.02)", border: `1px solid ${T.border}`, borderRadius: 10 }}>
                        <p style={{ fontSize: "0.72rem", color: T.whiteMute, lineHeight: 1.6, fontWeight: 300, marginBottom: 8 }}>
                            Questions about these terms?
                        </p>
                        <a href="mailto:support@nexspace.app" style={{ fontSize: "0.78rem", color: T.blue, textDecoration: "none", fontWeight: 400, display: "flex", alignItems: "center", gap: 5 }}>
                            Contact us →
                        </a>
                    </div>
                </aside>

                {/* Main Content */}
                <main ref={contentRef} className="content-area" style={{ flex: 1, minWidth: 0, paddingTop: 48 }}>
                    {sections.map((section, idx) => (
                        <div
                            key={section.id}
                            id={section.id}
                            style={{
                                marginBottom: idx === sections.length - 1 ? 0 : 48,
                                paddingBottom: 48,
                                borderBottom: idx === sections.length - 1 ? "none" : `1px solid ${T.border}`,
                                scrollMarginTop: 32
                            }}
                        >
                            {/* Section header */}
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(30,141,231,0.08)", border: "1px solid rgba(30,141,231,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <span style={{ fontSize: "0.68rem", fontFamily: "Inter, sans-serif", fontWeight: 800, color: T.blue }}>{section.number}</span>
                                </div>
                                <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "clamp(1.05rem,2.5vw,1.25rem)", color: T.white, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                                    {section.title}
                                </h2>
                            </div>
                            {renderContent(section.content)}
                        </div>
                    ))}

                    {/* Bottom cross-link */}
                    <div style={{ marginTop: 16, padding: "20px 24px", background: T.navyMid, border: `1px solid ${T.border}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <p style={{ fontSize: "0.85rem", color: T.whiteDim, fontWeight: 300 }}>
                            Review our Privacy Policy to understand how your data is handled.
                        </p>
                        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: "0.82rem", color: T.blue, textDecoration: "none", fontFamily: "Inter, sans-serif", fontWeight: 600, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                            Privacy Policy →
                        </a>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TermsOfService;
