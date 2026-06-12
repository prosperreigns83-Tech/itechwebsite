import React from "react";
import PageShell from "./PageShell";
import ChartPlaceholder from "./ChartPlaceholder";

export default function SellerAnalytics() {
  return (
    <PageShell title="Seller Analytics" description="Insights and traffic data for your store.">
      <div style={{ display: "grid", gap: 16 }}>
        <ChartPlaceholder title="Products Viewed" />
        <ChartPlaceholder title="Conversion Rate" />
      </div>
    </PageShell>
  );
}
