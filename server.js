const WebSocket = require('ws');
const port = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port });

// rooms: roomId -> Map(clientId -> ws)
const rooms = new Map();

console.log('Signaling server listening on port', port);

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data); } catch (e) { return; }
    if(!msg || !msg.room) return;
    const room = msg.room;
    if(!rooms.has(room)) rooms.set(room, new Map());
    const roomMap = rooms.get(room);

    // remember which clientId belongs to this socket if provided
    if(msg.from) {
      roomMap.set(msg.from, ws);
      ws._clientId = msg.from;
      ws._room = room;
    }

    // deliver message
    if(msg.to){
      // direct message to a client id
      const target = roomMap.get(msg.to);
      if(target && target.readyState === WebSocket.OPEN){
        try{ target.send(JSON.stringify(msg)); }catch(e){}
      }
    } else {
      // broadcast to all in room except sender
      for(const [id, client] of roomMap.entries()){
        if(client.readyState !== WebSocket.OPEN) continue;
        if(msg.from && id === msg.from) continue;
        try{ client.send(JSON.stringify(msg)); }catch(e){}
      }
    }
  });

  ws.on('close', () => {
    // remove from its room
    const room = ws._room;
    const id = ws._clientId;
    if(room && rooms.has(room)){
      const roomMap = rooms.get(room);
      if(id) roomMap.delete(id);
      if(roomMap.size === 0) rooms.delete(room);
    }
  });
});
