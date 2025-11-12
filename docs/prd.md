# SafeConnect: Offline Disaster Communication Network

## 1. Product Description
SafeConnect is a peer-to-peer (P2P) communication application that enables messaging, location, and status sharing between devices when internet or GSM networks are unavailable. It works on mobile devices and web browsers without requiring additional hardware.

## 2. Target Users
- Individuals in disaster-affected areas
- Teams operating in offline or low-connectivity zones
- Students or communities requiring emergency communication

## 3. Key Features
- **Offline Messaging:** Devices detect each other and exchange text messages and status updates.
- **Location Sharing:** Users’ locations are pinned on a map.
- **Status Buttons:** Quick-action buttons such as “Safe,” “Need Help,” or “Water/Shelter.”
- **Map View:** Users can see messages and status pins on the map using Mapbox GL.
- **Offline Indicator:** Connection status is displayed to the user.
- **AI Assistant Module (Optional):** Can be used for message prioritization or location prediction. The core functionality does not rely on AI.

## 4. Technology Stack
- **Frontend:** React.js + TailwindCSS + Mapbox GL
- **Backend (Optional):** FastAPI
- **Offline Data Storage:** IndexedDB
- **Peer-to-Peer Connectivity:** WebRTC + local peer discovery
- **AI Usage (Optional):** Minimal text analysis or embedding-based suggestions

## 5. Usage Scenarios
1. During a disaster, the user opens the app → scans for nearby devices.  
2. Sends a message or updates status.  
3. Other users’ locations and status information appear on the map.  
4. Messages are delivered even offline or with limited connectivity.

## 6. Success Criteria
- Fully functional, user-friendly P2P messaging  
- Modern and smooth UI/UX  
- Minimal AI dependency; system functions independently  
- Full compliance with jury evaluation criteria (Functionality, Creativity, Execution, Polish)
