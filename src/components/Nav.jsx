import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../data/modules';
import { Logo } from './Shared';
import { Btn } from './Buttons';
import { Icon } from './Icon';
import { useTheme } from '../context/ThemeContext';
import { LoginModal } from './LoginModal';

export const Nav = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { theme, toggle } = useTheme();
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", h, { passive: true });
        return () => window.removeEventListener("scroll", h);
    }, []);

    const links = [
        { label: "Features", href: "/#modules" },
        { label: "Roadmap", href: "/#roadmap" },
        { label: "Mobile Apps", href: "/#apps" },
        { label: "Pricing", href: "/#pricing" },
    ];

    const go = (href) => {
        setMenuOpen(false);
        if (href.startsWith('/#')) {
            navigate('/');
            setTimeout(() => {
                const el = document.querySelector(href.substring(1));
                if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } else {
            navigate(href);
        }
    };

    return (
        <>
            <nav style={{
                position: "fixed", top: scrolled ? 12 : 24, left: "50%", transform: "translateX(-50%)", zIndex: 200,
                width: "90%", maxWidth: 1200,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 24px", height: 60, borderRadius: 16,
                background: scrolled ? "var(--nav-bg)" : "transparent",
                backdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
                border: scrolled ? "1px solid var(--nav-border)" : "1px solid transparent",
                transition: "all 0.35s ease",
                boxShadow: scrolled ? "var(--nav-shadow)" : "none",
            }}>
                <Logo onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: "smooth" }); }} />

                <ul className="mobile-hide" style={{ display: "flex", gap: 32, listStyle: "none", alignItems: "center", margin: 0 }}>
                    {links.map(l => (
                        <li key={l.label}>
                            <button
                                onClick={() => go(l.href)}
                                style={{
                                    background: "none", border: "none",
                                    color: "var(--text-muted)", fontSize: "0.86rem",
                                    fontFamily: "Inter", fontWeight: 500,
                                    cursor: "pointer", transition: "color 0.2s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                                onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                            >
                                {l.label}
                            </button>
                        </li>
                    ))}

                    {/* Theme Toggle */}



                    <li><Btn small variant="ghost" onClick={() => setLoginModalOpen(true)}>Login</Btn></li>
                    <li><Btn small onClick={() => go("/#contact")}>Request Demo</Btn></li>
                </ul>

                <button className="mobile-flex-show" onClick={() => setMenuOpen(v => !v)} style={{
                    display: "none", background: "none", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "8px 10px", flexDirection: "column", gap: 4, cursor: "pointer",
                }}>
                    {[0, 1, 2].map(i => (
                        <span key={i} style={{
                            width: 18, height: 1.5, background: "var(--text)", borderRadius: 1, display: "block",
                            transform: menuOpen ? (i === 0 ? "translateY(5.5px) rotate(45deg)" : i === 2 ? "translateY(-5.5px) rotate(-45deg)" : "scaleX(0)") : "none",
                            opacity: menuOpen && i === 1 ? 0 : 1, transition: "all 0.3s",
                        }} />
                    ))}
                </button>
            </nav>

            {/* Mobile menu */}
            <div style={{
                position: "fixed", top: scrolled ? 84 : 96, left: "5%", right: "5%", zIndex: 199,
                background: "var(--nav-bg)", backdropFilter: "blur(24px)",
                border: menuOpen ? "1px solid var(--nav-border)" : "none",
                borderRadius: 16,
                maxHeight: menuOpen ? 420 : 0, overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: menuOpen ? "var(--nav-shadow)" : "none"
            }}>
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "15px 5% 0" }}>
                    {/* Mobile Theme Toggle */}

                </div>
                {links.map(l => (
                    <button key={l.label} onClick={() => go(l.href)} style={{
                        display: "block", width: "100%", padding: "15px 5%",
                        background: "none", border: "none", borderBottom: `1px solid var(--border)`,
                        color: "var(--text-muted)", fontSize: "0.95rem", fontFamily: "Inter",
                        fontWeight: 500, textAlign: "left", cursor: "pointer", transition: "color 0.2s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                        onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                    >
                        {l.label}
                    </button>
                ))}
                <div style={{ padding: "10px 5% 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <Btn
                        variant="ghost"
                        fullWidth
                        onClick={() => { setLoginModalOpen(true); setMenuOpen(false); }}
                    >
                        Login to Workspace
                    </Btn>
                    <Btn
                        fullWidth
                        onClick={() => go("/#contact")}
                    >
                        Request Demo →
                    </Btn>
                </div>
            </div>

            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />
        </>
    );
};
