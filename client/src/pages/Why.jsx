import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Why() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div className="page" style={{ maxWidth: 640, flex: 1 }}>
        <h1 style={{ fontSize: 24, marginBottom: 18 }}>Why Orcible?</h1>

        <p>
          No single AI tool is best at everything. You draft in one, research in another, generate
          images somewhere else — and every switch means re-explaining the project from scratch.
        </p>
        <p>
          Orcible holds that explanation once: your project's metadata, its current context, and a
          record of what you've made and where. Pick the tool the next step needs, and the project
          travels with you instead of starting over.
        </p>

        <hr className="hairline" />

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <h2 style={{ fontSize: 15, marginBottom: 4 }}>One memory, seven tools</h2>
            <p className="muted" style={{ margin: 0 }}>
              Claude, ChatGPT, Gemini, Meta AI, Grok, DeepSeek, Kimi — switch freely without losing the
              thread.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 15, marginBottom: 4 }}>Context you can read</h2>
            <p className="muted" style={{ margin: 0 }}>
              Pull context straight from a chat link instead of copy-pasting transcripts by hand.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 15, marginBottom: 4 }}>Nothing stored that doesn't need to be</h2>
            <p className="muted" style={{ margin: 0 }}>
              Orcible keeps a link back to each artifact's chat, not a copy of the file itself.
            </p>
          </div>
        </div>

        <Link to="/dashboard" className="btn btn-sm" style={{ display: "inline-flex", marginTop: 28 }}>
          Back to dashboard
        </Link>
      </div>
      <Footer />
    </div>
  );
}
