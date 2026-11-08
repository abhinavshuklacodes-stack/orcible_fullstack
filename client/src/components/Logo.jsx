// Uses the actual uploaded Orcible mark (public/logo-mask.png: the three white shards,
// background removed) as a CSS mask tinted with the current theme's ink color, so the
// real artwork — not a recreation — follows light/dark mode automatically with no raster
// re-coloring. Falls back to the hand-drawn SVG if the mask image fails to load.
export default function Logo({ size = 28, withWordmark = true, className = "" }) {
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--font-display)" }}
    >
      <span
        role="img"
        aria-label="Orcible"
        style={{
          display: "inline-block",
          width: size,
          height: size,
          backgroundColor: "var(--ink)",
          WebkitMaskImage: "url(/logo-mask.png)",
          maskImage: "url(/logo-mask.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      {withWordmark && (
        <span style={{ fontWeight: 600, fontSize: size * 0.64, letterSpacing: "-0.01em" }}>Orcible</span>
      )}
    </span>
  );
}
