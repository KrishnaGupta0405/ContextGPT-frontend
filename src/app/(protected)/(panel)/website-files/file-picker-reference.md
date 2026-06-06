# File Picker UI Reference

Reference guide based on `AddGoogleDriveFiles.jsx` — use this as a blueprint when building other file pickers (Dropbox, OneDrive, Notion, Box, GitHub, etc.).

---

## Component Structure

Every file picker follows this layout (top to bottom):

```
┌─────────────────────────────────────────┐
│  Header:  ← Back          Disconnect    │
├─────────────────────────────────────────┤
│  Title + Allowed file types badge       │
│  Connected status (email/account)       │
│                                         │
│  ┌─ Picker Container (fixed height) ──┐ │
│  │ [File Type ▾] [🔍 Search...] [↻]   │ │
│  │ Breadcrumb: My Drive > Folder > ... │ │
│  │ Name ↕ | Owner ↕ | Last modified ↕ │ │
│  │ ────────────────────────────────── │ │
│  │ 📁 assets             Owner  10:51  │ │
│  │ ☐ report.pdf          Owner  10:37  │ │
│  │ ☐ data.csv            Owner   9:50  │ │
│  │        (scrollable file list)       │ │
│  │        [Load More]                  │ │
│  └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  Footer: [Select (N)] [Cancel]   N sel  │
└─────────────────────────────────────────┘
```

---

## Essential State

| State | Purpose |
|---|---|
| `status` | OAuth connection status (`{ connected, email }`) |
| `loading` | Initial status check loading |
| `files` | Array of file objects from the API |
| `filesLoading` | Loading state for file fetches |
| `selectedFileIds` | `Set<string>` of selected file IDs |
| `importing` | Import-in-progress flag |
| `folderStack` | Array of `{ id, name }` for breadcrumb navigation |
| `nextPageToken` | Pagination cursor from the API |
| `searchQuery` | Text filter for file names |
| `fileTypeFilter` | Dropdown filter value (`"all"`, `"pdf"`, `"folder"`, etc.) |
| `sortField` | Active sort column (`"name"`, `"owner"`, `"modifiedTime"`) |
| `sortDirection` | `"asc"` or `"desc"` |
| `fileTypeDropdownOpen` | Controls dropdown visibility |

---

## Essential Features

### 1. OAuth Connection Flow

```
Not connected → Show connect button → Redirect to OAuth → Return with query param → Check status
Connected     → Show file browser + disconnect option
```

- **Connect**: `GET /oauth-connect/{provider}/auth` → returns `authUrl` → redirect
- **Status**: `GET /oauth-connect/{provider}/status` → `{ connected, email }`
- **Disconnect**: `DELETE /oauth-connect/{provider}/disconnect`
- **Listen for redirect**: Check `window.location.search` for provider-specific query param on mount

### 2. File Browsing & Folder Navigation

- **Fetch files**: `GET /oauth-connect/{provider}/files?folderId=...&pageToken=...`
- **Folder stack**: Push on folder click, slice on breadcrumb click
- **Breadcrumb**: Render from `folderStack` array, each segment is clickable
- **Pagination**: If `nextPageToken` exists, show "Load More" button; append results to existing list

### 3. Search Bar

- Client-side text filter on `file.name` (case-insensitive)
- Clear button (X icon) when query is non-empty
- Placed in the top toolbar alongside the file type dropdown

### 4. File Type Dropdown

Options to filter by file type (client-side filtering on `file.mimeType` or extension):

| Filter | Match logic |
|---|---|
| All file types | No filter |
| Folders | `file.isFolder === true` |
| Documents | mime includes `document`/`msword`, or `.docx`/`.txt` extension |
| Spreadsheets | mime includes `spreadsheet`/`excel`, or `.csv`/`.xlsx` extension |
| Presentations | mime includes `presentation`/`powerpoint` |
| PDFs | mime includes `pdf`, or `.pdf` extension |
| Images | mime includes `image` |
| Videos | mime includes `video` |

Implementation: A `relative` container with a toggle button and an absolutely-positioned dropdown. Use a fixed overlay (`fixed inset-0`) to close on outside click.

### 5. Sortable Column Headers

Three columns: **Name**, **Owner**, **Last modified**

- Click a column header to sort by that field
- Click again to toggle ascending/descending
- Show arrow icon (↑/↓) on the active sort column
- Folders always sort before files regardless of sort direction

### 6. Scrollable File List

- Picker container has a **fixed height** (e.g., `480px`) with `flex flex-col`
- The file list section uses `flex-1 overflow-y-auto` so it scrolls independently
- Top bar, breadcrumb, and column headers remain fixed above the scroll area

### 7. File Selection

- Files show a **checkbox**; folders show a **folder icon** (no checkbox)
- Clicking a file row toggles selection; clicking a folder row navigates into it
- Use a `Set<string>` for O(1) selection lookups
- Selected rows get a highlight background (`bg-blue-50`)

### 8. Import Action

```
POST /oauth-connect/{provider}/import
Body: { fileIds: string[], chatbotId: string }
Response: { imported: number, failed: number }
```

- Disabled when no files are selected or import is in progress
- Show spinner during import
- Toast success/error based on response

---

## File Object Shape

Each file from the API should have:

```js
{
  id: string,          // Unique file ID from the provider
  name: string,        // Display name
  mimeType: string,    // MIME type (used for filtering & icons)
  isFolder: boolean,   // True if it's a folder/container
  size: number,        // File size in bytes (optional)
  modifiedTime: string,// ISO date string
  ownerName: string,   // Display name of the file owner
}
```

---

## Props

| Prop | Type | Purpose |
|---|---|---|
| `onBack` | `() => void` | Navigate back / close the picker |
| `onAdd` | `() => void` | Callback after successful import (refresh parent file list) |

---

## UI Component Dependencies

- `Button` — from `@/components/ui/button`
- `Checkbox` — from `@/components/ui/checkbox`
- Icons from `lucide-react`: `ChevronLeft`, `ChevronRight`, `Loader2`, `FolderOpen`, `Check`, `Unplug`, `RefreshCw`, `Search`, `ArrowUp`, `ArrowDown`, `ChevronDown`, `X`
- `toast` from `sonner` for notifications
- `api` from `@/lib/axios` for API calls
- `useChatbot` from `@/context/ChatbotContext` for chatbot ID

---

## Checklist for New Pickers

- [ ] OAuth connect/disconnect/status endpoints
- [ ] File listing endpoint with folder navigation + pagination
- [ ] Import endpoint
- [ ] File type dropdown with provider-relevant filters
- [ ] Search bar with clear button
- [ ] Sortable column headers (Name, Owner, Last modified)
- [ ] Scrollable file list in fixed-height container
- [ ] Breadcrumb navigation for folders
- [ ] Checkbox selection for files, folder icon for folders
- [ ] Select/Cancel footer with count badge
- [ ] Loading & empty states
- [ ] Allowed file types badge
