# SafeConnect — Product Requirements Document (PRD)

## Project Overview
SafeConnect is a web (PWA-capable) and mobile-friendly application that enables people to communicate, share location, and report status during disasters when internet and GSM networks are unavailable. The app uses peer-to-peer connectivity (WebRTC + local discovery) and offline-first storage (IndexedDB). AI may be used only as an auxiliary tool (message prioritization), not for core functionality.

## Goals
- Provide reliable P2P text messaging and status updates in offline/limited networks.
- Allow users to share location and visualize nearby users on a map.
- Offer quick-action status buttons for immediate, repeatable reporting.
- Keep user data local-first with sync-on-availability behavior.

## Target Users
- People in disaster-affected areas.
- First responders, volunteers, community coordinators.
- Event organizers in areas with unreliable coverage.

## Key Features
1. Offline P2P Messaging (primary)
   - Peer discovery on local network or via optional lightweight signaling.
   - WebRTC data channels for message transfer.
   - Message acknowledgements, retry, and local persistence.

2. Location Sharing and Map Visualization
   - Show users as pins on Mapbox or MapLibre maps.
   - Pin color/shape indicates user status (Safe, Help Needed, Water/Shelter).
   - Timestamped locations and optional breadcrumb trail.

3. Quick-Action Status Buttons
   - Floating action buttons for: "Safe", "Help Needed", "Water/Shelter".
   - Quick broadcast to connected peers with location and optional text.

4. Offline Storage and Sync
   - IndexedDB for messages, peers, and status updates.
   - Automatic background sync when a peer becomes reachable.

5. Optional AI Module (auxiliary)
   - Lightweight message prioritization (e.g., tag urgent messages).
   - Local-only analysis suggested; no remote AI dependency.

6. Responsive UI/UX
   - React + TailwindCSS; PWA-ready.
   - Accessible color contrast and large touch targets for quick use.

## Success Criteria
- Messaging works across devices on the same local network without internet.
- Map pins reflect status updates within 5–15 seconds of broadcast.
- IndexedDB persists messages and status across app restarts.
- Demo video (≤3 minutes) clearly shows core flows.

## Open Questions / Assumptions
- Browser support: modern Chromium-based mobile browsers. Some features (WebRTC & background) vary by platform.
- Map provider: Mapbox (requires token) or MapLibre as an offline-friendly alternative.

## UX Flow (high level)
1. User opens SafeConnect (PWA prompt offered).
2. App requests location & local network permissions.
3. App discovers peers automatically and/or via a signaling server.
4. Users send messages or press a quick status button.
5. Messages appear in chat and as pins on the map; persisted to IndexedDB.

## Security & Privacy
- Local-first storage; optional encrypted sync channels if servers used.
- Minimal telemetry; no PII transmitted unless user includes it.
- Users must grant location permission; show clear privacy messaging.

## KPIs for Hackathon
- Working local P2P messaging demo.
- Map with at least status pins and live updates.
- One-page README and short demo video script.

---

Created for EHC OpenHack 2025 — SafeConnect
