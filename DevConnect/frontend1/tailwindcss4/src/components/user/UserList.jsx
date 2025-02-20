import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, toggleFollow } from "../../store/slices/userSlice";
import { addNotification } from "../../store/slices/notificationSlice";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

export default function UserList() {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = getAccessToken();
        const response = await axios.get(`${API_BASE_URL}/users/`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        dispatch(setUsers(response.data));
      } catch (error) {
        dispatch(
          addNotification({
            type: "error",
            message: "Failed to load users",
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch, getAccessToken]);

  const handleFollow = async (userId, isFollowed) => {
    try {
      const token = getAccessToken();
      await axios.post(
        `${API_BASE_URL}/users/${userId}/follow/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      dispatch(toggleFollow({ userId, isFollowed }));
      dispatch(
        addNotification({
          type: "success",
          message: `Successfully ${isFollowed ? "unfollowed" : "followed"} user`,
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          message: "Failed to update follow status",
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center">
      
      {/* Glassmorphism Background Layer */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>

      <div className="relative container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
            🔥 Explore Users
          </h1>
        </div>

        {/* User List */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <li
              key={user.id}
              className="col-span-1 bg-white/20 backdrop-blur-md rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6 flex flex-col items-center">
                <img
                  src={user.profile_picture || "/default-avatar.png"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <h3 className="mt-4 text-lg font-semibold text-white">{user.username}</h3>
                {user.location && (
                  <span className="mt-1 px-3 py-1 text-sm text-gray-800 font-medium bg-gray-100 rounded-full">
                    📍 {user.location}
                  </span>
                )}
                <p className="mt-2 text-sm text-gray-200 text-center">
                  {user.bio || "No bio available"}
                </p>
              </div>
              <div className="border-t border-gray-300"></div>
              <div className="flex">
                <button
                  onClick={() => handleFollow(user.id, user.is_followed)}
                  className={`w-full py-3 text-center text-sm font-medium transition duration-300 rounded-bl-lg 
                    ${
                      user.is_followed
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                >
                  {user.is_followed ? "Unfollow" : "Follow"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
