import React, { useState, useEffect } from 'react';
import { T } from '../data/modules';
import { Btn } from './Buttons';
import { Icon } from './Icon';


const getBranding = (imgUrl) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imgUrl;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 40; // Small size for performance
            canvas.height = 40;
            ctx.drawImage(img, 0, 0, 40, 40);

            try {
                const data = ctx.getImageData(0, 0, 40, 40).data;
                let r = 0, g = 0, b = 0, count = 0;
                let brightPixels = 0;
                let transparentPixels = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const alpha = data[i + 3];
                    if (alpha < 50) {
                        transparentPixels++;
                        continue;
                    }

                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    if (avg > 230) brightPixels++; // Detect white/very light pixels

                    // Don't include white/black in the "brand color" average
                    if (avg > 20 && avg < 235) {
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        count++;
                    }
                }

                const finalR = count ? Math.round(r / count) : 30;
                const finalG = count ? Math.round(g / count) : 141;
                const finalB = count ? Math.round(b / count) : 231;
                const brandColor = `rgb(${finalR}, ${finalG}, ${finalB})`;

                // Logic for bgColor: 
                // If the logo is mostly white (like Nexspace white logo) -> Dark BG
                // Otherwise -> White/Light BG
                const isLightLogo = brightPixels / (40 * 40 - transparentPixels) > 0.4;
                const bgColor = isLightLogo ? T.navyMid : "#ffffff";

                resolve({ brandColor, bgColor });
            } catch (e) {
                // Fallback for CORS or errors
                resolve({ brandColor: T.blue, bgColor: "#ffffff" });
            }
        };
        img.onerror = () => resolve({ brandColor: T.blue, bgColor: "#ffffff" });
    });
};

export const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [tenant, setTenant] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setEmail("");
            setTenant(null);
            setError("");
            setLoading(false);
        }
    }, [isOpen]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch('https://api.nexspace.app/api/portal/mobile/hub/email-tenant/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });

            const result = await response.json();

            if (result.success && result.data) {
                const { tenant_domain, company_name, branding } = result.data;
                const logoUrl = branding.logo_url || branding.dark_logo_url;

                // Still analyze logo for the best box background color (Light vs Dark)
                const smartBranding = await getBranding(logoUrl);

                setTenant({
                    name: company_name,
                    domain: tenant_domain,
                    logo: logoUrl,
                    brandColor: branding.primary_color || smartBranding.brandColor,
                    bgColor: smartBranding.bgColor
                });
            } else {
                setError("No organization found for this email address. Please contact your administrator.");
            }
        } catch (err) {
            setError("Unable to connect to Nexspace. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(6, 13, 26, 0.8)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    animation: "fadeIn 0.3s ease forwards"
                }}
            />

            {/* Modal */}
            <div className="login-modal-content" style={{
                position: "relative",
                width: "100%",
                maxWidth: 440,
                background: T.navyMid,
                border: `1px solid ${T.border}`,
                borderRadius: 24,
                boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5)",
                animation: "scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                overflow: "hidden"
            }}>
                {/* Glow effect */}
                <div style={{
                    position: "absolute", top: -100, left: -100, width: 200, height: 200,
                    background: `radial-gradient(circle, ${T.blue}33 0%, transparent 70%)`,
                    pointerEvents: "none"
                }} />

                <button
                    onClick={onClose}
                    style={{
                        position: "absolute", top: 20, right: 20,
                        background: "rgba(255,255,255,0.05)", border: "none",
                        width: 32, height: 32, borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: T.whiteDim, transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.white; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = T.whiteDim; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                >
                    <Icon name="X" size={18} />
                </button>

                {!tenant ? (
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: 16,
                            background: "rgba(30,141,231,0.1)", border: `1px solid ${T.blue}33`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 24px"
                        }}>
                            <Icon name="User" size={32} color={T.blue} />
                        </div>
                        <h2 style={{ color: T.white, fontSize: "1.5rem", fontWeight: 700, marginBottom: 12, fontFamily: "Inter" }}>
                            Welcome back
                        </h2>
                        <p style={{ color: T.whiteDim, fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 32, fontWeight: 300 }}>
                            Enter your official email address to access your workspace.
                        </p>

                        <form onSubmit={handleSearch}>
                            <div style={{ marginBottom: 20, textAlign: "left" }}>
                                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display: "block" }}>
                                    Official Email Address
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                        style={{
                                            width: "100%",
                                            background: "rgba(255,255,255,0.03)",
                                            border: `1px solid ${error ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                                            borderRadius: 12,
                                            padding: "14px 16px",
                                            color: T.white,
                                            fontSize: "1rem",
                                            fontFamily: "Inter",
                                            transition: "all 0.2s",
                                            outline: "none"
                                        }}
                                        onFocus={e => { if (!error) e.target.style.borderColor = T.blue; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                                        onBlur={e => { if (!error) e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
                                    />
                                    {loading && (
                                        <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
                                            <div className="spinner" />
                                        </div>
                                    )}
                                </div>
                                {error && (
                                    <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: 8, fontWeight: 400 }}>{error}</p>
                                )}
                            </div>

                            <Btn style={{ width: "100%" }} onClick={handleSearch} disabled={loading}>
                                Continue →
                            </Btn>
                        </form>

                        <p style={{ marginTop: 24, fontSize: "0.8rem", color: T.whiteMute, fontWeight: 300 }}>
                            New to Nexspace? <a href="/#contact" onClick={onClose} style={{ color: T.blue, textDecoration: "none" }}>Contact support</a>
                        </p>
                    </div>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: 20,
                            background: tenant.bgColor || "white",
                            border: `1px solid ${T.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 24px", overflow: "hidden",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                        }}>
                            <img src={tenant.logo} alt={tenant.name} style={{ width: "70%", height: "auto", objectFit: "contain" }} />
                        </div>
                        <h2 style={{ color: T.white, fontSize: "1.5rem", fontWeight: 700, marginBottom: 8, fontFamily: "Inter" }}>
                            {tenant.name}
                        </h2>
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: `${tenant.brandColor || T.blue}15`,
                            padding: "6px 14px",
                            border: `1px solid ${tenant.brandColor || T.blue}33`,
                            borderRadius: 100, marginBottom: 32
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: tenant.brandColor || T.blue }} />
                            <span style={{ fontSize: "0.82rem", color: tenant.brandColor || T.blue, fontWeight: 600 }}>{email}</span>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <a
                                href={`https://${tenant.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                                onClick={() => {
                                    const domain = window.location.hostname.endsWith('nexspace.app') ? '.nexspace.app' : window.location.hostname;
                                    document.cookie = `login_hint=${encodeURIComponent(email)}; domain=${domain}; path=/; SameSite=Lax; Secure`;
                                }}
                            >
                                <Btn style={{ width: "100%" }}>
                                    Go to Workspace →
                                </Btn>
                            </a>
                        </div>

                        <p style={{ fontSize: "0.85rem", color: T.whiteDim, fontWeight: 300 }}>
                            Your workspace is at <span style={{ color: T.white, fontWeight: 500 }}>{tenant.domain}</span>
                        </p>

                        <button
                            onClick={() => { setTenant(null); setError(""); }}
                            style={{
                                marginTop: 32, background: "none", border: "none",
                                color: T.whiteMute, fontSize: "0.85rem", cursor: "pointer",
                                textDecoration: "underline"
                            }}
                        >
                            Log in with a different email
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.1);
                    border-left-color: ${T.blue};
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
