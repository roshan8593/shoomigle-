import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

function SetSlider({ openProfile, setOpenProfile }) {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [username, setUsername] = useState(
    storedUser?.username || localStorage.getItem("username") || "your_username"
  );

  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || null
  );

  const [editingName, setEditingName] = useState(false);
  const [showPreview, setShowPreview] = useState(false);


  const handleUsernameSave = () => {
    localStorage.setItem("username", username);
    setEditingName(false);
  };

 
  useEffect(() => {
    const savedPic = localStorage.getItem("profilePic");
    if (savedPic) setProfilePic(savedPic);
  }, []);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePic(imageURL);
      localStorage.setItem("profilePic", imageURL);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePic");
    localStorage.removeItem("user");

    setOpenProfile(false);
    navigate("/");
  };

  return (
    <>
      
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <img
              src={
                profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-60 h-60 rounded-full object-cover border-4 border-white"
              alt="preview"
            />

            <button
              onClick={openFilePicker}
              className="px-5 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            >
              Update Picture
            </button>

            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-300 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

  
      <div
        className={`fixed top-0 right-0 h-screen w-80 z-50 backdrop-blur-xl bg-white/5 border-l border-white/10 text-white shadow-2xl transform transition-transform duration-300
        ${openProfile ? "translate-x-0" : "translate-x-full"}`}
      >
     
        <div className="p-5 border-b border-white/10 flex justify-between items-center">
          <h2 className="font-semibold text-xl">Profile</h2>
          <button
            onClick={() => setOpenProfile(false)}
            className="hover:scale-110 transition"
          >
            ✖
          </button>
        </div>

    
        <div className="flex flex-col items-center p-6">
          <img
            src={
              profilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            onClick={() => setShowPreview(true)}
            className="w-24 h-24 rounded-full object-cover border-2 border-white/20 cursor-pointer hover:scale-105 transition"
          />

          {editingName ? (
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUsernameSave();
                }
              }}
              className="mt-4 p-2 rounded bg-white/10 border border-white/20 text-center outline-none"
              autoFocus
            />
          ) : (
            <h3 className="mt-4 font-semibold text-lg">@{username}</h3>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

       
        <div className="px-5 flex flex-col gap-3">
         

          <button
            onClick={openFilePicker}
            className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Set Profile Picture
          </button>

          <button
            onClick={() => navigate("/friends")}
            className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            See Friends
          </button>

          <button
            onClick={handleLogout}
            className="p-3 rounded-lg bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

     
        <div className="absolute bottom-6 w-full text-center text-xs text-gray-400">
          Logged in as @{username}
        </div>
      </div>
    </>
  );
}

export default SetSlider;