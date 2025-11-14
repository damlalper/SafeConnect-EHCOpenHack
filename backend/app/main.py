from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        # rooms -> list of websockets
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()
        if room not in self.rooms:
            self.rooms[room] = []
        self.rooms[room].append(websocket)

    def disconnect(self, websocket: WebSocket, room: str):
        if room in self.rooms and websocket in self.rooms[room]:
            self.rooms[room].remove(websocket)

    async def broadcast(self, room: str, message: str, sender: WebSocket = None):
        if room not in self.rooms:
            return
        for connection in list(self.rooms[room]):
            # Don't send message back to sender
            if sender and connection == sender:
                continue
            try:
                await connection.send_text(message)
            except Exception:
                # ignore send errors per connection
                pass

manager = ConnectionManager()

@app.websocket('/ws/{room}')
async def websocket_endpoint(websocket: WebSocket, room: str):
    await manager.connect(websocket, room)
    print(f"✓ New connection to room '{room}'. Total connections: {len(manager.rooms.get(room, []))}")
    try:
        while True:
            data = await websocket.receive_text()

            # Log message type for debugging
            try:
                import json
                msg = json.loads(data)
                print(f"📨 Message in room '{room}': type={msg.get('type', 'unknown')}, from={msg.get('from', msg.get('displayName', 'unknown'))}")
            except:
                pass

            # broadcast received signaling messages to other peers in the room
            await manager.broadcast(room, data, sender=websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room)
        print(f"✗ Connection disconnected from room '{room}'. Remaining: {len(manager.rooms.get(room, []))}")

@app.get('/')
async def root():
    return {"status":"ok", "info":"SafeConnect signaling server"}
