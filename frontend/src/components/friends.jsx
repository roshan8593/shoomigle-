import React, { useState } from "react";
import { useNavigate } from "react-router";

function FriendsPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const friends = [
    {
      id: 1,
      name: "Rahul",
      username: "rahul_dev",
      online: true,
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Aman",
      username: "aman_codes",
      online: false,
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Sofia",
      username: "sofia_ai",
      online: true,
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      name: "Arjun",
      username: "arjun_builds",
      online: false,
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  ];

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(search.toLowerCase()) ||
      friend.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
  
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-wide">Friends</h1>

       
        <button
          onClick={() => navigate("/main")}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition shadow-lg"
        >
          ← Back to Home
        </button>
      </div>

     
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-blue-500"
        />
      </div>

    
      {filteredFriends.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          No friends found 😢
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={friend.avatar}
                    className="w-14 h-14 rounded-full object-cover"
                    alt="friend"
                  />

            
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                      friend.online ? "bg-green-400" : "bg-gray-400"
                    }`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-lg group-hover:text-blue-400 transition">
                    {friend.name}
                  </h3>
                  <p className="text-sm text-gray-400">@{friend.username}</p>
                </div>
              </div>

       
              <div className="flex gap-2 mt-4">
                <button className="flex-1 p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition shadow">
                  Message
                </button>

                <button className="flex-1 p-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition shadow">
                  Video Call
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FriendsPage;