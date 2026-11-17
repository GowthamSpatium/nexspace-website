import { useState, useEffect, useRef } from 'react';
import { T } from '../data/modules';
import { Logo } from '../components/Shared';

const sections = [
    {
        id: "applicability",
        number: "01",
        title: "Applicability",
        content: [
            { type: "text", value: "This Policy applies to all users, customers, employees, visitors, vendors, and other individuals whose data is processed through Nexspace." }
        ]
    },
    {
        id: "information-we-collect",
        number: "02",
        title: "Information We Collect",
        content: [
            { type: "subheading", value: "Provided by Customers" },
            { type: "text", value: "We may collect the following information when customers or authorized users use the platform:" },
            { type: "list", items: ["Company details (name, address, GST details)", "User details (name, official email ID, phone number, designation)", "Login credentials (encrypted)", "Visitor, vendor, and employee information entered by customers", "Meeting, attendance, and access logs"] },
            { type: "subheading", value: "Automatically Collected" },
            { type: "list", items: ["IP address", "Browser type and device information", "Usage logs and timestamps"] },
            { type: "subheading", value: "Sensitive Personal Data" },
            { type: "text", value: "Nexspace does not intentionally collect sensitive personal data unless required for providing the services and configured by the customer." }
        ]
    },
    {
        id: "purpose",
        number: "03",
        title: "Purpose of Data Collection",
        content: [
            { type: "text", value: "We collect and process data for the following purposes:" },
            { type: "list", items: ["Providing and operating Nexspace services", "User authentication and access control", "Customer support and issue resolution", "System security, monitoring, and audits", "Product improvement and analytics", "Legal and regulatory compliance"] }
        ]
    },
    {
        id: "role-of-parties",
        number: "04",
        title: "Role of Parties",
        content: [
            { type: "highlight", value: "Customers are the Data Controllers of personal data entered into Nexspace. Nexspace acts as a Data Processor, processing data solely on customer instructions and for service delivery." }
        ]
    },
    {
        id: "data-sharing",
        number: "05",
        title: "Data Sharing & Disclosure",
        content: [
            { type: "text", value: "Nexspace does not sell personal data. We may share data only with:" },
            { type: "list", items: ["Authorized employees and contractors bound by confidentiality", "Trusted third-party service providers (hosting, email, messaging) solely for service delivery", "Government or regulatory authorities when required by law"] }
        ]
    },
    {
        id: "data-storage",
        number: "06",
        title: "Data Storage & Security",
        content: [
            {
                type: "numbered-prefix", items: [
                    { prefix: "6.1", text: "Data is stored on secure cloud infrastructure with appropriate access controls." },
                    { prefix: "6.2", text: "Nexspace implements reasonable technical and organizational measures including encryption, access restrictions, and regular security reviews." },
                    { prefix: "6.3", text: "Despite best efforts, no system is completely secure, and absolute security cannot be guaranteed." }
                ]
            }
        ]
    },
    {
        id: "data-retention",
        number: "07",
        title: "Data Retention",
        content: [
            { type: "text", value: "Data is retained for as long as the customer relationship is active or as required by applicable law." },
            { type: "text", value: "Upon termination, data will be deleted or returned as per contractual terms unless retention is legally required." }
        ]
    },
    {
        id: "user-rights",
        number: "08",
        title: "User Rights",
        content: [
            { type: "text", value: "Subject to applicable laws, users may have the right to:" },
            { type: "list", items: ["Access personal data", "Request correction or updates", "Request deletion (subject to legal and contractual obligations)"] },
            { type: "text", value: "Requests must be routed through the customer (Data Controller)." }
        ]
    },
    {
        id: "cookies",
        number: "09",
        title: "Cookies & Tracking",
        content: [
            { type: "text", value: "Nexspace may use essential cookies and similar technologies for authentication, security, and performance. We do not use cookies for advertising purposes." }
        ]
    },
    {
        id: "third-party",
        number: "10",
        title: "Third-Party Services",
        content: [
            { type: "text", value: "Nexspace may integrate with third-party services. Nexspace is not responsible for privacy practices of such third parties." }
        ]
    },
    {
        id: "childrens-data",
        number: "11",
        title: "Children's Data",
        content: [
            { type: "text", value: "Nexspace is not intended for use by individuals under 18 years of age." }
        ]
    },
    {
        id: "changes",
        number: "12",
        title: "Changes to This Policy",
        content: [
            { type: "text", value: "Nexspace may update this Privacy Policy from time to time. Material changes will be communicated through the platform or email." }
        ]
    },
    {
        id: "governing-law",
        number: "13",
        title: "Governing Law",
        content: [
            { type: "text", value: "This Privacy Policy shall be governed by and construed in accordance with the laws of India, including the Digital Personal Data Protection Act, 2023." }
        ]
    },
    {
        id: "contact",
        number: "14",
        title: "Contact Information",
        content: [
            { type: "text", value: "For any questions or concerns regarding this Privacy Policy, please contact:" },
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
    if (block.type === "subheading") return (
        <p key={i} style={{ fontSize: "0.72rem", fontFamily: "Inter, sans-serif", fontWeight: 700, color: T.blue, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: i === 0 ? 0 : 24, marginBottom: 10 }}>
            {block.value}
        </p>
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

const PrivacyPolicy = () => {
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
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            <span style={{ fontSize: "0.68rem", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.blue }}>Privacy Policy</span>
                        </div>
                        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,3rem)", color: T.white, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16 }}>
                            Your data,<br />our responsibility.
                        </h1>
                        <p style={{ fontSize: "clamp(0.9rem,2vw,1rem)", color: T.whiteDim, lineHeight: 1.75, fontWeight: 300, maxWidth: 520 }}>
                            How Nexspace collects, uses, stores, and protects information when you use Nexspace.
                        </p>
                    </div>
                    <div className="legal-meta" style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                        <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: 10, textAlign: "right" }}>
                            <div style={{ fontSize: "0.68rem", color: T.whiteMute, fontFamily: "Inter, sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Last Updated</div>
                            <div style={{ fontSize: "0.88rem", color: T.whiteDim, fontWeight: 400 }}>March 2025</div>
                        </div>
                        <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: 10, textAlign: "right" }}>
                            <div style={{ fontSize: "0.68rem", color: T.whiteMute, fontFamily: "Inter, sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Governed By</div>
                            <div style={{ fontSize: "0.88rem", color: T.whiteDim, fontWeight: 400 }}>DPDP Act, 2023</div>
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
                            Questions about this policy?
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
                            Also read our Terms of Service for usage obligations.
                        </p>
                        <a href="/terms-of-service" target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: "0.82rem", color: T.blue, textDecoration: "none", fontFamily: "Inter, sans-serif", fontWeight: 600, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                            Terms of Service →
                        </a>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
