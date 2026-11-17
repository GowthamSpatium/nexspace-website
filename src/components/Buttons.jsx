import { T } from '../data/modules';

export const Btn = ({ children, variant = "primary", onClick, small, fullWidth }) => {
    const base = {
        display: fullWidth ? "flex" : "inline-flex",
        width: fullWidth ? "100%" : "auto",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        padding: small ? "9px 20px" : "13px 30px",
        borderRadius: 12,
        fontFamily: "Inter",
        fontWeight: 700,
        fontSize: small ? "0.78rem" : "0.875rem",
        letterSpacing: "-0.01em",
        cursor: "pointer",
        border: "none",
        transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
        position: "relative",
        overflow: "hidden",
        whiteSpace: "nowrap",
    };

    const styles = {
        primary: {
            ...base,
            background: `linear-gradient(135deg, #1E8DE7 0%, #00C8FF 100%)`,
            color: "#060D1A",
            boxShadow: "0 4px 20px rgba(30,141,231,0.35)",
        },
        ghost: {
            ...base,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.14)",
            color: T.white,
            boxShadow: "none",
        },
        outline: {
            ...base,
            background: "transparent",
            border: `1px solid ${T.blue}`,
            color: T.blue,
            boxShadow: "none",
        },
    };

    const hoverMap = {
        primary: { opacity: "0.92", transform: "translateY(-2px)", boxShadow: "0 8px 32px rgba(30,141,231,0.48)" },
        ghost: { borderColor: "rgba(255,255,255,0.32)", transform: "translateY(-2px)" },
        outline: { background: "rgba(30,141,231,0.08)", transform: "translateY(-2px)" },
    };

    return (
        <button
            className={variant === "primary" ? "btn-shine" : ""}
            style={styles[variant]}
            onClick={onClick}
            onMouseEnter={e => Object.assign(e.currentTarget.style, hoverMap[variant])}
            onMouseLeave={e => Object.assign(e.currentTarget.style, {
                opacity: "1", transform: "none",
                boxShadow: styles[variant].boxShadow ?? "none",
                borderColor: styles[variant].border?.split(" ").pop() ?? "",
                background: styles[variant].background,
            })}
        >
            {children}
        </button>
    );
};
