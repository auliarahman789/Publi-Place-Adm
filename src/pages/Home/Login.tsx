import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = ({}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitLogin(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/login`,
        { email: email, password: password },
        {
          withCredentials: true,
        }
      );
      console.log("Login successful:", response.data);
      navigate("/admin");
    } catch (err: any) {
      alert("Login failed. Please try again.");
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 min-h-[calc(100vh-56px)]">
      <div className="w-full max-w-sm mx-auto px-6 py-8 font-bookmania">
        <div className="space-y-4 flex flex-col justify-between">
          {/* Login Form */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-extrabold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-4 text-[16px] font-bookmania resize-none h-16 border-black bg-white"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-extrabold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-4 text-[16px] font-bookmania resize-none h-16 border-black bg-white"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              onClick={submitLogin}
              disabled={loading}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Login In..." : "Login"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-gray-500">
          <p
            className="text-[16px] text-black"
            style={{
              textShadow:
                "0.3px 0.3px 0 #999, -0.3px -0.3px 0 #999, 0.3px -0.3px 0 #999, -0.3px 0.3px 0 #999",
            }}
          >
            This project is supported by
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <span className="font-semibold">
              <img
                src="/loco.png"
                alt="Let This Book Be Your Public Space"
                className="w-[82px] h-[22px] mx-auto"
              />
            </span>
            <span className="font-bold">
              <img
                src="/basecamp.png"
                alt="Let This Book Be Your Public Space"
                className="w-[118px] h-[22px] mx-auto"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
