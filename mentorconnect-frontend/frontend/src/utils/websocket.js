import { store } from "../store/store";
import { setConnected } from "../store/chatSlice";

let _stompClient = null;

export const wsClient = {
  async connect(token) {
    const { Client }       = await import("@stomp/stompjs");
    const { default: SockJS } = await import("sockjs-client");
    const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

    _stompClient = new Client({
      webSocketFactory: () => new SockJS(`${BASE}/ws`),
      connectHeaders:   { Authorization: `Bearer ${token}` },
      reconnectDelay:   5000,
      onConnect:    () => store.dispatch(setConnected(true)),
      onDisconnect: () => store.dispatch(setConnected(false)),
    });
    _stompClient.activate();
    return _stompClient;
  },

  subscribe(destination, callback) {
    if (!_stompClient?.connected) return null;
    return _stompClient.subscribe(destination, (frame) => {
      try { callback(JSON.parse(frame.body)); } catch { callback(frame.body); }
    });
  },

  send(destination, body) {
    if (!_stompClient?.connected) return;
    _stompClient.publish({ destination, body: JSON.stringify(body) });
  },

  disconnect() {
    _stompClient?.deactivate();
    _stompClient = null;
  },
};
