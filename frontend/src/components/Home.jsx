import React from "react";
import Aurora from "./Aurora";
import TrueFocus from './Truefocus';
import ShinyText from './shinitex.jsx';
import { Navigate, useNavigate } from "react-router";


function Home() {
  
  const navigate = useNavigate();

 
  return (
    <div className="relative h-screen overflow-hidden bg-black">

      
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#8f66ff", "#B19EEF", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold leading-[1.2]">

        <ShinyText
        text={"Shoomigle"}
  speed={2}
  delay={0}
  color="#b5b5b5"
  shineColor="#ffffff"
  spread={120}
  direction="left"
  yoyo={false}
  pauseOnHover={false}
  disabled={false}
/>
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-xl">
          Start chatting with strangers around the world instantly
        </p>
        <button className="mt-6 mb-5 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:scale-105 transition" onClick={()=>{
          return navigate('/signup')
        }
         }>
          Start Chat
        </button>
        <p className=""><TrueFocus 
sentence="Meet Connect"
manualMode={false}
blurAmount={5}
borderColor="#5227FF"
animationDuration={0.5}
pauseBetweenAnimations={1}
/></p>
      </div>



    </div>
  );
}

export default Home;