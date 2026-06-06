"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const STYLES = ["Classic", "Modern", "Minimal", "Bold"];
const ACCENT_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#ea580c", "#0891b2"];

export default function EmailSignatureTool() {
  const [form, setForm] = useState({
    name: "", jobTitle: "", company: "", email: "", phone: "", website: "",
    linkedin: "", twitter: "", style: "Modern", accentColor: "#2563eb",
  });
  const [copied, setCopied] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const generateHtml = () => {
    const { name, jobTitle, company, email, phone, website, linkedin, twitter, style, accentColor } = form;
    const divider = `<td style="padding:0 12px;color:#d1d5db;font-size:14px;">|</td>`;
    const contactItems = [
      email && `<a href="mailto:${email}" style="color:${accentColor};text-decoration:none;">${email}</a>`,
      phone && `<a href="tel:${phone}" style="color:#4b5563;text-decoration:none;">${phone}</a>`,
      website && `<a href="${website.startsWith("http") ? website : "https://" + website}" style="color:${accentColor};text-decoration:none;">${website.replace(/^https?:\/\//, "")}</a>`,
    ].filter(Boolean);
    const socialItems = [
      linkedin && `<a href="${linkedin.startsWith("http") ? linkedin : "https://linkedin.com/in/" + linkedin}" style="margin-right:6px;color:${accentColor};text-decoration:none;font-size:11px;">LinkedIn</a>`,
      twitter && `<a href="${twitter.startsWith("http") ? twitter : "https://twitter.com/" + twitter}" style="margin-right:6px;color:${accentColor};text-decoration:none;font-size:11px;">Twitter</a>`,
    ].filter(Boolean);

    if (style === "Classic") {
      return `<table style="font-family:Arial,sans-serif;font-size:13px;color:#374151;border-collapse:collapse;">
  <tr><td style="padding:2px 0;font-size:16px;font-weight:700;color:#111827;">${name}</td></tr>
  ${jobTitle || company ? `<tr><td style="padding:2px 0;color:#6b7280;">${[jobTitle, company].filter(Boolean).join(" · ")}</td></tr>` : ""}
  <tr><td style="padding:6px 0 2px;border-top:2px solid ${accentColor};">
    <table><tr>${contactItems.map((c, i) => `<td style="padding-right:10px;font-size:12px;">${c}</td>${i < contactItems.length - 1 ? divider : ""}`).join("")}</tr></table>
  </td></tr>
  ${socialItems.length ? `<tr><td style="padding-top:4px;">${socialItems.join("")}</td></tr>` : ""}
</table>`;
    }
    if (style === "Modern") {
      return `<table style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#374151;border-collapse:collapse;">
  <tr>
    <td style="padding-right:14px;vertical-align:middle;">
      <div style="width:44px;height:44px;border-radius:50%;background:${accentColor};display:flex;align-items:center;justify-content:center;color:white;font-size:18px;font-weight:700;text-align:center;line-height:44px;">${name.charAt(0).toUpperCase()}</div>
    </td>
    <td style="border-left:3px solid ${accentColor};padding-left:14px;">
      <div style="font-size:15px;font-weight:700;color:#111827;">${name}</div>
      ${jobTitle ? `<div style="font-size:12px;color:${accentColor};font-weight:600;">${jobTitle}</div>` : ""}
      ${company ? `<div style="font-size:12px;color:#6b7280;">${company}</div>` : ""}
      <div style="margin-top:6px;font-size:11px;color:#6b7280;">${contactItems.join(" &nbsp;·&nbsp; ")}</div>
      ${socialItems.length ? `<div style="margin-top:4px;">${socialItems.join("")}</div>` : ""}
    </td>
  </tr>
</table>`;
    }
    if (style === "Minimal") {
      return `<table style="font-family:Arial,sans-serif;font-size:12px;color:#6b7280;border-collapse:collapse;">
  <tr><td><strong style="font-size:14px;color:#111827;">${name}</strong>${jobTitle ? ` <span style="color:#9ca3af;">·</span> <span style="color:#6b7280;">${jobTitle}</span>` : ""}${company ? ` <span style="color:#9ca3af;">·</span> <span style="color:${accentColor};">${company}</span>` : ""}</td></tr>
  ${contactItems.length ? `<tr><td style="padding-top:3px;">${contactItems.join(" &nbsp;·&nbsp; ")}</td></tr>` : ""}
  ${socialItems.length ? `<tr><td style="padding-top:2px;">${socialItems.join("")}</td></tr>` : ""}
</table>`;
    }
    return `<table style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#fff;border-collapse:collapse;background:${accentColor};border-radius:8px;">
  <tr><td style="padding:14px 18px;">
    <div style="font-size:17px;font-weight:800;letter-spacing:-0.3px;">${name}</div>
    ${jobTitle || company ? `<div style="font-size:12px;opacity:0.85;margin-top:2px;">${[jobTitle, company].filter(Boolean).join(" · ")}</div>` : ""}
    ${contactItems.length ? `<div style="margin-top:8px;font-size:11px;opacity:0.9;">${contactItems.map(c => c.replace(/color:[^;]+/, "color:white")).join(" · ")}</div>` : ""}
    ${socialItems.length ? `<div style="margin-top:4px;">${socialItems.map(s => s.replace(/color:[^;]+/g, "color:white")).join("")}</div>` : ""}
  </td></tr>
</table>`;
  };

  const html = generateHtml();

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    toast.success("HTML copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100";

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { k: "name", p: "Full Name *" }, { k: "jobTitle", p: "Job Title" },
          { k: "company", p: "Company" }, { k: "email", p: "Email address" },
          { k: "phone", p: "Phone number" }, { k: "website", p: "Website" },
          { k: "linkedin", p: "LinkedIn URL or username" }, { k: "twitter", p: "Twitter URL or @handle" },
        ].map(({ k, p }) => (
          <input key={k} type="text" placeholder={p} value={form[k]} onChange={(e) => set(k, e.target.value)} className={inputCls} />
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-600">Style</p>
          <div className="flex gap-2">
            {STYLES.map((s) => (
              <button key={s} onClick={() => set("style", s)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${form.style === s ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-600">Accent Color</p>
          <div className="flex gap-2">
            {ACCENT_COLORS.map((c) => (
              <button key={c} onClick={() => set("accentColor", c)} style={{ background: c }}
                className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${form.accentColor === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`} />
            ))}
          </div>
        </div>
      </div>

      {form.name && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Preview</p>
          <div className="rounded-xl border border-gray-200 bg-white p-5" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={() => setForm({ name: "", jobTitle: "", company: "", email: "", phone: "", website: "", linkedin: "", twitter: "", style: "Modern", accentColor: "#2563eb" })}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
        <button onClick={handleCopyHtml} disabled={!form.name}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy HTML"}
        </button>
      </div>
    </div>
  );
}
