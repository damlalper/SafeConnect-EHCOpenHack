import { openDB } from 'idb'

const DB_NAME = 'safeconnect-db'
const DB_VERSION = 1

let dbPromise

export function initDB(){
  if(!dbPromise){
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db){
        if(!db.objectStoreNames.contains('messages')){
          db.createObjectStore('messages', { keyPath: 'id' })
        }
        if(!db.objectStoreNames.contains('peers')){
          db.createObjectStore('peers', { keyPath: 'id' })
        }
        if(!db.objectStoreNames.contains('statuses')){
          db.createObjectStore('statuses', { keyPath: 'id' })
        }
      }
    })
  }
  return dbPromise
}

export async function addMessage(msg){
  const db = await initDB()
  await db.put('messages', msg)
}

export async function getMessages(){
  const db = await initDB()
  return await db.getAll('messages')
}

export async function addPeer(peer){
  const db = await initDB()
  await db.put('peers', peer)
}

export async function getPeers(){
  const db = await initDB()
  return await db.getAll('peers')
}

export async function addStatus(ev){
  const db = await initDB()
  await db.put('statuses', ev)
}

export async function clearAll(){
  const db = await initDB()
  await Promise.all([
    db.clear('messages'),
    db.clear('peers'),
    db.clear('statuses')
  ])
}

export default { initDB, addMessage, getMessages, addPeer, getPeers, addStatus, clearAll }
