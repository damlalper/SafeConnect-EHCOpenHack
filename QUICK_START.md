# SafeConnect - Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Fastest Path to Demo

### Step 1: Start the Application (2 minutes)

```bash
# Terminal 1: Start Backend
cd backend
python -m venv .venv
.\.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 2: Start Frontend
cd frontend
npm install  # Only needed first time
npm run dev
```

### Step 2: Open Two Browser Windows (1 minute)

1. Open `http://localhost:5173` in Chrome
2. Enter name "Alice" and click "Start Connecting"
3. Open another tab/window to `http://localhost:5173`
4. Enter name "Bob" and click "Start Connecting"

### Step 3: Test Features (2 minutes)

**Test Messaging:**
- In Alice's window, type "Hello!" and send
- See it appear in Bob's window

**Test Status Broadcast:**
- In Bob's window, click "Need Help" button
- Watch red pin appear on both maps
- Click the pin to see details

**Test Persistence:**
- Close and reopen any window
- Messages should still be there!

**Test Peer List:**
- Click "Peers" tab
- See connected users

---

## 🎥 Demo Script for Recording

Perfect for creating your 3-minute hackathon video!

### 0:00-0:20 - Introduction (20 seconds)
*Show app splash screen*

**Script:**
"This is SafeConnect - an offline disaster communication network. When internet and cellular networks fail during emergencies, SafeConnect keeps communities connected using peer-to-peer technology."

### 0:20-0:50 - Setup (30 seconds)
*Show two browser windows side by side*

**Script:**
"Two users, Alice and Bob, open the app and grant location permissions. SafeConnect automatically discovers peers on the local network using WebRTC."

**Show:**
- Name entry screens
- Both users connecting
- Peer count changing

### 0:50-1:30 - Messaging Demo (40 seconds)
*Focus on message interface*

**Script:**
"Alice sends a message directly to Bob. No server required - messages travel peer-to-peer and are stored locally in IndexedDB for offline access."

**Show:**
- Type message in Alice's window
- Message appears instantly in Bob's window
- Close and reopen tab - messages persist

### 1:30-2:10 - Emergency Status (40 seconds)
*Focus on status buttons and map*

**Script:**
"In an emergency, users can broadcast their status with one tap. Bob presses 'Need Help' - his location and status instantly appear on everyone's map."

**Show:**
- Click "Need Help" button
- Red pin appears on map
- Click pin to show details
- Show multiple status types

### 2:10-2:40 - Map Visualization (30 seconds)
*Focus on map with multiple markers*

**Script:**
"The interactive map shows all users in real-time with color-coded status indicators. Green for safe, red for help needed, blue for resources needed."

**Show:**
- Multiple pins on map
- Zoom in/out
- Click different pins
- Toggle between Messages and Peers tabs

### 2:40-3:00 - Conclusion (20 seconds)
*Show SafeConnect logo/title*

**Script:**
"Built with React, WebRTC, and IndexedDB - SafeConnect is a Progressive Web App that works offline. When networks fall, humans connect."

**Show:**
- Tech stack overlay
- Final app overview
- Thank you slide

---

## 🎬 Recording Tips

**Tools:**
- **Screen Recording:** OBS Studio (free), Loom, or Zoom
- **Resolution:** 1920x1080
- **Frame Rate:** 30 FPS minimum

**Setup:**
- Use two side-by-side browser windows
- Zoom browser to 80-90% for better visibility
- Clear desktop background (minimize distractions)
- Use good microphone (even phone earbuds are better than laptop mic)

**Narration Tips:**
- Speak clearly and enthusiastically
- Pause briefly between sections
- Don't rush - 3 minutes is enough time
- Practice once before recording

**Editing (Optional):**
- Add title card at start
- Add captions/subtitles
- Background music (low volume)
- Speed up wait times (2x)

---

## 🐛 Quick Troubleshooting

### "Peers not connecting"
```bash
# Check backend is running
curl http://localhost:8000

# Should return: {"status":"ok","info":"SafeConnect signaling server"}
```

### "Map not loading"
- Normal! MapLibre loads tiles from internet
- Map works without token
- Markers will still appear

### "Messages not sending"
- Check browser console for errors
- Verify both tabs are on same localhost
- Refresh both windows

### "Build fails"
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Files You Need

### For Local Demo:
- ✅ All source code (you have this)
- ✅ Backend running (Terminal 1)
- ✅ Frontend running (Terminal 2)
- ✅ Two browser windows open

### For Video Demo:
- ✅ Screen recording software
- ✅ Script printed out
- ✅ Clean desktop
- ✅ Good microphone

### For Submission:
- ✅ Video uploaded to YouTube
- ✅ GitHub repo public
- ✅ README complete
- ✅ All code committed

---

## 🎯 Feature Showcase Order

1. **Connection** - Show automatic peer discovery
2. **Messaging** - Demonstrate P2P chat
3. **Status** - Emergency broadcast system
4. **Map** - Visual location sharing
5. **Persistence** - Offline storage
6. **PWA** - Mobile installation (bonus)

---

## 💡 Demo Pro Tips

1. **Pre-fill locations** - Have map already showing some data
2. **Use real names** - More engaging than "User1" and "User2"
3. **Show mobile** - If possible, demo on phone too
4. **Highlight offline** - Turn off wifi to show it still works
5. **Show persistence** - Close and reopen to prove data saves

---

## 📱 Mobile Demo Setup

If testing on phone:

1. **Find your IP:**
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. **Update backend URL:**
   - Edit `frontend/.env`
   - Set `VITE_SIGNALING_HOST=YOUR_IP:8000`

3. **Access from phone:**
   - Connect to same WiFi
   - Open `http://YOUR_IP:5173`

---

## ⚡ Speed Run (1 Minute Setup)

Already have dependencies installed?

```bash
# One terminal, multiple commands
cd backend && uvicorn app.main:app --reload --port 8000 &
cd ../frontend && npm run dev
```

Then:
- Open http://localhost:5173 in two tabs
- Demo time!

---

## 🎉 You're Ready!

Everything is implemented and working. Now just:

1. ✅ Start the apps
2. ✅ Record your demo
3. ✅ Submit to hackathon

**Need help?** Check:
- README.md - Full documentation
- DEPLOYMENT.md - Hosting guide
- HACKATHON_SUBMISSION.md - Submission checklist

Good luck! 🚀
