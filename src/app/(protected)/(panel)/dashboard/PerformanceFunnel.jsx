"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import api from "@/lib/axios";

// ─── Color Palette ──────────────────────────────────────────────────────────
const COLORS = {
  chat: "#3b82f6",
  email: "#3b82f6",
  android: "#3b82f6",
  ios: "#3b82f6",
  whatsapp: "#22c55e",
  web: "#3b82f6",
  finInvolved: "#3b82f6",
  finNotInvolved: "#9ca3af",
  resolvedByFin: "#22c55e",
  resolvedByHuman: "#10b981",
  escalatedResolved: "#6366f1",
  escalatedUnresolved: "#f59e0b",
  abandoned: "#9ca3af",
  unresolved: "#9ca3af",
  positive: "#22c55e",
  neutral: "#f59e0b",
  negative: "#ef4444",
  noFeedback: "#d1d5db",
};

// ─── Node Label Component ───────────────────────────────────────────────────
function NodeLabel({ x, y, label, value, color, align = "left", barHeight }) {
  const barWidth = 4;
  const midY = y + barHeight / 2;

  return (
    <g>
      <rect
        x={align === "right" ? x - barWidth : x}
        y={y}
        width={barWidth}
        height={barHeight}
        rx={2}
        fill={color}
      />
      <text
        x={align === "right" ? x - barWidth - 6 : x + barWidth + 6}
        y={midY - 5}
        textAnchor={align === "right" ? "end" : "start"}
        dominantBaseline="middle"
        className="fill-slate-600"
        style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}
      >
        {label}
      </text>
      <text
        x={align === "right" ? x - barWidth - 6 : x + barWidth + 6}
        y={midY + 7}
        textAnchor={align === "right" ? "end" : "start"}
        dominantBaseline="middle"
        className="fill-slate-800"
        style={{ fontSize: 9, fontWeight: 700 }}
      >
        {value}
      </text>
    </g>
  );
}

// ─── Curved Link Path ───────────────────────────────────────────────────────
function SankeyLink({ x0, y0, x1, y1, thickness, thickness0, thickness1, color, opacity = 0.18 }) {
  const t0 = thickness0 ?? thickness;
  const t1 = thickness1 ?? thickness;
  const curvature = 0.5;
  const xi = x0 + (x1 - x0) * curvature;

  const d = `
    M ${x0},${y0}
    C ${xi},${y0} ${x1 - (x1 - x0) * curvature},${y1} ${x1},${y1}
    L ${x1},${y1 + t1}
    C ${x1 - (x1 - x0) * curvature},${y1 + t1} ${xi},${y0 + t0} ${x0},${y0 + t0}
    Z
  `;

  return <path d={d} fill={color} opacity={opacity} />;
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyFunnelState() {
  const width = 1200;
  const height = 400;
  const colX = [30, 370, 680, 990];
  const columns = [
    { label: "SOURCE", x: colX[0] },
    { label: "AI INVOLVEMENT", x: colX[1] },
    { label: "RESOLUTION", x: colX[2] },
    { label: "CX SCORE", x: colX[3] },
  ];

  // Ghost bars per column
  const ghostBars = [
    [{ y: 40, h: 300 }],
    [{ y: 40, h: 160 }, { y: 220, h: 120 }],
    [{ y: 40, h: 80 }, { y: 140, h: 60 }, { y: 220, h: 80 }, { y: 320, h: 40 }],
    [{ y: 40, h: 100 }, { y: 160, h: 80 }, { y: 260, h: 60 }, { y: 340, h: 30 }],
  ];

  return (
    <div className="relative">
      {/* Ghost SVG — faded skeleton */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full opacity-[0.07]"
        preserveAspectRatio="xMidYMid meet"
      >
        {columns.map((col, ci) =>
          ghostBars[ci].map((bar, bi) => (
            <rect
              key={`${ci}-${bi}`}
              x={col.x}
              y={bar.y}
              width={4}
              height={bar.h}
              rx={2}
              fill="#64748b"
            />
          ))
        )}
        {/* Ghost links — simple curved paths between columns */}
        {[
          { x0: 34, y0: 40, x1: colX[1], y1: 40, h0: 300, h1: 160 },
          { x0: 34, y0: 200, x1: colX[1], y1: 220, h0: 100, h1: 120 },
          { x0: colX[1] + 4, y0: 40, x1: colX[2], y1: 40, h0: 80, h1: 80 },
          { x0: colX[1] + 4, y0: 220, x1: colX[2], y1: 140, h0: 60, h1: 60 },
          { x0: colX[2] + 4, y0: 40, x1: colX[3], y1: 40, h0: 60, h1: 100 },
        ].map((l, i) => {
          const curvature = 0.5;
          const xi = l.x0 + (l.x1 - l.x0) * curvature;
          const d = `M ${l.x0},${l.y0} C ${xi},${l.y0} ${l.x1 - (l.x1 - l.x0) * curvature},${l.y1} ${l.x1},${l.y1} L ${l.x1},${l.y1 + l.h1} C ${l.x1 - (l.x1 - l.x0) * curvature},${l.y1 + l.h1} ${xi},${l.y0 + l.h0} ${l.x0},${l.y0 + l.h0} Z`;
          return <path key={i} d={d} fill="#94a3b8" opacity={0.5} />;
        })}
      </svg>

      {/* Overlay message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="rounded-full bg-blue-50 p-3">
          <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <p className="text-[13px] font-semibold text-slate-600">No conversation data yet</p>
        <p className="max-w-xs text-center text-[11px] text-slate-400 leading-relaxed">
          Once your chatbot starts handling conversations, your performance funnel will appear here — showing sources, AI involvement, resolution paths, and CX scores.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function PerformanceFunnel({ chatbotId, startDate, endDate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {};
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        params.startDate = startDate || thirtyDaysAgo.toISOString().split("T")[0];
        params.endDate = endDate || today.toISOString().split("T")[0];
        if (chatbotId) params.chatbotId = chatbotId;

        const res = await api.get("/usage/dashboard-overview", { params });
        if (res?.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard overview:", err);
        setError("Failed to load performance data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chatbotId, startDate, endDate]);

  // ─── Build Sankey Data ──────────────────────────────────────────────────
  const sankeyData = useMemo(() => {
    if (!data) return null;

    const { platformBreakdown, resolutionFunnel, cxScores, resolutionToCx } = data;

    // Guard against missing API data shapes
    const funnel = resolutionFunnel || {};
    const cx = cxScores || {};

    const platforms =
      platformBreakdown && platformBreakdown.length > 0
        ? platformBreakdown.map((p) => ({
            id: p.platform || p.name,
            label: (p.platform || p.name || "unknown").toUpperCase(),
            value: p.count || p.total || 0,
            color: COLORS[(p.platform || p.name || "").toLowerCase()] || COLORS.chat,
          }))
        : [
            {
              id: "chat",
              label: "CHAT",
              value: funnel.totalConversations || 0,
              color: COLORS.chat,
            },
          ];

    const involvement = [
      { id: "finInvolved", label: "C-GPT INVOLVED", value: funnel.aiInvolved || 0, color: COLORS.finInvolved },
      { id: "finNotInvolved", label: "C-GPT NOT INVOLVED", value: funnel.aiNotInvolved || 0, color: COLORS.finNotInvolved },
    ];

    const resolutionAll = [
      { id: "resolvedByAi", label: "RESOLVED BY C-GPT", value: funnel.resolvedByAi || 0, color: COLORS.resolvedByFin },
      { id: "resolvedByHuman", label: "RESOLVED BY HUMAN", value: funnel.resolvedByHuman || 0, color: COLORS.resolvedByHuman },
      { id: "escalatedResolved", label: "ESCALATED & RESOLVED", value: funnel.escalatedResolved || 0, color: COLORS.escalatedResolved },
      { id: "escalatedUnresolved", label: "SENT TO TEAMMATE", value: funnel.escalatedUnresolved || 0, color: COLORS.escalatedUnresolved },
      { id: "abandoned", label: "ABANDONED", value: funnel.abandoned || 0, color: COLORS.abandoned },
      { id: "unresolved", label: "UNRESOLVED", value: funnel.unresolved || 0, color: COLORS.unresolved },
    ];
    const resolution = resolutionAll.filter((n) => n.value > 0);

    const scoresAll = [
      { id: "positive", label: "POSITIVE CX SCORE", value: cx.positive || 0, color: COLORS.positive },
      { id: "neutral", label: "NEUTRAL CX SCORE", value: cx.neutral || 0, color: COLORS.neutral },
      { id: "negative", label: "NEGATIVE CX SCORE", value: cx.negative || 0, color: COLORS.negative },
      { id: "noFeedback", label: "NO FEEDBACK", value: cx.noFeedback || 0, color: COLORS.noFeedback },
    ];
    const scores = scoresAll.filter((n) => n.value > 0);

    const resCxMap = {};
    (resolutionToCx || []).forEach((r) => {
      const key = `${r.resolution}__${r.cxCategory}`;
      resCxMap[key] = (resCxMap[key] || 0) + r.count;
    });

    return { platforms, involvement, resolution, scores, resCxMap };
  }, [data]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!sankeyData) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-[#f0f0f0] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <h3 className="mb-4 text-[15px] font-bold text-slate-900">Performance funnel</h3>
      <SankeyChart data={sankeyData} />
    </div>
  );
}

// ─── SVG Sankey Chart ───────────────────────────────────────────────────────
function SankeyChart({ data }) {
  const { platforms, involvement, resolution, scores, resCxMap } = data;
  const svgRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  const width = 1200;
  const height = 400;
  const colX = [30, 370, 680, 990];
  const nodeGap = 20;
  const topPadding = 10;
  const minNodeHeight = 10;

  const totalValue = Math.max(
    platforms.reduce((s, n) => s + n.value, 0),
    involvement.reduce((s, n) => s + n.value, 0),
    resolution.reduce((s, n) => s + n.value, 0),
    scores.reduce((s, n) => s + n.value, 0),
    1,
  );

  const availableHeight = height - topPadding * 2;

  function layoutNodes(nodes, x) {
    const totalNodeValue = nodes.reduce((s, n) => s + n.value, 0) || 1;
    const totalGaps = (nodes.length - 1) * nodeGap;
    const usableHeight = availableHeight - totalGaps;

    let yOffset = topPadding;
    return nodes.map((node) => {
      const ratio = totalNodeValue > 0 ? node.value / totalNodeValue : 1 / nodes.length;
      const h = Math.max(minNodeHeight, ratio * usableHeight);
      const result = { ...node, x, y: yOffset, height: h };
      yOffset += h + nodeGap;
      return result;
    });
  }

  const col0 = layoutNodes(platforms, colX[0]);
  const col1 = layoutNodes(involvement, colX[1]);
  const col2 = layoutNodes(resolution, colX[2]);
  const col3 = layoutNodes(scores, colX[3]);

  function buildLinks(sourceNodes, targetNodes, sourceX, targetX) {
    const links = [];
    const targetTotal = targetNodes.reduce((s, n) => s + n.value, 0) || 1;
    const sourceOffsets = sourceNodes.map((n) => n.y);
    const targetOffsets = targetNodes.map((n) => n.y);

    for (let si = 0; si < sourceNodes.length; si++) {
      const src = sourceNodes[si];
      if (src.value === 0) continue;
      for (let ti = 0; ti < targetNodes.length; ti++) {
        const tgt = targetNodes[ti];
        if (tgt.value === 0) continue;

        const flowValue = (src.value * tgt.value) / targetTotal;
        if (flowValue <= 0) continue;

        const srcThickness = (flowValue / src.value) * src.height;
        const tgtThickness = (flowValue / tgt.value) * tgt.height;

        links.push({
          x0: sourceX + 4, y0: sourceOffsets[si],
          x1: targetX, y1: targetOffsets[ti],
          thickness0: Math.max(srcThickness, 2),
          thickness1: Math.max(tgtThickness, 2),
          color: src.color,
        });

        sourceOffsets[si] += srcThickness;
        targetOffsets[ti] += tgtThickness;
      }
    }
    return links;
  }

  function buildCrossTabLinks(sourceNodes, targetNodes, sourceX, targetX, crossTabMap) {
    const links = [];
    const sourceOffsets = sourceNodes.map((n) => n.y);
    const targetOffsets = targetNodes.map((n) => n.y);

    for (let si = 0; si < sourceNodes.length; si++) {
      const src = sourceNodes[si];
      if (src.value === 0) continue;
      for (let ti = 0; ti < targetNodes.length; ti++) {
        const tgt = targetNodes[ti];
        if (tgt.value === 0) continue;

        const flowValue = crossTabMap[`${src.id}__${tgt.id}`] || 0;
        if (flowValue <= 0) continue;

        const srcThickness = (flowValue / src.value) * src.height;
        const tgtThickness = (flowValue / tgt.value) * tgt.height;

        links.push({
          x0: sourceX + 4, y0: sourceOffsets[si],
          x1: targetX, y1: targetOffsets[ti],
          thickness0: Math.max(srcThickness, 2),
          thickness1: Math.max(tgtThickness, 2),
          color: src.color,
        });

        sourceOffsets[si] += srcThickness;
        targetOffsets[ti] += tgtThickness;
      }
    }
    return links;
  }

  const links0 = buildLinks(col0, col1, colX[0], colX[1]);
  const links1 = buildLinks(col1, col2, colX[1], colX[2]);
  const links2 = buildCrossTabLinks(col2, col3, colX[2], colX[3], resCxMap);
  const allLinks = [...links0, ...links1, ...links2];

  const allZero =
    totalValue === 0 ||
    (platforms.every((n) => n.value === 0) &&
      involvement.every((n) => n.value === 0) &&
      resolution.every((n) => n.value === 0) &&
      scores.every((n) => n.value === 0));

  if (allZero) {
    return <EmptyFunnelState />;
  }

  // Trigger reveal animation after mount
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true));
    });
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Clip path for left-to-right reveal animation */}
        <defs>
          <clipPath id="reveal-clip">
            <rect
              x={0}
              y={0}
              width={revealed ? width : 0}
              height={height}
              style={{
                transition: revealed ? "width 1.1s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
              }}
            />
          </clipPath>
        </defs>

        <g clipPath="url(#reveal-clip)">
          {/* Links */}
          {allLinks.map((link, i) => (
            <SankeyLink key={i} {...link} />
          ))}

          {/* Nodes */}
          {[...col0, ...col1, ...col2, ...col3].map((node) => (
            <NodeLabel
              key={node.id}
              x={node.x}
              y={node.y}
              label={node.label}
              value={node.value}
              color={node.color}
              align="left"
              barHeight={node.height}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
