import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HowToUse() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div className="page" style={{ maxWidth: 680, flex: 1 }}>
        <h1 style={{ fontSize: 22, marginBottom: 20 }}>How to use Orcible</h1>

        <ol style={{ display: "flex", flexDirection: "column", gap: 16, paddingLeft: 20 }}>
          <li>Create a project and give it a name.</li>
          <li>
            Fill in its <strong>metadata</strong> — the essential details you want attached to every AI
            prompt for this project.
          </li>
          <li>
            Paste a link to an existing AI chat into <strong>current context</strong> to pull that
            conversation's gist into the project automatically.
          </li>
          <li>
            Pick the AI tool you need next from the row of tools — it opens that tool's own site in a new
            tab, with your project's context in hand.
          </li>
          <li>Log artifacts you create along the way so you can find your way back to each chat.</li>
          <li>
            Stuck mid-task? Use <strong>Chat with Orcible</strong> right from the dashboard.
          </li>
        </ol>

        <hr className="hairline" />

        <h2 style={{ fontSize: 16, marginBottom: 10 }}>Browser extension</h2>
        <p className="muted">
          The Orcible browser extension — which will carry your current context straight into each AI
          tool's prompt box — is on its way. This project ships the web app first; the extension is a
          separate build.
        </p>

        <Link to="/dashboard" className="btn btn-sm" style={{ display: "inline-flex", marginTop: 12 }}>
          Back to dashboard
        </Link>
      </div>
      <Footer />
    </div>
  );
}
