import { useNavigate } from "react-router";
import React, { useState } from "react";
import SetSlider from "./setSlider";

function Mainpage() {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div className="min-h-screen back text-white flex flex-col">

     
      <nav className="flex justify-between items-center px-4 sm:px-8 lg:px-12 py-4 sm:py-6 border-b border-white/10">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Shoomigle
        </h1>

        <div className="flex gap-3 sm:gap-6 text-sm sm:text-base">
          <button
            onClick={() => navigate("/chat")}
            className="hover:text-blue-400 transition"
          >
            Text Chat
          </button>

          <button
            onClick={() => navigate("/video")}
            className="hover:text-red-400 transition"
          >
            Video Chat
          </button>

         
          <button
            onClick={() => setOpenProfile(true)}
            className="hover:text-yellow-400 transition"
          >
            Profile
          </button>
        </div>
      </nav>

      
      <SetSlider openProfile={openProfile} setOpenProfile={setOpenProfile} />

     
      <div className="flex flex-col items-center justify-center text-center flex-1 px-4 sm:px-8">

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
          Meet New People
        </h1>

        <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-md sm:max-w-xl mb-6 sm:mb-10">
          Shoomigle connects you instantly with strangers around the world.
          Start chatting anonymously with text or video.
        </p>

        <button
          onClick={() => navigate("/chat")}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 rounded-xl text-sm sm:text-lg hover:bg-blue-600 transition shadow-lg"
        >
          Start Chatting
        </button>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-10 lg:px-20 pb-12 sm:pb-20">

        
        <div
          onClick={() => navigate("/chat")}
          className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 hover:scale-105 hover:bg-white/15 transition"
        >
          <h2 className="text-2xl sm:text-3xl mb-3 sm:mb-4">
            💬 Text Chat
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Talk with strangers anonymously using text messages.
          </p>
        </div>

        
        <div
          onClick={() => navigate("/video")}
          className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 hover:scale-105 hover:bg-white/15 transition"
        >
          <h2 className="text-2xl sm:text-3xl mb-3 sm:mb-4">
            🎥 Video Chat
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Connect face-to-face with random people worldwide.
          </p>
        </div>

      
        <div className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 hover:scale-105 hover:bg-white/15 transition">
          <h2 className="text-2xl sm:text-3xl mb-3 sm:mb-4">
            🧑‍🤝‍🧑 Interest Match
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Find people who share similar interests with you.
          </p>
        </div>

      </div>

  
      <footer className="text-center py-4 sm:py-6 border-t border-white/10 text-gray-400 text-sm">
        © 2026 Shoomigle
      </footer>

    </div>
  );
}

export default Mainpage;