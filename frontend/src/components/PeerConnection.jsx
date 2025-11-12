import React, {useEffect, useRef} from 'react'

// Minimal signaling-backed WebRTC peer connection skeleton.
// This component connects to optional signaling server at ws://localhost:8000/ws/room

export default function PeerConnection({onPeerUpdate, onMessage, registerSender}){
  const wsRef = useRef(null)
  const pcRef = useRef(null)
  const dcRef = useRef(null)
  const sendQueue = useRef([])

  useEffect(()=>{
    const room = 'safeconnect-demo'
    const wsUrl = (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + (import.meta.env.VITE_SIGNALING_HOST || 'localhost:8000') + '/ws/' + room
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = ()=> console.log('signaling connected')
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
      }
    }

    async function ensurePC(){
      if(pcRef.current) return
      const pc = new RTCPeerConnection({iceServers:[{urls:['stun:stun.l.google.com:19302']}]})
      pc.onicecandidate = e=>{ if(e.candidate) ws.send(JSON.stringify({type:'ice', candidate:e.candidate})) }
      pc.ondatachannel = e=>{
        const ch = e.channel
        ch.onmessage = (m)=> onMessage && onMessage(JSON.parse(m.data))
      }

      const dc = pc.createDataChannel('safeconnect')
      dc.onopen = ()=>{
        console.log('datachannel open')
        // flush queued messages
        sendQueue.current.forEach(item=>{
          try{ dc.send(JSON.stringify(item)) }catch(e){ console.warn(e) }
        })
        sendQueue.current = []
      }
      dc.onmessage = (m)=> onMessage && onMessage(JSON.parse(m.data))

      dcRef.current = dc
      // expose a send function to parent
      if(registerSender){
        registerSender((obj)=>{
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
      ws.send(JSON.stringify({type:'offer', offer}))
    }

    // create pc on load (or do it lazy on user action)
    ensurePC()

    return ()=>{ ws.close(); pcRef.current && pcRef.current.close() }
  }, [])

  return (
    <div>
      <p className="text-sm text-gray-600">Peer connection running (signaling optional)</p>
    </div>
  )
}
