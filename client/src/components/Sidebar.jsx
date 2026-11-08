import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Sidebar({ projects, activeId, onActivate, onCreated, onDeleted, user }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  async function create() {
    if (!name.trim()) return;
    const { data } = await api.post("/api/projects", { name });
    onCreated(data.project);
    setName("");
    setCreating(false);
  }

  async function remove(id, e) {
    e.stopPropagation();
    if (!confirm("Delete this project? This can't be undone.")) return;
    await api.delete(`/api/projects/${id}`);
    onDeleted(id);
  }

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "20px 16px",
        minHeight: "100vh",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span className="eyebrow">My projects</span>
          <button className="btn btn-icon btn-sm" onClick={() => setCreating((c) => !c)} aria-label="New project">
            +
          </button>
        </div>

        {creating && (
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <input
              autoFocus
              className="input"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && create()}
              style={{ fontSize: 13, padding: "7px 8px" }}
            />
            <button className="btn btn-sm" onClick={create}>
              Add
            </button>
          </div>
        )}

        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {projects.map((p) => (
            <li key={p._id}>
              <button
                onClick={() => onActivate(p._id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  background: p._id === activeId ? "var(--surface)" : "transparent",
                  border: "none",
                  borderLeft: p._id === activeId ? "2px solid var(--ink)" : "2px solid transparent",
                  padding: "9px 10px",
                  fontSize: 13.5,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                <span onClick={(e) => remove(p._id, e)} role="button" aria-label="Delete project" className="muted">
                  ✕
                </span>
              </button>
            </li>
          ))}
          {projects.length === 0 && !creating && (
            <p className="muted" style={{ fontSize: 13 }}>
              No projects yet.
            </p>
          )}
        </ul>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <Link to="/how-to-use" style={{ fontSize: 13, textDecoration: "none" }}>
          Download extension
        </Link>
        <Link to="/how-to-use" style={{ fontSize: 13, textDecoration: "none" }}>
          How to use?
        </Link>
        {user && (
          <div>
            <span className="muted" style={{ fontSize: 13 }}>
              {user.name}
            </span>
            {user.provider === "guest" && (
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                Guest session — sign in to keep this across devices
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
