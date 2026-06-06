import React from "react";

/**
 * Returns an appropriate file-type SVG icon based on mimeType or fileName.
 * Covers Google Workspace, MS Office, media, code, archives, and common files.
 *
 * Props:
 *  - mimeType (string)  — MIME type (preferred if available)
 *  - fileName (string)  — file name, used to derive extension when mimeType is absent
 *  - className (string) — Tailwind classes for sizing, default "h-5 w-5"
 */

function getExtension(fileName) {
  if (!fileName) return "";
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

// Base document SVG shell
const DocIcon = ({ fill, cornerFill, children, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z" fill={fill} />
    <path d="M14 2l6 6h-4a2 2 0 01-2-2V2z" fill={cornerFill} />
    {children}
  </svg>
);

// Label inside doc icon
const DocLabel = ({ text }) => (
  <text x="12" y="17" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold" fontFamily="sans-serif">
    {text}
  </text>
);

// Lines inside doc icon (text file look)
const DocLines = () => (
  <>
    <rect x="8" y="12" width="8" height="1.2" rx=".6" fill="#fff" />
    <rect x="8" y="14.5" width="8" height="1.2" rx=".6" fill="#fff" />
    <rect x="8" y="17" width="5" height="1.2" rx=".6" fill="#fff" />
  </>
);

export function FileTypeIcon({ mimeType, fileName, className = "h-5 w-5" }) {
  const ext = getExtension(fileName);

  // --- Google Workspace ---
  if (mimeType === "application/vnd.google-apps.document") {
    return <DocIcon fill="#4285F4" cornerFill="#A1C2FA" className={className}><DocLines /></DocIcon>;
  }
  if (mimeType === "application/vnd.google-apps.spreadsheet") {
    return (
      <DocIcon fill="#0F9D58" cornerFill="#87CEAC" className={className}>
        <rect x="7" y="12" width="10" height="7" rx="1" stroke="#fff" strokeWidth="1.2" fill="none" />
        <line x1="12" y1="12" x2="12" y2="19" stroke="#fff" strokeWidth="1" />
        <line x1="7" y1="15.5" x2="17" y2="15.5" stroke="#fff" strokeWidth="1" />
      </DocIcon>
    );
  }
  if (mimeType === "application/vnd.google-apps.presentation") {
    return (
      <DocIcon fill="#F4B400" cornerFill="#F7DD8F" className={className}>
        <rect x="7.5" y="12" width="9" height="6" rx="1" fill="#fff" />
      </DocIcon>
    );
  }
  if (mimeType === "application/vnd.google-apps.form") {
    return (
      <DocIcon fill="#7248B9" cornerFill="#B89AE8" className={className}>
        <circle cx="9" cy="13" r="1" fill="#fff" /><rect x="11" y="12.4" width="5" height="1.2" rx=".6" fill="#fff" />
        <circle cx="9" cy="16.5" r="1" fill="#fff" /><rect x="11" y="15.9" width="5" height="1.2" rx=".6" fill="#fff" />
      </DocIcon>
    );
  }
  if (mimeType === "application/vnd.google-apps.folder") {
    return null; // folders handled separately
  }

  // --- PDF ---
  if (mimeType === "application/pdf" || ext === "pdf") {
    return <DocIcon fill="#EA4335" cornerFill="#F4A8A0" className={className}><DocLabel text="PDF" /></DocIcon>;
  }

  // --- MS Word ---
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword" ||
    ["doc", "docx", "docm", "dot", "dotx"].includes(ext)
  ) {
    return <DocIcon fill="#4285F4" cornerFill="#A1C2FA" className={className}><DocLabel text="W" /></DocIcon>;
  }

  // --- MS Excel ---
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-excel" ||
    ["xls", "xlsx", "xlsm", "xlsb"].includes(ext)
  ) {
    return <DocIcon fill="#0F9D58" cornerFill="#87CEAC" className={className}><DocLabel text="X" /></DocIcon>;
  }

  // --- MS PowerPoint ---
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    mimeType === "application/vnd.ms-powerpoint" ||
    ["ppt", "pptx", "pptm"].includes(ext)
  ) {
    return <DocIcon fill="#F4B400" cornerFill="#F7DD8F" className={className}><DocLabel text="P" /></DocIcon>;
  }

  // --- Images ---
  if (mimeType?.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "svg", "webp", "bmp", "ico", "tiff"].includes(ext)) {
    return (
      <DocIcon fill="#EA4335" cornerFill="#F4A8A0" className={className}>
        <path d="M7 18l3-4 2 2 3-4 3 4v2H7v-0z" fill="#fff" opacity=".9" />
        <circle cx="9" cy="13" r="1.5" fill="#fff" />
      </DocIcon>
    );
  }

  // --- Video ---
  if (mimeType?.startsWith("video/") || ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv"].includes(ext)) {
    return (
      <DocIcon fill="#EA4335" cornerFill="#F4A8A0" className={className}>
        <path d="M10 12v5l4.5-2.5L10 12z" fill="#fff" />
      </DocIcon>
    );
  }

  // --- Audio ---
  if (mimeType?.startsWith("audio/") || ["mp3", "wav", "ogg", "flac", "aac", "wma", "m4a"].includes(ext)) {
    return (
      <DocIcon fill="#F4B400" cornerFill="#F7DD8F" className={className}>
        <path d="M12 11v5.5M12 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" stroke="#fff" strokeWidth="1.2" fill="none" />
      </DocIcon>
    );
  }

  // --- Archives ---
  if (
    ["application/zip", "application/x-rar-compressed", "application/gzip", "application/x-7z-compressed", "application/x-tar"].includes(mimeType) ||
    ["zip", "rar", "gz", "7z", "tar", "bz2", "xz"].includes(ext)
  ) {
    return <DocIcon fill="#5F6368" cornerFill="#B0B3B8" className={className}><DocLabel text="ZIP" /></DocIcon>;
  }

  // --- CSV ---
  if (mimeType === "text/csv" || ext === "csv") {
    return <DocIcon fill="#0F9D58" cornerFill="#87CEAC" className={className}><DocLabel text="CSV" /></DocIcon>;
  }

  // --- JSON ---
  if (mimeType === "application/json" || ext === "json") {
    return <DocIcon fill="#F4B400" cornerFill="#F7DD8F" className={className}><DocLabel text="{ }" /></DocIcon>;
  }

  // --- XML / HTML ---
  if (["xml", "html", "htm", "xhtml", "svg"].includes(ext) || mimeType === "text/html" || mimeType === "application/xml") {
    return <DocIcon fill="#E37400" cornerFill="#F4C078" className={className}><DocLabel text="</>" /></DocIcon>;
  }

  // --- Markdown ---
  if (ext === "md" || ext === "mdx" || mimeType === "text/markdown") {
    return <DocIcon fill="#5F6368" cornerFill="#B0B3B8" className={className}><DocLabel text="MD" /></DocIcon>;
  }

  // --- Code files ---
  if (["js", "jsx", "ts", "tsx"].includes(ext)) {
    return <DocIcon fill="#F7DF1E" cornerFill="#FFF9C4" className={className}><DocLabel text="JS" /></DocIcon>;
  }
  if (["py", "pyw"].includes(ext)) {
    return <DocIcon fill="#3776AB" cornerFill="#90CAF9" className={className}><DocLabel text="PY" /></DocIcon>;
  }
  if (["java", "kt", "kts"].includes(ext)) {
    return <DocIcon fill="#EA4335" cornerFill="#F4A8A0" className={className}><DocLabel text="JV" /></DocIcon>;
  }
  if (["c", "cpp", "cc", "h", "hpp"].includes(ext)) {
    return <DocIcon fill="#00599C" cornerFill="#90CAF9" className={className}><DocLabel text="C+" /></DocIcon>;
  }
  if (["go"].includes(ext)) {
    return <DocIcon fill="#00ADD8" cornerFill="#80DEEA" className={className}><DocLabel text="GO" /></DocIcon>;
  }
  if (["rs"].includes(ext)) {
    return <DocIcon fill="#CE422B" cornerFill="#F4A8A0" className={className}><DocLabel text="RS" /></DocIcon>;
  }
  if (["rb"].includes(ext)) {
    return <DocIcon fill="#CC342D" cornerFill="#F4A8A0" className={className}><DocLabel text="RB" /></DocIcon>;
  }
  if (["php"].includes(ext)) {
    return <DocIcon fill="#777BB4" cornerFill="#B89AE8" className={className}><DocLabel text="HP" /></DocIcon>;
  }
  if (["swift"].includes(ext)) {
    return <DocIcon fill="#F05138" cornerFill="#F4A8A0" className={className}><DocLabel text="SW" /></DocIcon>;
  }
  if (["css", "scss", "sass", "less"].includes(ext)) {
    return <DocIcon fill="#264de4" cornerFill="#A1C2FA" className={className}><DocLabel text="CS" /></DocIcon>;
  }
  if (["sql"].includes(ext)) {
    return <DocIcon fill="#336791" cornerFill="#90CAF9" className={className}><DocLabel text="SQ" /></DocIcon>;
  }
  if (["sh", "bash", "zsh", "bat", "cmd", "ps1"].includes(ext)) {
    return <DocIcon fill="#4EAA25" cornerFill="#87CEAC" className={className}><DocLabel text="SH" /></DocIcon>;
  }
  if (["yml", "yaml"].includes(ext)) {
    return <DocIcon fill="#CB171E" cornerFill="#F4A8A0" className={className}><DocLabel text="YM" /></DocIcon>;
  }
  if (["toml", "ini", "cfg", "conf", "env"].includes(ext)) {
    return <DocIcon fill="#5F6368" cornerFill="#B0B3B8" className={className}><DocLabel text="CF" /></DocIcon>;
  }

  // --- Plain text ---
  if (mimeType === "text/plain" || ext === "txt" || ext === "log") {
    return <DocIcon fill="#5F6368" cornerFill="#B0B3B8" className={className}><DocLines /></DocIcon>;
  }

  // --- Default ---
  return (
    <DocIcon fill="#5F6368" cornerFill="#B0B3B8" className={className} />
  );
}
