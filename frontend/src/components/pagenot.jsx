import React from "react";
import { Navigate, useNavigate } from "react-router";
function PageNotFound() {

  const navigate = useNavigate();
  return (
    
    <div
      className="h-screen w-full flex items-center justify-center text-white"
      style={{
        background: "linear-gradient(to right, #000000, #152331)",
      }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 shadow-xl text-center max-w-lg">
        
        <h1 className="text-8xl font-bold mb-4">404</h1>

        <h2 className="text-2xl font-semibold mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-300 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <button className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition" onClick={()=>navigate('/')}>
          Go home
        </button>

      </div>
    </div>
  );
}

export default PageNotFound;