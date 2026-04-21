

import React, { useEffect, useState, useRef } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SwitchVideoIcon from "@mui/icons-material/SwitchVideo";
import { useNavigate } from "react-router";
import { socket } from "../../socket";

function ChatWindow() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("searching");
  const [disconnected, setDisconnected] = useState(false);
  const [typing, setTyping] = useState(false);

  const navigate = useNavigate();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = socket;

   
    socketRef.current.emit("start-searching", { mode: "text" });

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, { sender: "other", text: data }]);
    };

    const handleDisconnect = () => {
      setDisconnected(true);
      setStatus("disconnected");
      setMessages([]);
    };

    const handleStart = ({ initiator }) => {
      setStatus("connected");
      setDisconnected(false);
    };

    const handleTyping = () => {
      setTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTyping(false), 1500);
    };

    socketRef.current.on("message-receive", handleMessage);
    socketRef.current.on("stranger-disconnected", handleDisconnect);
    socketRef.current.on("chat-start", handleStart);
    socketRef.current.on("typing", handleTyping);

    return () => {
      socketRef.current.off("message-receive", handleMessage);
      socketRef.current.off("stranger-disconnected", handleDisconnect);
      socketRef.current.off("chat-start", handleStart);
      socketRef.current.off("typing", handleTyping);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  const skippingUser = () => {
    setMessages([]);
    socketRef.current.emit("next-stranger");
    setDisconnected(true);
    setStatus("disconnected");
  };

  const findNewStranger = () => {
    setMessages([]);
    setDisconnected(false);
    setStatus("searching");

    socketRef.current.emit("next-stranger");

    setTimeout(() => {
      
      socketRef.current.emit("start-searching", { mode: "text" });
    }, 300);
  };

  const changeFunction = (event) => {
    setInputText(event.target.value);
    if (status === "connected") {
      socketRef.current.emit("typing");
    }
  };

  const submitFunc = () => {
    if (!inputText.trim() || status !== "connected") return;
    setMessages((prev) => [...prev, { sender: "me", text: inputText }]);
    socketRef.current.emit("chat-message", inputText);
    setInputText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") submitFunc();
  };

  return (
    <div className="back h-screen flex flex-col bg-zinc-900">

      
      <div className="flex justify-between text-white h-14 items-center text-xl border-b border-gray-500 px-3 shrink-0">
        <button onClick={() => navigate("/main")}>
          <span className="flex items-center gap-1 hover:text-gray-300 transition">
            <ArrowBackIcon fontSize="medium" />
            Back
          </span>
        </button>

        <h2 className="flex items-center gap-2 text-base font-medium">
          {status === "connected" && (
            <>
              Chatting
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_6px_#22c55e]" />
            </>
          )}
          {status === "searching" && (
            <>
              Finding stranger...
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
            </>
          )}
          {status === "disconnected" && (
            <>
              Disconnected
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
            </>
          )}
        </h2>

        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => navigate("/video")}
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <SwitchVideoIcon fontSize="small" />
            Video
          </button>
          <button onClick={skippingUser} className="hover:text-red-400 transition">
            Skip
          </button>
        </div>
      </div>

   
      {disconnected && (
        <div className="flex justify-center pt-6 shrink-0">
          <div className="bg-zinc-800 border border-zinc-600 text-white px-6 py-4 rounded-2xl text-center shadow-lg">
            <p className="mb-1 text-red-400 font-semibold">Stranger disconnected</p>
            <p className="text-zinc-400 text-sm mb-3">Ready to meet someone new?</p>
            <button
              onClick={findNewStranger}
              className="bg-blue-500 px-5 py-1.5 rounded-full text-sm hover:bg-blue-600 transition font-medium"
            >
              Find New Stranger
            </button>
          </div>
        </div>
      )}

     
      {status === "searching" && !disconnected && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Looking for a stranger...</p>
        </div>
      )}

  
      {status !== "searching" && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {messages.length === 0 && status === "connected" && (
            <p className="text-zinc-500 text-sm text-center mt-6">Say hello 👋</p>
          )}
          {messages.map((el, index) => (
            <div
              key={index}
              className={`max-w-[60%] px-4 py-2 rounded-2xl text-sm break-words ${
                el.sender === "me"
                  ? "self-end bg-blue-500 text-white rounded-br-sm"
                  : "self-start bg-zinc-700 text-white rounded-bl-sm"
              }`}
            >
              {el.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      
      {typing && (
        <div className="px-4 pb-2 text-gray-400 text-sm flex items-center gap-2 shrink-0">
          <span>Stranger is typing</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

  
      <div className="w-full bg-zinc-800 p-3 flex items-center gap-2 border-t border-white/10 shrink-0">
        <input
          type="text"
          placeholder={status === "connected" ? "Type a message..." : "Waiting for match..."}
          className="flex-1 bg-zinc-700 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 transition"
          value={inputText}
          onChange={changeFunction}
          onKeyDown={handleKeyPress}
          disabled={status !== "connected"}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-40 transition"
          onClick={submitFunc}
          disabled={status !== "connected" || !inputText.trim()}
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default ChatWindow;

