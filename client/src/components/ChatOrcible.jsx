import { useRef, useState } from "react";
import api from "../api/client";

export default function ChatOrcible({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const { data } = await api.post("/api/chat", {
        message: text,
        history: nextMessages,
        projectId,
      });
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: err.response?.data?.error || "Chat with Orcible is unavailable right now." },
      ]);
    } finally {
      setSending(false);
      requestAnimationFrame(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight));
    }
  }

  return (
    <div className="panel" style={{ display: "flex", flexDirection: "column", height: 360 }}>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Chat with Orcible</h3>

      <div ref={listRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.length === 0 && (
          <p className="muted" style={{ fontSize: 13 }}>
            Stuck at any point? Ask Orcible directly — it knows this project's metadata.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "8px 12px",
              fontSize: 13.5,
              border: "1px solid var(--border)",
              background: m.role === "user" ? "var(--accent)" : "var(--surface-raised)",
              color: m.role === "user" ? "var(--accent-ink)" : "var(--ink)",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
          </div>
        ))}
        {sending && <p className="muted" style={{ fontSize: 13 }}>Thinking…</p>}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          className="input"
          placeholder="Ask Orcible…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary btn-sm" onClick={send} disabled={sending}>
          Send
        </button>
      </div>
    </div>
  );
}
