import React, { useState } from "react";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import ShinyText from "./shinitex.jsx";
import { useNavigate } from "react-router";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/login", {
        username: username,
        password: password,
      });

      console.log("Login successful", res.data);

      
      localStorage.setItem("token", res.data.token);

      navigate("/main");
    } catch (error) {
      console.log("Login failed", error.response?.data);

      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div
      className="relative h-screen flex items-center justify-center text-white overflow-hidden"
      style={{
        background: "#152331",
        backgroundImage: "linear-gradient(to right, #000000, #152331)",
      }}
    >
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-cyan-400 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

      <div className="flex flex-col items-center gap-8 z-10">
        <h1 className="text-5xl font-bold tracking-wide text-white">
          <ShinyText
            text={"Shoomigle"}
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={150}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </h1>

        <div
          className="bg-white/10 backdrop-blur-lg border border-white/20
          rounded-3xl p-10 shadow-2xl w-[420px] flex flex-col gap-6"
        >
          <h2 className="text-3xl font-bold text-center">Welcome Back</h2>

          <p className="text-gray-300 text-center text-sm">
            Login to continue chatting
          </p>

          <Input
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
          />

          <Input
            placeholder="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />

          <Button
            variant="solid"
            onClick={handleLogin}
            className="w-full !bg-blue-600 hover:!bg-blue-700 transition"
          >
            Login
          </Button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;