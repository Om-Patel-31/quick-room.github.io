QuickRoom — local signaling server

This project includes a tiny WebSocket signaling server so friends on different devices can connect and use the realtime features (presence, WebRTC calls).

Run locally:

```bash
# from project root
npm install
npm start
```

By default, the server listens on port 3000. The client (`index.html`) will try to connect to `ws://<host>:3000` automatically when you join a room. If you host the signaling server on another host or port, update the client `wsUrl` variable in `index.html` accordingly.

Notes:
- The server is very small and intended for demo / local use only.
- For a production setup you'd run behind TLS (wss) and add authentication and origin checks.
