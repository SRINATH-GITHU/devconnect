import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { addNotification } from "../../store/slices/notificationSlice";

export default function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(credentials);
      if (result.success) {
        dispatch(
          addNotification({
            type: "success",
            message: "Welcome back!",
          })
        );
        navigate("/profile");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          message: error.message || "Login failed",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center">
      
      {/* Glassmorphism Background Layer */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>

      <div className="relative bg-white/20 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md w-full space-y-6 transform transition duration-300 hover:scale-105">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">
            🔐 Sign in to your account
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-transparent rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-transparent rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-center font-medium text-white bg-indigo-600 hover:bg-indigo-800 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
