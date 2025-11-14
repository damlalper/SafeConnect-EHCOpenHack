import React, {useEffect, useRef} from 'react'
import db from '../lib/db'

// Minimal signaling-backed WebRTC peer connection skeleton.
// This component connects to optional signaling server at ws://localhost:8000/ws/room

export default function PeerConnection({onPeerUpdate, onMessage, registerSender, roomName = 'safeconnect-demo'}){
  const wsRef = useRef(null)
  const pcRef = useRef(null)
  const dcRef = useRef(null)
  const sendQueue = useRef([])
  const reconnectTimerRef = useRef(null)
  const peersRef = useRef(new Map()) // Track connected peers
  const myIdRef = useRef('peer-' + Math.random().toString(36).substr(2, 9))

  // Function to update peers and notify parent
  const updatePeers = async () => {
    const peerArray = Array.from(peersRef.current.values())

    // Save peers to IndexedDB
    for (const peer of peerArray) {
      await db.addPeer(peer)
    }

    // Notify parent component
    if (onPeerUpdate) {
      onPeerUpdate(peerArray)
    }
  }

  useEffect(()=>{
    const room = roomName
    const wsUrl = (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + (import.meta.env.VITE_SIGNALING_HOST || 'localhost:8000') + '/ws/' + room

    const connect = () => {
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = ()=> {
        console.log('signaling connected')
        // Send peer handshake on connection
        ws.send(JSON.stringify({
          type: 'peer_handshake',
          peerId: myIdRef.current,
          displayName: localStorage.getItem('safeconnect_displayName') || myIdRef.current,
          status: 'safe',
          timestamp: Date.now()
        }))
      }

      ws.onclose = () => {
        console.log('signaling disconnected, attempting to reconnect in 3s...')
        // For a more robust solution, consider exponential backoff
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = setTimeout(connect, 3000)
      }

      ws.onerror = (err) => {
        console.error("WebSocket error:", err)
        // onclose will be called next, triggering the reconnect logic
        ws.close()
      }

      ws.onmessage = async (ev)=>{
        const msg = JSON.parse(ev.data)
        if(msg.type === 'offer'){
          await ensurePC()
          await pcRef.current.setRemoteDescription(msg.offer)
          const answer = await pcRef.current.createAnswer()
          await pcRef.current.setLocalDescription(answer)
          ws.send(JSON.stringify({type:'answer', answer}))
        } else if(msg.type === 'answer'){
          await pcRef.current.setRemoteDescription(msg.answer)
        } else if(msg.type === 'ice'){
          try{ await pcRef.current.addIceCandidate(msg.candidate) }catch(e){ console.warn(e) }
        } else if(msg.type === 'peer_info'){
          // Another peer connected
          const peerId = msg.peerId
          const displayName = msg.displayName

          if (peerId && peerId !== myIdRef.current) {
            peersRef.current.set(peerId, {
              id: peerId,
              displayName: displayName,
              status: 'unknown',
              lastSeen: Date.now()
            })
            await updatePeers()
          }
        } else if(msg.type === 'peer_handshake'){
          // Peer handshake via WebSocket
          const peerId = msg.peerId
          const displayName = msg.displayName

          if (peerId && peerId !== myIdRef.current) {
            peersRef.current.set(peerId, {
              id: peerId,
              displayName: displayName,
              status: msg.status || 'unknown',
              lastSeen: Date.now(),
              location: msg.location
            })
            await updatePeers()
          }
        } else if(msg.type === 'message' || msg.type === 'status'){
          // Received message/status from another peer via WebSocket
          if (msg.from && msg.from !== (localStorage.getItem('safeconnect_displayName') || myIdRef.current)) {
            console.log('Received message via WebSocket:', msg)
            if (onMessage) onMessage(msg)
          }
        }
      }
    }


    async function ensurePC(){
      if(pcRef.current) return
      const pc = new RTCPeerConnection({iceServers:[{urls:['stun:stun.l.google.com:19302']}]})
      pc.onicecandidate = e=>{ if(e.candidate) wsRef.current.send(JSON.stringify({type:'ice', candidate:e.candidate})) }
      pc.ondatachannel = e=>{
        const ch = e.channel
        ch.onmessage = async (m)=> {
          const data = JSON.parse(m.data)

          // Handle peer info messages
          if (data.type === 'peer_handshake') {
            const peerId = data.peerId
            const displayName = data.displayName

            if (peerId && peerId !== myIdRef.current) {
              peersRef.current.set(peerId, {
                id: peerId,
                displayName: displayName,
                status: data.status || 'unknown',
                lastSeen: Date.now(),
                location: data.location
              })
              await updatePeers()
            }
          } else {
            // Regular message
            if (onMessage) onMessage(data)
          }
        }
      }

      const dc = pc.createDataChannel('safeconnect')
      dc.onopen = ()=>{
        console.log('datachannel open')

        // Send handshake with our info
        const handshake = {
          type: 'peer_handshake',
          peerId: myIdRef.current,
          displayName: localStorage.getItem('safeconnect_displayName') || myIdRef.current,
          status: 'safe',
          timestamp: Date.now()
        }
        try {
          dc.send(JSON.stringify(handshake))
        } catch(e) {
          console.warn('Failed to send handshake:', e)
        }

        // flush queued messages
        sendQueue.current.forEach(item=>{
          try{ dc.send(JSON.stringify(item)) }catch(e){ console.warn(e) }
        })
        sendQueue.current = []
      }
      dc.onmessage = async (m)=> {
        const data = JSON.parse(m.data)

        // Handle peer info messages
        if (data.type === 'peer_handshake') {
          const peerId = data.peerId
          const displayName = data.displayName

          if (peerId && peerId !== myIdRef.current) {
            peersRef.current.set(peerId, {
              id: peerId,
              displayName: displayName,
              status: data.status || 'unknown',
              lastSeen: Date.now(),
              location: data.location
            })
            await updatePeers()
          }
        } else {
          // Regular message
          if (onMessage) onMessage(data)
        }
      }

      dcRef.current = dc
      // expose a send function to parent
      if(registerSender){
        registerSender((obj)=>{
          // Send via WebSocket for reliability (fallback for P2P)
          if(wsRef.current && wsRef.current.readyState === WebSocket.OPEN){
            try{
              console.log('Sending message via WebSocket:', obj)
              wsRef.current.send(JSON.stringify(obj))
            }catch(e){
              console.warn('WebSocket send failed:', e)
            }
          }

          // Also try DataChannel if available
          if(dcRef.current && dcRef.current.readyState === 'open'){
            try{ dcRef.current.send(JSON.stringify(obj)) }catch(e){ console.warn(e) }
          } else {
            // queue for later
            sendQueue.current.push(obj)
          }
        })
      }
      pcRef.current = pc

      // create offer and send via signaling
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      wsRef.current.send(JSON.stringify({type:'offer', offer}))
    }

    // initial connection
    connect()
    // create pc on load (or do it lazy on user action)
    ensurePC()

    return ()=>{
      clearTimeout(reconnectTimerRef.current)
      if(wsRef.current) wsRef.current.close()
      if(pcRef.current) pcRef.current.close()
    }
  }, [])

  return (
    <div>
      <p className="text-sm text-gray-600">Peer connection running (signaling optional)</p>
    </div>
  )
}
