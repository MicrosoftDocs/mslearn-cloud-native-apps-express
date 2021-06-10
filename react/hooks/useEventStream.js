import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_EVENT_MESSAGE_ID = "newEvent";

export const useEventStream = (socketServerUrl) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(socketServerUrl, {
      query: { roomId: generateRoomId() },
    });

    socketRef.current.on(NEW_EVENT_MESSAGE_ID, (message) => {
      setMessages((messages) => [message, ...messages]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return { messages };
};

function generateRoomId(length) {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}
