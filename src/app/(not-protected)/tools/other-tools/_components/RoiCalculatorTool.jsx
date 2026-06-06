"use client";

import { useState } from "react";
import { RotateCcw, Calculator } from "lucide-react";

const FIELD_GROUPS = [
  {
    heading: "Current Support Costs",
    fields: [
      { name: "agentCount", label: "Number of support agents", default: 5, min: 1 },
      { name: "avgSalary", label: "Average agent salary ($/year)", default: 45000, min: 0 },
      { name: "ticketsPerDay", label: "Support tickets per day", default: 200, min: 1 },
    ],
  },
  {
    heading: "Chatbot Performance",
    fields: [
      { name: "automationRate", label: "Expected automation rate (%)", default: 70, min: 0, max: 100 },
      { name: "chatbotMonthlyCost", label: "Chatbot monthly cost ($)", default: 299, min: 0 },
    ],
  },
  {
    heading: "Business Metrics",
    fields: [
      { name: "avgTicketCost", label: "Current cost per ticket ($)", default: 8, min: 0 },
      { name: "monthlyVisitors", label: "Monthly website visitors", default: 10000, min: 0 },
      { name: "conversionLift", label: "Expected conversion lift (%)", default: 5, min: 0, max: 100 },
      { name: "avgOrderValue", label: "Average order value ($)", default: 80, min: 0 },
    ],
  },
];

export default function RoiCalculatorTool() {
  const initialVals = Object.fromEntries(
    FIELD_GROUPS.flatMap((g) => g.fields.map((f) => [f.name, f.default]))
  );
  const [vals, setVals] = useState(initialVals);
  const [result, setResult] = useState(null);

  const set = (k, v) => setVals((p) => ({ ...p, [k]: Number(v) }));

  const calculate = () => {
    const { agentCount, avgSalary, ticketsPerDay, automationRate, chatbotMonthlyCost, avgTicketCost, monthlyVisitors, conversionLift, avgOrderValue } = vals;
    const monthlyTickets = ticketsPerDay * 30;
    const automatedTickets = monthlyTickets * (automationRate / 100);
    const ticketSavings = automatedTickets * avgTicketCost;
    const staffReduction = agentCount * (automationRate / 100);
    const staffSavings = staffReduction * (avgSalary / 12);
    const newConversions = monthlyVisitors * (conversionLift / 100) * 0.02;
    const revenueGain = newConversions * avgOrderValue;
    const totalBenefit = ticketSavings + staffSavings + revenueGain;
    const netGain = totalBenefit - chatbotMonthlyCost;
    const roi = chatbotMonthlyCost > 0 ? ((netGain / chatbotMonthlyCost) * 100) : 0;
    const paybackMonths = netGain > 0 ? (chatbotMonthlyCost / netGain) : Infinity;
    setResult({
      ticketSavings: ticketSavings.toFixed(0), staffSavings: staffSavings.toFixed(0),
      revenueGain: revenueGain.toFixed(0), totalBenefit: totalBenefit.toFixed(0),
      netGain: netGain.toFixed(0), roi: roi.toFixed(0),
      paybackMonths: paybackMonths === Infinity ? "N/A" : paybackMonths.toFixed(1),
      automatedTickets: automatedTickets.toFixed(0), annualSavings: (netGain * 12).toFixed(0),
    });
  };

  const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {FIELD_GROUPS.map((group) => (
        <div key={group.heading}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600">{group.heading}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.fields.map((f) => (
              <div key={f.name} className="space-y-1">
                <label className="text-xs font-medium text-gray-600">{f.label}</label>
                <input type="number" min={f.min ?? 0} max={f.max} value={vals[f.name]} onChange={(e) => set(f.name, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-3">
        <button onClick={() => { setVals(initialVals); setResult(null); }} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
        <button onClick={calculate} className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Calculator className="h-4 w-4" /> Calculate ROI
        </button>
      </div>

      {result && (
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <div className={`rounded-xl p-5 text-center ${Number(result.roi) > 0 ? "bg-green-50" : "bg-red-50"}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Monthly ROI</p>
            <p className={`text-4xl font-extrabold ${Number(result.roi) > 0 ? "text-green-600" : "text-red-500"}`}>{result.roi}%</p>
            <p className="mt-1 text-sm text-gray-500">Net gain: {fmt(result.netGain)}/month · Payback: {result.paybackMonths} months</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Ticket cost savings", value: fmt(result.ticketSavings), sub: `${result.automatedTickets} tickets automated/mo` },
              { label: "Staff time savings", value: fmt(result.staffSavings), sub: "from reduced agent workload" },
              { label: "Revenue gain", value: fmt(result.revenueGain), sub: "from improved conversions" },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-400">{card.sub}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-blue-50 px-5 py-4 text-center">
            <p className="text-sm text-gray-600">Estimated <span className="font-semibold text-blue-700">annual savings: {fmt(result.annualSavings)}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
