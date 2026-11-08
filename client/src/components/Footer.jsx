import { Link } from "react-router-dom";

// Replace these with your real addresses/handles — see README "Footer links" section.
const CONTACT = {
  email: "hello@orcible.app",
  x: "https://x.com/orcible",
  facebook: "https://facebook.com/orcible",
  instagram: "https://instagram.com/orcible",
  linkedin: "https://linkedin.com/company/orcible",
};

const ICONS = {
  mail: (
    <path d="M3 5.5h18v13H3v-13Zm0 0 9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  x: (
    <path
      d="M4 4l16 16M20 4 4 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  ),
  facebook: (
    <path
      d="M14.5 21v-7h2.4l.4-3h-2.8v-2c0-.87.24-1.46 1.5-1.46H17.5V4.8c-.26-.03-1.16-.1-2.2-.1-2.18 0-3.68 1.33-3.68 3.77V11H9.2v3h2.42v7h2.88Z"
      fill="currentColor"
    />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.6" cy="7.4" r="1" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="7.3" y="10" width="1.8" height="7" fill="currentColor" />
      <circle cx="8.2" cy="7.3" r="1.1" fill="currentColor" />
      <path
        d="M11.5 17v-4.2c0-1.5.9-2.4 2.1-2.4 1.1 0 1.9.8 1.9 2.4V17h-1.8v-3.8c0-.6-.3-1-.85-1s-.95.4-.95 1V17h-2.1Z"
        fill="currentColor"
      />
    </>
  ),
};

function IconLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="btn btn-icon"
      style={{ width: 32, height: 32, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24">
        {icon}
      </svg>
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        marginTop: 48,
        padding: "22px 28px",
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link to="/why" style={{ fontSize: 13, textDecoration: "none" }}>
        Why Orcible?
      </Link>

      <span className="muted" style={{ fontSize: 13 }}>
        Orcible © {year}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="muted" style={{ fontSize: 13 }}>
          Contact us:
        </span>
        <IconLink href={`mailto:${CONTACT.email}`} label="Email Orcible" icon={ICONS.mail} />
        <IconLink href={CONTACT.x} label="Orcible on X" icon={ICONS.x} />
        <IconLink href={CONTACT.facebook} label="Orcible on Facebook" icon={ICONS.facebook} />
        <IconLink href={CONTACT.instagram} label="Orcible on Instagram" icon={ICONS.instagram} />
        <IconLink href={CONTACT.linkedin} label="Orcible on LinkedIn" icon={ICONS.linkedin} />
      </div>
    </footer>
  );
}
