# Requirements Analysis — SafeConnect

## Functional Requirements (detailed)
- FR1: Peer Discovery — The app must detect and list peers on the same local network or via optional signaling.
- FR2: P2P Messaging — Exchange of short text messages via WebRTC data channels.
- FR3: Location Exchange — Share geolocation and show on map with timestamp.
- FR4: Quick Status — Buttons: Safe, Help Needed, Water/Shelter. Broadcasts a short structured message.
- FR5: Offline Persistence — All messages, statuses, and peer metadata must persist in IndexedDB.
- FR6: Sync & Reconciliation — When peers reconnect, messages should reconcile and dedupe by message id & timestamp.
- FR7: UI/UX — Responsive, mobile-friendly, large touch targets.

## Non-Functional Requirements
- NFR1: Offline-first: core features work without internet.
- NFR2: Low-latency: local message delivery aimed < 5s in LAN conditions.
- NFR3: Security: no PII leakage; optional local encryption for messages.
- NFR4: Compatibility: modern browsers (Chrome/Edge/Android WebView); PWA friendly.

## Constraints
- Limited to browser APIs for P2P (WebRTC). Mobile limitations for background operations.
- Map usage may require API key; MapLibre is an alternative for offline tiles.
- AI usage limited to client-side analyses.

## Dependencies & Libraries
- React, Vite
- TailwindCSS
- Mapbox GL JS (or MapLibre GL JS)
- idb (IndexedDB wrapper)
- FastAPI + uvicorn (optional signalling server)

## Risks & Mitigations
- Peer discovery fails on isolated networks -> Use dual discovery: multicast/local SSDP (if possible) + optional lightweight signaling server.
- Browser incompatibility for WebRTC datachannel -> Provide graceful fallback: local-only message queue with manual export/import.
- Map API quota issues -> Support MapLibre + offline tile caching.

## Data Model (proposal)
- Peer: {id, displayName, lastSeen, location, status}
- Message: {id, from, to (optional broadcast), text, timestamp, status, priorityTag}
- StatusEvent: {id, from, statusType, location, timestamp}

## Edge Cases
- Duplicate messages due to retries -> Use client-generated UUIDs and dedupe on id.
- Devices behind NATs -> Local network P2P likely fine; otherwise fallback to signaling for ICE.
- Conflicting status updates -> Last-write-wins with timestamp; show timeline in UI.

## Acceptance Criteria
- Manual test: two devices on same LAN exchange messages and status; map updates visible.
- Offline persistence: messages remain after reload and reappear on map when relevant.

---

Notes: This analysis consolidates the existing docs and extends them into explicit engineering constraints and acceptance tests for implementation at the hackathon.
