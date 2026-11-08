import { useEffect, useRef, useState } from "react";
import api from "../api/client";
import ArtifactList from "./ArtifactList";
import { TOOLS } from "./AIToolGrid";

const BUILD_STAGES = ["Crunching…", "Cogitating…", "Polishing…"];

// Cycles through BUILD_STAGES every ~1.1s while `active` is true, for the "wait while
// we prepare your context" moment the sketch calls out.
function useBuildStage(active) {
  const [stage, setStage] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (active) {
      setStage(0);
      intervalRef.current = setInterval(() => {
        setStage((s) => (s + 1) % BUILD_STAGES.length);
      }, 1100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [active]);

  return BUILD_STAGES[stage];
}

const SECTIONS = ["metadata", "context", "artifacts"];

export default function ProjectMemoryPanel({ project, onUpdate }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="panel">
      <h3 style={{ fontSize: 15, marginBottom: 16 }}>Project memory</h3>

      <Row
        label="Metadata"
        actionLabel="Modify"
        isOpen={open === "metadata"}
        onToggle={() => setOpen(open === "metadata" ? null : "metadata")}
      >
        <MetadataEditor project={project} onUpdate={onUpdate} />
      </Row>

      <Row
        label="Current context"
        actionLabel={open === "context" ? "Close" : "Open"}
        isOpen={open === "context"}
        onToggle={() => setOpen(open === "context" ? null : "context")}
      >
        <CurrentContext project={project} onUpdate={onUpdate} />
      </Row>

      <Row
        label="Artifacts"
        actionLabel="View"
        isOpen={open === "artifacts"}
        onToggle={() => setOpen(open === "artifacts" ? null : "artifacts")}
      >
        <ArtifactsEditor project={project} onUpdate={onUpdate} />
      </Row>
    </div>
  );
}

function Row({ label, actionLabel, isOpen, onToggle, children }) {
  return (
    <div style={{ borderTop: "1px solid var(--border)" }}>
      <button
        onClick={onToggle}
        className="btn-ghost"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          padding: "14px 2px",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span className="btn btn-sm" style={{ pointerEvents: "none" }}>
          {actionLabel}
        </span>
      </button>
      {isOpen && <div style={{ paddingBottom: 18 }}>{children}</div>}
    </div>
  );
}

function MetadataEditor({ project, onUpdate }) {
  const [rows, setRows] = useState(project.metadata.length ? project.metadata : [{ key: "", value: "" }]);
  const [saving, setSaving] = useState(false);

  function setRow(i, field, value) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  }

  async function save() {
    setSaving(true);
    const cleaned = rows.filter((r) => r.key.trim());
    const { data } = await api.put(`/api/projects/${project._id}/metadata`, { metadata: cleaned });
    onUpdate(data.project);
    setRows(cleaned.length ? cleaned : [{ key: "", value: "" }]);
    setSaving(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
        Essential details attached to every AI prompt for this project.
      </p>
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="key, e.g. tech stack"
            value={row.key}
            onChange={(e) => setRow(i, "key", e.target.value)}
            style={{ flex: "0 0 40%" }}
          />
          <input
            className="input"
            placeholder="value"
            value={row.value}
            onChange={(e) => setRow(i, "value", e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-sm" onClick={() => setRows((r) => [...r, { key: "", value: "" }])}>
          Add row
        </button>
        <button className="btn btn-sm btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save metadata"}
        </button>
      </div>
    </div>
  );
}

function CurrentContext({ project, onUpdate }) {
  const [chatUrl, setChatUrl] = useState("");
  const [building, setBuilding] = useState(false);
  const [draft, setDraft] = useState(project.currentContext || "");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const buildStage = useBuildStage(building);

  async function buildFromLink() {
    if (!chatUrl.trim()) return;
    setBuilding(true);
    setError("");
    try {
      const { data } = await api.post(`/api/projects/${project._id}/context/build`, { chatUrl });
      onUpdate(data.project);
      setDraft(data.project.currentContext);
      setChatUrl("");
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't build context from that link.");
    } finally {
      setBuilding(false);
    }
  }

  async function saveManualEdit() {
    const { data } = await api.put(`/api/projects/${project._id}/context`, { currentContext: draft });
    onUpdate(data.project);
    setEditing(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="input"
          placeholder="Paste a chat link to pull context from…"
          value={chatUrl}
          onChange={(e) => setChatUrl(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn btn-sm btn-primary" onClick={buildFromLink} disabled={building}>
          {building ? buildStage : "Build"}
        </button>
      </div>
      {building && (
        <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>
          Wait while we prepare your context.
        </p>
      )}
      {error && <p style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}>{error}</p>}

      {editing ? (
        <>
          <textarea className="textarea" rows={8} value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-sm btn-primary" onClick={saveManualEdit}>
              Save
            </button>
            <button className="btn btn-sm btn-ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              margin: 0,
              padding: 12,
              border: "1px solid var(--border)",
              background: "var(--surface-raised)",
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {project.currentContext || "No context yet — build it from a chat link above, or write it by hand."}
          </pre>
          <button className="btn btn-sm" onClick={() => setEditing(true)} style={{ alignSelf: "flex-start" }}>
            Edit by hand
          </button>
        </>
      )}
    </div>
  );
}

function ArtifactsEditor({ project, onUpdate }) {
  const [title, setTitle] = useState("");
  const [tool, setTool] = useState(TOOLS[0].id);
  const [chatUrl, setChatUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!title.trim() || !chatUrl.trim()) return;
    setSaving(true);
    const { data } = await api.post(`/api/projects/${project._id}/artifacts`, { title, tool, chatUrl });
    onUpdate(data.project);
    setTitle("");
    setChatUrl("");
    setSaving(false);
  }

  async function remove(artifactId) {
    const { data } = await api.delete(`/api/projects/${project._id}/artifacts/${artifactId}`);
    onUpdate(data.project);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <ArtifactList artifacts={project.artifacts} onDelete={remove} />
      <div className="hairline" style={{ margin: "4px 0" }} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          className="input"
          placeholder="Artifact title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: "1 1 160px" }}
        />
        <select className="input" value={tool} onChange={(e) => setTool(e.target.value)} style={{ flex: "0 0 140px" }}>
          {TOOLS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          className="input"
          placeholder="Chat link"
          value={chatUrl}
          onChange={(e) => setChatUrl(e.target.value)}
          style={{ flex: "1 1 220px" }}
        />
        <button className="btn btn-sm btn-primary" onClick={add} disabled={saving}>
          Add artifact
        </button>
      </div>
    </div>
  );
}
