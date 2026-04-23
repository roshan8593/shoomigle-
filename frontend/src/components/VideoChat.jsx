
// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router";
// import { socket } from "../../socket";

// function VideoChat() {
//   const navigate = useNavigate();

//   const selfVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   const peerRef = useRef(null);
//   const streamRef = useRef(null);
//   const socketRef = useRef(socket);
//   const pendingCandidates = useRef([]);
//   const readyRef = useRef(false);

//   const [status, setStatus] = useState("searching");
//   const [disconnected, setDisconnected] = useState(false);
//   const [muted, setMuted] = useState(false);

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [typing, setTyping] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);
//   const messagesEndRef = useRef(null);
//   const typingTimeout = useRef(null);


//   useEffect(() => {
    
//     socketRef.current.removeAllListeners();

//     const start = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });

//         streamRef.current = stream;
//         if (selfVideoRef.current) {
//           selfVideoRef.current.srcObject = stream;
//         }
//         readyRef.current = true;

//         socketRef.current.emit("start-searching", { mode: "video" });
//       } catch (err) {
//         console.error("Camera error:", err);
//       }
//     };

//     start();

    
//     return () => {
//       socketRef.current.removeAllListeners();
//       cleanup();
//       stopCamera();
//     };
//   }, []);

  
//   useEffect(() => {
//     if (chatOpen) {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages, chatOpen]);

//   // 🔗 CREATE PEER
//   const createPeer = () => {
//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     streamRef.current.getTracks().forEach((track) => {
//       peer.addTrack(track, streamRef.current);
//     });

//     peer.ontrack = (e) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = e.streams[0];
//       }
//     };

//     peer.onicecandidate = (e) => {
//       if (e.candidate) {
//         socketRef.current.emit("ice-candidate", e.candidate);
//       }
//     };

//     return peer;
//   };

//   const createOffer = async () => {
//     const offer = await peerRef.current.createOffer();
//     await peerRef.current.setLocalDescription(offer);
//     socketRef.current.emit("offer", offer);
//   };


//   useEffect(() => {
//     const sock = socketRef.current;

//     const handleChatStart = ({ initiator }) => {
//       if (!readyRef.current) return;
//       setStatus("connected");
//       setDisconnected(false);
//       setMessages([]);
//       peerRef.current = createPeer();
//       if (initiator) createOffer();
//     };

//     const handleOffer = async (offer) => {
//       const peer = peerRef.current;
//       if (!peer) return;
//       await peer.setRemoteDescription(offer);
//       const answer = await peer.createAnswer();
//       await peer.setLocalDescription(answer);
//       sock.emit("answer", answer);
//       pendingCandidates.current.forEach((c) => peer.addIceCandidate(c));
//       pendingCandidates.current = [];
//     };

//     const handleAnswer = async (answer) => {
//       if (peerRef.current) {
//         await peerRef.current.setRemoteDescription(answer);
//       }
//     };

//     const handleIceCandidate = async (c) => {
//       const peer = peerRef.current;
//       if (peer && peer.remoteDescription) {
//         await peer.addIceCandidate(c);
//       } else {
//         pendingCandidates.current.push(c);
//       }
//     };

//     const handleStrangerDisconnected = () => {
//       cleanup();
//       setDisconnected(true);
//       setStatus("disconnected");
//       setMessages([]);
//     };

   
//     const handleMessageReceive = (msg) => {
//       setMessages((prev) => [...prev, { sender: "other", text: msg }]);
//     };

//     const handleTyping = () => {
//       setTyping(true);
//       if (typingTimeout.current) clearTimeout(typingTimeout.current);
//       typingTimeout.current = setTimeout(() => setTyping(false), 1500);
//     };

//     sock.on("chat-start", handleChatStart);
//     sock.on("offer", handleOffer);
//     sock.on("answer", handleAnswer);
//     sock.on("ice-candidate", handleIceCandidate);
//     sock.on("stranger-disconnected", handleStrangerDisconnected);
//     sock.on("message-receive", handleMessageReceive);
//     sock.on("typing", handleTyping);

//     return () => {
//       sock.off("chat-start", handleChatStart);
//       sock.off("offer", handleOffer);
//       sock.off("answer", handleAnswer);
//       sock.off("ice-candidate", handleIceCandidate);
//       sock.off("stranger-disconnected", handleStrangerDisconnected);
//       sock.off("message-receive", handleMessageReceive);
//       sock.off("typing", handleTyping);
//       if (typingTimeout.current) clearTimeout(typingTimeout.current);
//     };
//   }, []);


//   const cleanup = () => {
//     if (peerRef.current) {
//       peerRef.current.ontrack = null;
//       peerRef.current.onicecandidate = null;
//       peerRef.current.close();
//       peerRef.current = null;
//     }
//     pendingCandidates.current = [];
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }
//   };


//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     if (selfVideoRef.current) {
//       selfVideoRef.current.srcObject = null;
//     }
//   };


//   const findNewStranger = () => {
//     cleanup();
//     setMessages([]);
//     setDisconnected(false);
//     setStatus("searching");
//     socketRef.current.emit("next-stranger");
//     setTimeout(() => {
//       socketRef.current.emit("start-searching", { mode: "video" });
//     }, 300);
//   };


//   const skipUser = () => {
//     cleanup();
//     setMessages([]);
//     socketRef.current.emit("next-stranger");
//     setDisconnected(true);
//     setStatus("disconnected");
//   };


//   const sendMessage = () => {
//     if (!input.trim() || status !== "connected") return;
//     setMessages((prev) => [...prev, { sender: "me", text: input }]);
//     socketRef.current.emit("chat-message", input);
//     setInput("");
//   };

//   const handleTypingInput = (e) => {
//     setInput(e.target.value);
//     if (status === "connected") {
//       socketRef.current.emit("typing");
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };


//   const toggleMute = () => {
//     if (!streamRef.current) return;
//     streamRef.current.getAudioTracks().forEach((t) => {
//       t.enabled = !t.enabled;
//     });
//     setMuted((p) => !p);
//   };


//   const shareScreen = async () => {
//     try {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//       });
//       const screenTrack = screenStream.getTracks()[0];
//       const sender = peerRef.current
//         ?.getSenders()
//         .find((s) => s.track?.kind === "video");

//       if (sender) {
//         sender.replaceTrack(screenTrack);
//         screenTrack.onended = () => {
//           const camTrack = streamRef.current?.getVideoTracks()[0];
//           if (camTrack) sender.replaceTrack(camTrack);
//         };
//       }
//     } catch (err) {
//       console.error("Screen share error:", err);
//     }
//   };

//   function addFriend() {
//     console.log("add friend");
//   }

//   return (
//     <div className="h-screen bg-black text-white relative overflow-hidden">

     
//       <div className="absolute top-0 w-full flex justify-between items-center p-4 z-10 bg-gradient-to-b from-black/60 to-transparent">
//         <button
//           onClick={() => {
//             cleanup();
//             stopCamera();
//             socketRef.current.emit("next-stranger");
//             navigate(-1);
//           }}
//           className="flex items-center gap-1 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
//         >
//           ← Back
//         </button>

//         <div className="flex items-center gap-2 text-sm bg-black/40 px-3 py-1.5 rounded-full">
//           <span
//             className={`w-2 h-2 rounded-full ${
//               status === "connected" ? "bg-green-400" : "bg-yellow-400"
//             }`}
//           />
//           {status === "connected"
//             ? "Connected"
//             : status === "disconnected"
//             ? "Disconnected"
//             : "Finding stranger..."}
//         </div>
//       </div>

     
//       {disconnected && (
//         <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
//           <div className="bg-zinc-900 border border-zinc-700 px-8 py-6 rounded-2xl text-center shadow-2xl">
//             <div className="text-3xl mb-3">👋</div>
//             <p className="text-white font-semibold text-lg mb-1">
//               Stranger disconnected
//             </p>
//             <p className="text-zinc-400 text-sm mb-5">
//               Ready to meet someone new?
//             </p>
//             <button
//               onClick={findNewStranger}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium transition"
//             >
//               Find New Stranger
//             </button>
//           </div>
//         </div>
//       )}

     
//       <video
//         ref={remoteVideoRef}
//         autoPlay
//         playsInline
//         className="w-full h-full object-cover"
//       />

      
//       {status !== "connected" && !disconnected && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 z-10">
//           <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
//           <p className="text-zinc-300 text-sm">Looking for a stranger...</p>
//         </div>
//       )}

      
//       <video
//         ref={selfVideoRef}
//         autoPlay
//         muted
//         playsInline
//         className="absolute bottom-24 right-4 w-36 h-28 object-cover rounded-xl border border-white/20 z-10 shadow-lg"
//       />

      
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/70 backdrop-blur-sm px-5 py-3 rounded-2xl z-10 border border-white/10">

//         <button
//           onClick={skipUser}
//           title="Skip"
//           className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-lg"
//         >
//           ⏭
//         </button>

//         <button
//           onClick={toggleMute}
//           title={muted ? "Unmute" : "Mute"}
//           className={`w-10 h-10 flex items-center justify-center rounded-full transition text-lg ${
//             muted ? "bg-red-500/80 hover:bg-red-500" : "bg-white/10 hover:bg-white/20"
//           }`}
//         >
//           {muted ? "🔇" : "🎤"}
//         </button>

//         <button
//           onClick={() => setChatOpen((p) => !p)}
//           title="Chat"
//           className={`w-10 h-10 flex items-center justify-center rounded-full transition text-lg relative ${
//             chatOpen ? "bg-blue-500/80 hover:bg-blue-500" : "bg-white/10 hover:bg-white/20"
//           }`}
//         >
//           💬
//           {!chatOpen && messages.some((m) => m.sender === "other") && (
//             <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black" />
//           )}
//         </button>

//         <button
//           onClick={shareScreen}
//           title="Share screen"
//           disabled={status !== "connected"}
//           className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-lg disabled:opacity-30 disabled:cursor-not-allowed"
//         >
//           🖥
//         </button>

//         <button
//           onClick={addFriend}
//           title="Add friend"
//           disabled={status !== "connected"}
//           className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-lg disabled:opacity-30 disabled:cursor-not-allowed"
//         >
//           <i className="fa-solid fa-user-group"></i>
//         </button>
//       </div>


//       <div
//         className={`absolute top-0 right-0 h-full w-80 bg-zinc-900/95 backdrop-blur-sm border-l border-white/10 flex flex-col z-20 transition-transform duration-300 ease-in-out ${
//           chatOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
       
//         <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
//           <span className="font-medium text-sm">Chat</span>
//           <div className="flex items-center gap-2">
//             {status !== "connected" && (
//               <span className="text-xs text-yellow-400">Waiting for match</span>
//             )}
//             <button
//               onClick={() => setChatOpen(false)}
//               className="text-zinc-400 hover:text-white transition text-lg leading-none"
//             >
//               ✕
//             </button>
//           </div>
//         </div>


//         <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
//           {messages.length === 0 && (
//             <p className="text-zinc-500 text-xs text-center mt-6">Say hello 👋</p>
//           )}
//           {messages.map((m, i) => (
//             <div
//               key={i}
//               className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm break-words ${
//                 m.sender === "me"
//                   ? "bg-blue-500 self-end rounded-br-sm text-white"
//                   : "bg-zinc-700 self-start rounded-bl-sm text-white"
//               }`}
//             >
//               {m.text}
//             </div>
//           ))}

//           {typing && (
//             <div className="self-start flex items-center gap-1 px-3 py-2 bg-zinc-700 rounded-2xl rounded-bl-sm">
//               <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
//               <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
//               <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

   
//         <div className="flex items-center gap-2 p-3 border-t border-white/10">
//           <input
//             value={input}
//             onChange={handleTypingInput}
//             onKeyDown={handleKeyDown}
//             placeholder={status === "connected" ? "Type a message..." : "Not connected"}
//             disabled={status !== "connected"}
//             className="flex-1 bg-zinc-800 text-sm text-white placeholder-zinc-500 px-3 py-2 rounded-full outline-none border border-transparent focus:border-blue-500 disabled:opacity-40 transition"
//           />
//           <button
//             onClick={sendMessage}
//             disabled={!input.trim() || status !== "connected"}
//             className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
//           >
//             ➤
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// }

// export default VideoChat;


import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { socket } from "../../socket";

function VideoChat() {
  const navigate = useNavigate();

  const selfVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(socket);
  const pendingCandidates = useRef([]);
  const readyRef = useRef(false);

  const [status, setStatus] = useState("searching");
  const [disconnected, setDisconnected] = useState(false);
  const [muted, setMuted] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    socketRef.current.removeAllListeners();

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        if (selfVideoRef.current) {
          selfVideoRef.current.srcObject = stream;
        }
        readyRef.current = true;

        socketRef.current.emit("start-searching", { mode: "video" });
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    start();

    return () => {
      socketRef.current.removeAllListeners();
      cleanup();
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (chatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatOpen]);

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443?transport=tcp",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    });

    streamRef.current.getTracks().forEach((track) => {
      peer.addTrack(track, streamRef.current);
    });

    peer.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("ice-candidate", e.candidate);
      }
    };

    return peer;
  };

  const createOffer = async () => {
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    socketRef.current.emit("offer", offer);
  };

  useEffect(() => {
    const sock = socketRef.current;

    const handleChatStart = ({ initiator }) => {
      if (!readyRef.current) return;
      setStatus("connected");
      setDisconnected(false);
      setMessages([]);
      peerRef.current = createPeer();
      if (initiator) createOffer();
    };

    const handleOffer = async (offer) => {
      const peer = peerRef.current;
      if (!peer) return;
      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      sock.emit("answer", answer);
      pendingCandidates.current.forEach((c) => peer.addIceCandidate(c));
      pendingCandidates.current = [];
    };

    const handleAnswer = async (answer) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(answer);
      }
    };

    const handleIceCandidate = async (c) => {
      const peer = peerRef.current;
      if (peer && peer.remoteDescription) {
        await peer.addIceCandidate(c);
      } else {
        pendingCandidates.current.push(c);
      }
    };

    const handleStrangerDisconnected = () => {
      cleanup();
      setDisconnected(true);
      setStatus("disconnected");
      setMessages([]);
    };

    const handleMessageReceive = (msg) => {
      setMessages((prev) => [...prev, { sender: "other", text: msg }]);
    };

    const handleTyping = () => {
      setTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTyping(false), 1500);
    };

    sock.on("chat-start", handleChatStart);
    sock.on("offer", handleOffer);
    sock.on("answer", handleAnswer);
    sock.on("ice-candidate", handleIceCandidate);
    sock.on("stranger-disconnected", handleStrangerDisconnected);
    sock.on("message-receive", handleMessageReceive);
    sock.on("typing", handleTyping);

    return () => {
      sock.off("chat-start", handleChatStart);
      sock.off("offer", handleOffer);
      sock.off("answer", handleAnswer);
      sock.off("ice-candidate", handleIceCandidate);
      sock.off("stranger-disconnected", handleStrangerDisconnected);
      sock.off("message-receive", handleMessageReceive);
      sock.off("typing", handleTyping);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  const cleanup = () => {
    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onicecandidate = null;
      peerRef.current.close();
      peerRef.current = null;
    }
    pendingCandidates.current = [];
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (selfVideoRef.current) {
      selfVideoRef.current.srcObject = null;
    }
  };

  const findNewStranger = () => {
    cleanup();
    setMessages([]);
    setDisconnected(false);
    setStatus("searching");
    socketRef.current.emit("next-stranger");
    setTimeout(() => {
      socketRef.current.emit("start-searching", { mode: "video" });
    }, 300);
  };

  const skipUser = () => {
    cleanup();
    setMessages([]);
    socketRef.current.emit("next-stranger");
    setDisconnected(true);
    setStatus("disconnected");
  };

  const sendMessage = () => {
    if (!input.trim() || status !== "connected") return;
    setMessages((prev) => [...prev, { sender: "me", text: input }]);
    socketRef.current.emit("chat-message", input);
    setInput("");
  };

  const handleTypingInput = (e) => {
    setInput(e.target.value);
    if (status === "connected") {
      socketRef.current.emit("typing");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const toggleMute = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setMuted((p) => !p);
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getTracks()[0];
      const sender = peerRef.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");

      if (sender) {
        sender.replaceTrack(screenTrack);
        screenTrack.onended = () => {
          const camTrack = streamRef.current?.getVideoTracks()[0];
          if (camTrack) sender.replaceTrack(camTrack);
        };
      }
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  function addFriend() {
    console.log("add friend");
  }

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 w-full flex justify-between items-center p-4 z-10 bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={() => {
            cleanup();
            stopCamera();
            socketRef.current.emit("next-stranger");
            navigate(-1);
          }}
          className="flex items-center gap-1 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2 text-sm bg-black/40 px-3 py-1.5 rounded-full">
          <span
            className={`w-2 h-2 rounded-full ${
              status === "connected" ? "bg-green-400" : "bg-yellow-400"
            }`}
          />
          {status === "connected"
            ? "Connected"
            : status === "disconnected"
            ? "Disconnected"
            : "Finding stranger..."}
        </div>
      </div>

      {disconnected && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
          <div className="bg-zinc-900 border border-zinc-700 px-8 py-6 rounded-2xl text-center shadow-2xl">
            <div className="text-3xl mb-3">👋</div>
            <p className="text-white font-semibold text-lg mb-1">
              Stranger disconnected
            </p>
            <p className="text-zinc-400 text-sm mb-5">
              Ready to meet someone new?
            </p>
            <button
              onClick={findNewStranger}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium transition"
            >
              Find New Stranger
            </button>
          </div>
        </div>
      )}

      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {status !== "connected" && !disconnected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 z-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-300 text-sm">Looking for a stranger...</p>
        </div>
      )}

      <video
        ref={selfVideoRef}
        autoPlay
        muted
        playsInline
        className="absolute bottom-24 right-4 w-36 h-28 object-cover rounded-xl border border-white/20 z-10 shadow-lg"
      />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/70 backdrop-blur-sm px-5 py-3 rounded-2xl z-10 border border-white/10">
        <button
          onClick={skipUser}
          title="Skip"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-lg"
        >
          ⏭
        </button>

        <button
          onClick={toggleMute}
          title={muted ? "Unmute" : "Mute"}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition text-lg ${
            muted ? "bg-red-500/80 hover:bg-red-500" : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {muted ? "🔇" : "🎤"}
        </button>

        <button
          onClick={() => setChatOpen((p) => !p)}
          title="Chat"
          className={`w-10 h-10 flex items-center justify-center rounded-full transition text-lg relative ${
            chatOpen ? "bg-blue-500/80 hover:bg-blue-500" : "bg-white/10 hover:bg-white/20"
          }`}
        >
          💬
          {!chatOpen && messages.some((m) => m.sender === "other") && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black" />
          )}
        </button>

        <button
          onClick={shareScreen}
          title="Share screen"
          disabled={status !== "connected"}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-lg disabled:opacity-30 disabled:cursor-not-allowed"
        >
          🖥
        </button>

        <button
          onClick={addFriend}
          title="Add friend"
          disabled={status !== "connected"}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-lg disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-user-group"></i>
        </button>
      </div>

      <div
        className={`absolute top-0 right-0 h-full w-80 bg-zinc-900/95 backdrop-blur-sm border-l border-white/10 flex flex-col z-20 transition-transform duration-300 ease-in-out ${
          chatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="font-medium text-sm">Chat</span>
          <div className="flex items-center gap-2">
            {status !== "connected" && (
              <span className="text-xs text-yellow-400">Waiting for match</span>
            )}
            <button
              onClick={() => setChatOpen(false)}
              className="text-zinc-400 hover:text-white transition text-lg leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {messages.length === 0 && (
            <p className="text-zinc-500 text-xs text-center mt-6">Say hello 👋</p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm break-words ${
                m.sender === "me"
                  ? "bg-blue-500 self-end rounded-br-sm text-white"
                  : "bg-zinc-700 self-start rounded-bl-sm text-white"
              }`}
            >
              {m.text}
            </div>
          ))}

          {typing && (
            <div className="self-start flex items-center gap-1 px-3 py-2 bg-zinc-700 rounded-2xl rounded-bl-sm">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2 p-3 border-t border-white/10">
          <input
            value={input}
            onChange={handleTypingInput}
            onKeyDown={handleKeyDown}
            placeholder={status === "connected" ? "Type a message..." : "Not connected"}
            disabled={status !== "connected"}
            className="flex-1 bg-zinc-800 text-sm text-white placeholder-zinc-500 px-3 py-2 rounded-full outline-none border border-transparent focus:border-blue-500 disabled:opacity-40 transition"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || status !== "connected"}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoChat;
