# SafeConnect UI Storyboard

---

## 🏠 Home Screen

| Area | Content | Notes |
|------|--------|-------|
| Map Panel | Mapbox GL, pastel tones | Pins indicate user status; hover shows user details |
| Quick Status Buttons | Bottom-right corner, circular icons | Buttons such as “Need Help,” “Safe” |
| Offline Indicator | Top-left corner, red/green light | Displays real-time network status |

---

## 💬 Messaging Screen

| Area | Content | Notes |
|------|--------|-------|
| Chat Bubbles | Color-coded: 🔴 Urgent, 🟢 Safe | Hover or click to see detailed message |
| Message Input Box | Fixed at bottom, quick access | Can include voice messages, emojis, and quick-reply options |

---

## ⏱ Demo Flow (3 Minutes)

1. Launch: “You are in a disaster area, no internet” (5–10 sec)  
2. User 1 presses the “Need Help” button (10 sec)  
3. User 2 on the same network receives the message; map pin lights up (10 sec)  
4. Offline data synchronization (20 sec)  
5. Status of all pins shown on the map (20 sec)  
6. Closing: “SafeConnect, when networks fall, humans connect.” (5 sec)  

---

## 💡 UI Enhancement Technologies

| Technology | Usage | Benefit |
|------------|-------|--------|
| **WebGL / Three.js** | 3D buildings, topography on the map | More realistic visualization |
| **D3.js** | Status statistics, pin density | Interactive data visualization |
| **Socket.IO / WebRTC** | Real-time messaging and pin updates | Live data with offline-first sync support |
| **React Native / Flutter** | Mobile app development | Cross-platform performance and native UI |
| **Lottie Animations** | Button and notification animations | Makes UI interactions more engaging |
| **Mapbox Heatmaps** | User density visualization | Quickly highlights areas of urgency |
| **AI-Assisted Suggestions (Optional)** | Fastest route or help prediction | Guides users; AI dependency is optional |

---

## ✅ Demo Notes

- Functionality: ✅  
- Creativity: ✅  
- Execution: ✅  
- Polish: ✅  
- AI Dependency: Optional (only for suggestions)
