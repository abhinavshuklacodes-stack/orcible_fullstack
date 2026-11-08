import { TOOLS } from "./AIToolGrid";

function toolLabel(id) {
  return TOOLS.find((t) => t.id === id)?.label || id;
}

export default function ArtifactList({ artifacts, onDelete }) {
  if (!artifacts?.length) {
    return <p className="muted" style={{ fontSize: 13 }}>No artifacts yet. They show up here as you create them in each tool.</p>;
  }

  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {artifacts.map((a) => (
        <li
          key={a._id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "10px 12px",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {a.title}
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              {toolLabel(a.tool)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a className="btn btn-sm" href={a.chatUrl} target="_blank" rel="noreferrer">
              Open chat
            </a>
            {onDelete && (
              <button className="btn btn-sm btn-ghost" onClick={() => onDelete(a._id)} aria-label="Remove artifact">
                Remove
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
