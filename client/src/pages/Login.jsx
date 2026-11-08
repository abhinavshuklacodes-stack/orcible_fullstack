import { useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const PROVIDERS = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
  { id: "linkedin", label: "Continue with LinkedIn" },
];

// Four abstract monochrome tiles standing in for product screenshots, built from the
// same angled-shard language as the mark — no stock imagery, no gradients.
function Tile({ variant }) {
  const patterns = {
    a: "repeating-linear-gradient(45deg, var(--ink) 0, var(--ink) 1px, transparent 1px, transparent 14px)",
    b: "repeating-linear-gradient(-45deg, var(--ink) 0, var(--ink) 1px, transparent 1px, transparent 10px)",
    c: "radial-gradient(circle, var(--ink) 1.5px, transparent 1.5px)",
    d: "linear-gradient(135deg, transparent 48%, var(--ink) 48%, var(--ink) 52%, transparent 52%)",
  };
  return (
    <div
      className="cut"
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface)",
        backgroundImage: patterns[variant],
        backgroundSize: variant === "c" ? "12px 12px" : "auto",
        opacity: 0.9,
        aspectRatio: "4 / 3",
      }}
    />
  );
}

function errorMessage(error) {
  if (!error) return null;
  if (error.endsWith("-not-configured")) {
    const provider = error.replace("-not-configured", "");
    return `${provider[0].toUpperCase()}${provider.slice(1)} sign-in isn't set up yet — add its client ID and secret to the server's .env.`;
  }
  if (error === "guest") {
    return "Couldn't start a guest session — check the server is running and connected to MongoDB.";
  }
  return "That sign-in didn't go through. Try again.";
}

export default function Login() {
  const [params] = useSearchParams();
  const error = params.get("error");
  const message = errorMessage(error);

  return (
    <div>
      <div className="topbar">
        <Logo size={24} />
        <ThemeToggle />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 480px) minmax(0, 1fr)",
          gap: 0,
          minHeight: "calc(100vh - 61px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "48px 40px" }}>
          <div className="panel panel-raised cut" style={{ width: "100%", maxWidth: 380, padding: 36 }}>
            <h1 style={{ fontSize: 22, marginBottom: 24 }}>Login to continue with Orcible</h1>

            {message && (
              <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 16 }}>{message}</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PROVIDERS.map((p) => (
                <a
                  key={p.id}
                  href={`${API_URL}/api/auth/${p.id}`}
                  className="btn"
                  style={{ textDecoration: "none", justifyContent: "space-between" }}
                >
                  {p.label}
                  <span aria-hidden>→</span>
                </a>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <span style={{ flex: 1, borderTop: "1px solid var(--border)" }} />
              <span className="muted" style={{ fontSize: 12 }}>
                or
              </span>
              <span style={{ flex: 1, borderTop: "1px solid var(--border)" }} />
            </div>

            <a
              href={`${API_URL}/api/auth/guest`}
              className="btn btn-ghost"
              style={{ textDecoration: "none", justifyContent: "center", width: "100%" }}
            >
              Continue as guest
            </a>
            <p className="muted" style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }}>
              No account needed — your projects stay on this browser until you sign in properly.
            </p>
          </div>
        </div>

        <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <Tile variant="a" />
            <Tile variant="b" />
            <Tile variant="c" />
            <Tile variant="d" />
          </div>
          <p style={{ maxWidth: 420, fontSize: 15 }}>
            Let Orcible ease your way to work with multiple AI tools, seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
}
