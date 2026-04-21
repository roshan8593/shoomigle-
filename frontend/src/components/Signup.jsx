import React, { useState } from "react";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import ShinyText from "./shinitex";
import { useNavigate } from "react-router";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!username || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("http://localhost:3000/signup", {
        username,
        password,
      });

      console.log(response.data);

      // Save token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username",response.data.username)

      // Redirect
      navigate("/main");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
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
        <h1 className="text-5xl font-bold tracking-wide">
          <ShinyText
            text={"Shoomigle"}
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={150}
            direction="left"
          />
        </h1>

        <div
          className="bg-white/10 backdrop-blur-lg border border-white/20
          rounded-3xl p-10 shadow-2xl w-[420px] flex flex-col gap-6"
        >
          <h2 className="text-3xl font-bold text-center">Create Account</h2>

          <p className="text-gray-300 text-center text-sm">
            Join Shoomigle and start connecting
          </p>

          <Input
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button
            onClick={handleSignup}
            disabled={loading}
            className="!bg-blue-600 hover:!bg-blue-700"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;