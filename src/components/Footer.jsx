import { T } from '../data/modules';
import { Logo, Badge } from './Shared';
import { Icon } from './Icon';

const LEGAL_LINKS = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "EULA", href: "/eula" },
    { label: "Privacy & Data Protection", href: "/privacy-data-protection" },
];

const FooterLink = ({ label, href, external }) => (
    <button
        onClick={() => external
            ? window.open(href, "_blank", "noopener,noreferrer")
            : (window.location.href = href)}
        style={{
            background: "none", border: "none", padding: 0,
            fontSize: "0.85rem", color: T.whiteDim,
            fontFamily: "Inter", fontWeight: 400,
            textAlign: "left", cursor: "pointer",
            transition: "color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = T.white}
        onMouseLeave={e => e.currentTarget.style.color = T.whiteDim}
    >
        {label}
    </button>
);

export const Footer = () => (
    <footer style={{ background: T.navyMid, borderTop: `1px solid ${T.border}` }}>

        {/* Main grid */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 5% 48px" }}>
            <div className="footer-grid" style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 48,
                alignItems: "center"
            }}>
                {/* Brand column */}
                <div>
                    <Logo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
                    <p style={{
                        fontSize: "0.9rem", color: T.whiteDim,
                        lineHeight: 1.75, fontWeight: 300,
                        margin: "20px 0 24px", maxWidth: 360,
                    }}>
                        The intelligent facility management platform for modern enterprises — unified, multi-tenant, and built for India.
                    </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Badge color={T.whiteMute}>DPDP Compliant</Badge>
                        <Badge color={T.blue}>Multi-Tenant</Badge>
                    </div>
                </div>

                {/* Links */}
                <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                    <button onClick={() => document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" })} style={{
                        background: "none", border: "none", padding: 0,
                        fontSize: "0.85rem", color: T.whiteDim,
                        fontFamily: "Inter", fontWeight: 400,
                        textAlign: "left", cursor: "pointer",
                        transition: "color 0.2s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = T.white}
                        onMouseLeave={e => e.currentTarget.style.color = T.whiteDim}>
                        Modules
                    </button>
                    {LEGAL_LINKS.map(l => <FooterLink key={l.label} {...l} external />)}

                    <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{
                        background: "none", border: "none", padding: 0,
                        fontSize: "0.85rem", color: T.whiteDim,
                        fontFamily: "Inter", fontWeight: 400,
                        textAlign: "left", cursor: "pointer",
                        transition: "color 0.2s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = T.white}
                        onMouseLeave={e => e.currentTarget.style.color = T.whiteDim}>
                        Contact Us
                    </button>
                </div>
            </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${T.border}` }}>
            <div style={{
                maxWidth: 1100, margin: "0 auto", padding: "20px 5%",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", flexWrap: "wrap", gap: 12,
            }}>
                <p style={{
                    fontSize: "0.8rem", color: T.whiteMute,
                    display: "flex", alignItems: "center", gap: 6, margin: 0,
                }}>
                    © 2026 Nexspace. All rights reserved. Built with <Icon name="Heart" size={12} color="#f87171" /> in India
                </p>
                <p style={{ fontSize: "0.75rem", color: "rgba(240,246,255,0.25)", margin: 0, fontWeight: 300 }}>
                    Governed by India's DPDP Act 2023
                </p>
            </div>
        </div>

        <style>{`
            @media (max-width: 768px) {
                .footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; align-items: start !important; }
                .footer-grid > div:last-child { flex-direction: column; align-items: flex-start !important; gap: 16px !important; }
            }
        `}</style>
    </footer>
);
