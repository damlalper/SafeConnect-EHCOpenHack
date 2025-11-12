# SafeConnect — Offline Disaster Communication Network

![SafeConnect](https://img.shields.io/badge/Status-Hackathon%20Ready-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![PWA](https://img.shields.io/badge/PWA-Enabled-brightgreen)

**SafeConnect** is an offline-first, peer-to-peer communication application designed for disaster scenarios where internet and GSM networks are unavailable. Built for the **EHC OpenHack 2025** hackathon.

## 🎯 Project Overview

SafeConnect enables real-time communication, location sharing, and status updates between devices using **WebRTC P2P connections** and **local network discovery**, ensuring communication continues even when traditional networks fail.

### Key Features

✅ **Offline P2P Messaging** - Direct device-to-device communication via WebRTC
✅ **Location Sharing** - Real-time location tracking on interactive maps
✅ **Quick Status Buttons** - One-tap emergency status broadcasting (Safe, Need Help, Water/Shelter)
✅ **Offline Storage** - Messages persist using IndexedDB
✅ **PWA Support** - Install as a mobile app
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **Real-time Map Visualization** - See all peers and status updates on a map

## 📁 Project Structure

```
SafeConnect-EHCOpenHack/
├── frontend/              # React + Vite frontend application
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── MapView.jsx           # Interactive map with markers
│   │   │   ├── MessageList.jsx       # Chat message display
│   │   │   ├── MessageInput.jsx      # Message input field
│   │   │   ├── PeerList.jsx          # Connected peers list
│   │   │   ├── StatusButtons.jsx     # Emergency status buttons
│   │   │   ├── OfflineIndicator.jsx  # Connection status indicator
│   │   │   └── PeerConnection.jsx    # WebRTC peer handling
│   │   ├── lib/
│   │   │   ├── db.js      # IndexedDB wrapper
│   │   │   └── uuid.js    # UUID generator
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Application entry point
│   ├── public/
│   │   ├── manifest.json  # PWA manifest
│   │   └── sw.js          # Service worker for offline support
│   └── package.json
├── backend/               # FastAPI signaling server (optional)
│   └── app/main.py
├── docs/                  # Documentation
├── PRD.md                 # Product Requirements Document
├── requirements_analysis.md
└── demo_script.md         # 3-minute demo script

```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for optional signaling server)
- Modern browser with WebRTC support (Chrome, Edge, Firefox)

### Frontend Setup

1. **Clone the repository**
   ```bash
   cd SafeConnect-EHCOpenHack/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   cp .env.example .env
   # Edit .env and add your Mapbox token (optional - MapLibre works without token)
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Backend Setup (Optional)

The signaling server helps establish P2P connections across NATs.

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv

   # Windows
   .\.venv\Scripts\activate

   # Mac/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start server**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## 🎮 How to Use

### First Time Setup

1. Open SafeConnect in your browser
2. Enter your display name when prompted
3. Allow location permissions (required for status updates)

### Sending Messages

1. Navigate to the "Messages" tab
2. Type your message in the input field
3. Press "Send" or hit Enter

### Broadcasting Status

1. Click one of the status buttons:
   - 🟢 **Safe** - Let others know you're okay
   - 🔴 **Need Help** - Request immediate assistance
   - 🔵 **Water/Shelter** - Request resources

2. Your status and location will broadcast to all connected peers
3. Status appears on the map with color-coded markers

### Viewing Peers

1. Click the "Peers" tab to see connected devices
2. Each peer shows their status and last seen time
3. Click map markers to see peer details

## 🧪 Testing the Application

### Local Network Testing (Recommended)

1. **Start the frontend and backend**
   ```bash
   # Terminal 1 - Backend
   cd backend
   uvicorn app.main:app --reload --port 8000

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Open multiple browser windows/tabs**
   - Navigate to `http://localhost:5173` in each
   - Use different names for each "user"
   - Ensure devices are on the same local network

3. **Test features**
   - Send messages between windows
   - Broadcast status updates
   - Check map for peer locations
   - Close and reopen - messages should persist

### Mobile Testing

1. **Find your local IP address**
   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   ```

2. **Update signaling host**
   - Edit `frontend/.env`
   - Set `VITE_SIGNALING_HOST=YOUR_LOCAL_IP:8000`

3. **Access from mobile device**
   - Connect mobile to same network
   - Navigate to `http://YOUR_LOCAL_IP:5173`

## 🏗️ Building for Production

```bash
cd frontend
npm run build
```

The production-ready files will be in `frontend/dist/`

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Follow prompts to install

### Mobile (Android/iOS)
1. Open in browser
2. Tap "Add to Home Screen"
3. App will function offline after installation

## 🎥 Demo Video Script

See `demo_script.md` for a complete 3-minute demo walkthrough perfect for hackathon presentations.

## 📊 Technology Stack

### Frontend
- **React 18.3** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS 3.4** - Styling
- **Mapbox GL / MapLibre** - Interactive maps
- **IndexedDB (idb)** - Offline storage
- **WebRTC** - Peer-to-peer communication

### Backend (Optional)
- **FastAPI** - WebSocket signaling server
- **uvicorn** - ASGI server

## 🔧 Configuration

### Environment Variables

Create `frontend/.env` with:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_SIGNALING_HOST=localhost:8000
```

**Note:** MapLibre works without a token using open-source map tiles.

## 🎯 Hackathon Judging Criteria

### Functionality (40%) ✅
- Offline P2P messaging works without internet
- Real-time status updates and location sharing
- Messages persist across app restarts
- Clear, intuitive user interface

### Creativity (30%) ✅
- Unique offline-first disaster communication solution
- Novel use of WebRTC for P2P mesh networking
- Practical emergency status broadcast system

### Execution (20%) ✅
- Clean React architecture with reusable components
- IndexedDB for offline storage
- WebRTC implementation with signaling fallback
- PWA support for mobile installation

### Polish (10%) ✅
- Modern, responsive UI with TailwindCSS
- Smooth animations and transitions
- Proper error handling and loading states
- Complete documentation

## 🐛 Troubleshooting

### Peers Not Connecting
- Ensure both devices are on the same local network
- Check that the signaling server is running
- Verify WebRTC is enabled in browser settings
- Check browser console for errors

### Map Not Loading
- Add a Mapbox token to `.env` OR
- Use MapLibre (already configured as default)
- Check network connectivity for initial tile loading

### Messages Not Persisting
- Check browser IndexedDB storage limits
- Clear browser cache and reload
- Verify IndexedDB is enabled in browser

## 📚 Documentation

- **PRD.md** - Complete product requirements
- **requirements_analysis.md** - Functional requirements and constraints
- **demo_script.md** - 3-minute demo walkthrough
- **docs/** - Additional design docs and UI specifications

## 🤝 Contributing

This is a hackathon project built for EHC OpenHack 2025. Feel free to fork and extend!

## 📜 License

This project was created for educational purposes as part of EHC OpenHack 2025.

## 🏆 Hackathon Submission Checklist

- [x] Fully functional P2P messaging
- [x] Status buttons with location sharing
- [x] Interactive map visualization
- [x] Offline storage (IndexedDB)
- [x] PWA support
- [x] Responsive mobile UI
- [x] Complete documentation
- [x] Demo script prepared
- [ ] Create 3-minute demo video
- [ ] Generate PWA icons
- [ ] Deploy to hosting platform

## 🎉 Acknowledgments

Built for **EHC OpenHack 2025** - Making the world more resilient, one connection at a time.

---

**SafeConnect** - When networks fall, humans connect.