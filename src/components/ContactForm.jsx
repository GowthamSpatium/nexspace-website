import { useState } from 'react';
import { T } from '../data/modules';
import { Icon } from './Icon';

const Field = ({ label, placeholder, type = "text", rows, value, onChange, required }) => {
    const [focused, setFocused] = useState(false);
    const shared = {
        width: "100%",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${focused ? "rgba(30,141,231,0.55)" : "rgba(255,255,255,0.09)"}`,
        borderRadius: 10,
        padding: "11px 14px",
        fontFamily: "DM Sans",
        fontSize: "0.875rem",
        color: T.white,
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: focused ? "0 0 0 3px rgba(30,141,231,0.1)" : "none",
        resize: rows ? "vertical" : undefined,
    };
    return (
        <div>
            <div style={{
                fontSize: "0.66rem", fontWeight: 700,
                color: focused ? T.blue : T.whiteDim,
                letterSpacing: "0.07em", textTransform: "uppercase",
                marginBottom: 6, transition: "color 0.2s",
            }}>{label} {required && <span style={{ color: '#ff4d4f' }}>*</span>}</div>
            {rows
                ? <textarea 
                    placeholder={placeholder} 
                    rows={rows} 
                    style={shared}
                    value={value}
                    onChange={onChange}
                    required={required}
                    onFocus={() => setFocused(true)} 
                    onBlur={() => setFocused(false)} 
                />
                : <input 
                    type={type} 
                    placeholder={placeholder} 
                    style={shared}
                    value={value}
                    onChange={onChange}
                    required={required}
                    onFocus={() => setFocused(true)} 
                    onBlur={() => setFocused(false)} 
                />
            }
        </div>
    );
};

export const ContactForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        message: ''
    });

    const handleChange = (e, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        console.log("Submit triggered with data:", formData);
        setLoading(true);
        setError(null);

        try {
            console.log("Sending fetch request to /api/demo...");
            const response = await fetch(`/api/demo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Something went wrong');
            }

            setSubmitted(true);
        } catch (err) {
            console.error('Submission error:', err);
            setError('Failed to send request. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reveal" style={{
            background: "linear-gradient(135deg, rgba(15,31,53,0.9) 0%, rgba(6,13,26,0.9) 100%)",
            border: `1px solid rgba(255,255,255,0.09)`,
            borderRadius: 20, padding: 36,
            position: "relative", overflow: "hidden",
            backdropFilter: "blur(12px)",
        }}>
            {/* Top gradient line */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${T.blue}, #00E5FF, transparent)`,
                opacity: 0.5,
            }} />

            <div style={{
                fontFamily: "Inter", fontSize: "1.35rem",
                fontWeight: 800, color: T.white,
                letterSpacing: "-0.02em", marginBottom: 4,
            }}>Book your demo <span style={{ fontSize: '0.6rem', color: T.blue, verticalAlign: 'middle' }}>(v1.2 Debug)</span></div>
            <div style={{ fontSize: "0.8rem", color: T.whiteDim, marginBottom: 28, fontWeight: 300 }}>
                Fill in your details and we'll be in touch shortly.
            </div>

            {submitted ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: "50%",
                        background: "rgba(74,222,128,0.1)",
                        border: "1px solid rgba(74,222,128,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 20px",
                    }}>
                        <Icon name="CheckCircle2" size={30} color="#4ade80" />
                    </div>
                    <div style={{ fontFamily: "Inter", fontSize: "1.1rem", fontWeight: 700, color: T.white, marginBottom: 8 }}>
                        Request sent!
                    </div>
                    <div style={{ fontSize: "0.82rem", color: T.whiteDim, fontWeight: 300 }}>
                        We'll be in touch within a few hours.
                    </div>
                    <button 
                        onClick={() => setSubmitted(false)}
                        style={{ background: 'transparent', border: 'none', color: T.blue, fontSize: '0.75rem', marginTop: 20, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Send another request
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <Field 
                            label="First Name" 
                            placeholder="Ravi" 
                            value={formData.firstName}
                            onChange={(e) => handleChange(e, 'firstName')}
                            required
                        />
                        <Field 
                            label="Last Name" 
                            placeholder="Kumar" 
                            value={formData.lastName}
                            onChange={(e) => handleChange(e, 'lastName')}
                            required
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
                        <Field 
                            label="Work Email" 
                            placeholder="ravi@company.com" 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => handleChange(e, 'email')}
                            required
                        />
                        <Field 
                            label="Company" 
                            placeholder="Acme Corp" 
                            value={formData.company}
                            onChange={(e) => handleChange(e, 'company')}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <Field 
                            label="What are you looking to solve?" 
                            placeholder="e.g. We need to manage visitor check-ins across 3 offices..." 
                            rows={3} 
                            value={formData.message}
                            onChange={(e) => handleChange(e, 'message')}
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ff4d4f', fontSize: '0.75rem', marginBottom: 16 }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-shine"
                        disabled={loading}
                        onClick={() => { console.log("Physical Button Clicked"); }}
                        style={{
                            width: "100%", padding: "14px",
                            background: loading ? "rgba(30,141,231,0.5)" : "linear-gradient(135deg, #1E8DE7, #00C8FF)",
                            color: "#060D1A", border: "none",
                            borderRadius: 10, fontFamily: "Inter",
                            fontSize: "0.9rem", fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer", 
                            letterSpacing: "-0.01em",
                            transition: "all 0.22s ease",
                            boxShadow: "0 4px 20px rgba(30,141,231,0.35)",
                            position: "relative", overflow: "hidden",
                            pointerEvents: "auto", zIndex: 10
                        }}
                        onMouseEnter={e => { if(!loading) { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                        onMouseLeave={e => { if(!loading) { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; } }}
                    >
                        {loading ? 'Sending...' : 'Request Demo →'}
                    </button>

                    <div style={{
                        textAlign: "center", fontSize: "0.72rem",
                        color: T.whiteMute, marginTop: 14,
                        display: "flex", alignItems: "center",
                        justifyContent: "center", gap: 6,
                    }}>
                        <Icon name="ShieldCheck" size={12} color={T.whiteMute} />
                        DPDP compliant. We'll never share your information.
                    </div>
                </form>
            )}
        </div>
    );
};
