# WebSocket Integration — Website Files Page

## Overview

The `website-files/page.jsx` uses WebSocket (via `useChattingSocket()` from `ChattingSocketContext`) for **real-time ingestion status updates**. The same pattern is used by the sibling `website-links/page.jsx`.

---

## Frontend WebSocket Flow

### Connection Setup
- `ChattingSocketContext` (`src/context/ChattingSocketContext.jsx`) creates a single WebSocket connection to `ws://<backend>/ws/chatting`
- Authenticates via `httpOnly` cookie (`accessToken`)
- Auto-reconnects after 3s on disconnect
- Sends keep-alive `ping` every 30s
- Exposes: `{ isConnected, send, addListener }`

### Subscription (page.jsx lines 410–434)
1. **Subscribe**: Sends `{ type: "subscribe:ingestion", chatbotId }` to tell the backend WS server to include this client in the ingestion channel for the selected chatbot.
2. **Listen**: Registers a listener for `"ingestion:status"` events.
3. **On event received**:
   - Optimistically updates the matching file's status in-place via `setFiles()` (matches on `data.fileId`).
   - Immediately re-fetches the full file list via HTTP (`fetchFiles()`) to get accurate stats and any new rows.

---

## Backend WebSocket Support

### Server (`Backend Express/src/utils/websocket.js`)
- Uses native `ws` (WebSocketServer), mounted at `/ws/chatting` path.
- Maintains three subscriber maps:
  - `chatbotSubscribers` — chatbot-level events (threads)
  - `threadSubscribers` — thread-level events (messages)
  - `ingestionSubscribers` — ingestion/file status updates
- Handles `subscribe:ingestion` message type (line 158) — adds client to `ingestionSubscribers` map keyed by `chatbotId`.
- Exports `broadcastIngestionUpdate(chatbotId, payload)` — sends payload to all subscribed clients.
- Cleans up subscriptions on socket close.

### Emitters (Backend controllers that broadcast `ingestion:status`)

#### `ingestion.firecrawl.controller.js`
Emits on Firecrawl webhook events:
| Event | Status sent | When |
|---|---|---|
| Line ~402 | `PROCESSING` | Firecrawl job starts processing |
| Line ~437 | `PAGE_PROCESSED` | Individual page scraped & saved |
| Line ~488 | `COMPLETED` | Entire crawl/scrape job finished |
| Line ~522 | `FAILED` | Job failed |

#### `ingestion.controller.js`
Emits during file processing pipeline:
| Event | Status sent | When |
|---|---|---|
| Line ~359 | `FAILED` | File chunking/embedding failed |
| Line ~438 | `COMPLETED` | File successfully processed |
| Line ~476 | Generic `status` | Any status transition (e.g., CHUNKING, EMBEDDING) |

---

## What Gets Updated in Real-Time via WebSocket

| Feature | Real-time? | Mechanism |
|---|---|---|
| File status badge (PENDING → COMPLETED → FAILED) | Yes | Optimistic in-place update + HTTP re-fetch |
| Stats counters (Total/Trained/Pending/Failed cards) | Yes | HTTP re-fetch triggered by WS event |
| New rows appearing (e.g., PAGE_PROCESSED adds files) | Yes | HTTP re-fetch triggered by WS event |
| File metadata (size, tokens, pages) | Yes | Via HTTP re-fetch |

## What Uses HTTP REST Only (No WebSocket)

| Feature | HTTP Method | Endpoint |
|---|---|---|
| Initial data load | `GET` | `/ingestion/account/:accountId/chatbot/:chatbotId/files` |
| Delete files | `DELETE` | `/ingestion/:chatbotId/files?fileId=...` |
| Resync files | `POST` | `/ingestion/:chatbotId/files/resync?fileId=...` |
| Add files | via `AddFilesModal` | Various ingestion endpoints |
| Manual refresh button | `GET` | Same as initial load |
| CSV download | N/A | Client-side from current `files` state |

---

## Known Issue: `fileId` vs `jobId` Mismatch

The frontend WS listener checks `data.fileId` to do in-place updates, but `ingestion.firecrawl.controller.js` emits `data.jobId` (not `fileId`) for some events (PROCESSING, PAGE_PROCESSED, COMPLETED, FAILED). This means the optimistic in-place status update via `setFiles()` won't match for firecrawl-originated events. However, this is inconsequential because `fetchFiles()` is called immediately after, which does a full HTTP re-fetch and overwrites the state anyway.

---

## Comparison: website-files vs website-links

Both pages use the **identical WebSocket pattern**. The only differences:
- `website-files` fetches from `/ingestion/.../files` and reads `response.data.data.files`
- `website-links` fetches from `/ingestion/.../links` and reads `response.data.data.links`
- `website-links` uses `POST /ingestion/:chatbotId/links/resync` for resync (vs `/files/resync`)
- `website-links` has edit functionality (Wrench icon → `AddLinksModal` with `initialData`)
- `website-files` has those edit/resync per-row buttons commented out
