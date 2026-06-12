import React from "react";
import PageShell from "./PageShell";

export default function SearchResults() {
  return (
    <PageShell title="Search Results" description="Browse results for your product search.">
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24, color: "#94A3B8" }}>
        Search results will display here once users enter a query.
      </div>
    </PageShell>
  );
}
