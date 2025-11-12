# SafeConnect - Requirement Analysis

## 1. Functional Requirements
- [FR1] The application must be able to transmit messages between devices even without internet.
- [FR2] User location must be accurately pinned on the map.
- [FR3] Quick status buttons such as “Safe,” “Need Help,” or “Water/Shelter” must be available.
- [FR4] Offline data storage must be supported, and messages should be synchronized when possible.
- [FR5] Users must be able to scan for and discover each other (local peer discovery).

## 2. Non-Functional Requirements
- [NFR1] UI must be modern, smooth, and mobile-friendly.
- [NFR2] Messages should be delivered with minimal delay.
- [NFR3] AI should only be used for suggestions and prioritization; core functionality must not depend on AI.
- [NFR4] The application must work on both web and mobile platforms (PWA supported).

## 3. Constraints
- No hardware dependency.
- AI usage is limited to auxiliary purposes.
- The app will rely on the browser or device’s Wi-Fi/local network capabilities.

## 4. Dependencies
- React.js, TailwindCSS, Mapbox GL
- FastAPI (optional, for backend)
- IndexedDB
- WebRTC
- (Optional) lightweight NLP or embedding library

## 5. Risk Analysis
- If peer discovery fails, offline message delivery may be blocked → a fallback mechanism is required.
- If the map API quota is exceeded, pins may not appear → offline caching should be used.
- Mobile devices will not work without Wi-Fi or Bluetooth permissions → a user guide should be provided.
