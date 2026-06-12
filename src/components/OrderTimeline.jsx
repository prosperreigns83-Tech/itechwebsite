import React from "react";
import { ORDER_STATUSES, getOrderStatusMeta } from "../utils/orderStatus";

export default function OrderTimeline({ currentStatus }) {
  const activeIndex = ORDER_STATUSES.findIndex((item) => item.id === currentStatus);
  return (
    <div className="timeline-shell">
      {ORDER_STATUSES.map((step, index) => {
        const meta = getOrderStatusMeta(step.id);
        const completed = index <= activeIndex && activeIndex !== -1;
        return (
          <div key={step.id} className="timeline-step">
            <div className={`timeline-badge ${completed ? "timeline-active" : ""}`} style={{ borderColor: meta.color, background: completed ? meta.color : "transparent" }}>
              {step.icon}
            </div>
            <div className="timeline-copy">
              <div style={{ fontWeight: 700, color: completed ? "#FFFFFF" : "#CBD5E1" }}>{step.label}</div>
            </div>
            {index < ORDER_STATUSES.length - 1 && <div className={`timeline-line ${completed ? "timeline-line-active" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}
