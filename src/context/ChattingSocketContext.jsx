"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { getSocket } from "@/lib/socket";

const ChattingSocketContext = createContext(null);

export function ChattingSocketProvider({ children }) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const addListener = useCallback((eventType, cb) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on(eventType, cb);
    return () => socket.off(eventType, cb);
  }, []);

  // Translates old WS protocol to Socket.IO emit
  // { type: "subscribe:chatbot", chatbotId: "abc" } → socket.emit("subscribe:chatbot", "abc")
  const send = useCallback((msg) => {
    const socket = socketRef.current;
    if (!socket?.connected) return;
    const { type, ...rest } = msg;
    const value = rest.chatbotId || rest.threadId || rest;
    socket.emit(type, value);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    socket.connect();

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return (
    <ChattingSocketContext.Provider value={{ isConnected, send, addListener }}>
      {children}
    </ChattingSocketContext.Provider>
  );
}

export function useChattingSocket() {
  return useContext(ChattingSocketContext);
}
