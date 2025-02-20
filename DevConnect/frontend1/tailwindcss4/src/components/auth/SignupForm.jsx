// src/components/auth/SignupForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notificationSlice';
import axios from 'axios';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:8000/api/users/register/', formData);
      dispatch(addNotification({
        type: 'success',
        message: 'Account created successfully! Please login.'
      }));
      navigate('/login');
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Registration failed'
      }));
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
            🚀 Create Your Account
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-transparent rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-transparent rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-transparent rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-transparent rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={(e) =>
                setFormData({ ...formData, confirm_password: e.target.value })
              }
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-center font-medium text-white bg-indigo-600 hover:bg-indigo-800 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
