// Each entry redirects to the tool's own site in a new tab, per the sketch
// ("Each AI tool button redirects to their respective websites").
const TOOLS = [
  { id: "claude", label: "Claude", mark: "C", url: "https://claude.ai" },
  { id: "chatgpt", label: "ChatGPT", mark: "G", url: "https://chatgpt.com" },
  { id: "gemini", label: "Gemini", mark: "Ge", url: "https://gemini.google.com" },
  { id: "meta", label: "Meta AI", mark: "M", url: "https://www.meta.ai" },
  { id: "grok", label: "Grok", mark: "X", url: "https://grok.com" },
  { id: "deepseek", label: "DeepSeek", mark: "D", url: "https://chat.deepseek.com" },
  { id: "kimi", label: "Kimi", mark: "K", url: "https://kimi.moonshot.cn" },
];

export default function AIToolGrid() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {TOOLS.map((tool) => (
        <a
          key={tool.id}
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm cut"
          style={{ textDecoration: "none", minWidth: 96, justifyContent: "flex-start", gap: 10 }}
          title={`Open ${tool.label}`}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 12,
              border: "1px solid var(--border-strong)",
              width: 20,
              height: 20,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {tool.mark}
          </span>
          {tool.label}
        </a>
      ))}
    </div>
  );
}

export { TOOLS };
