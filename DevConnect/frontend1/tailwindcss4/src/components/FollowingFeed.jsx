import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Post from "./Post"; // Reusing the Post component
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

const FollowingFeed = () => {
  const { getAccessToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFollowingPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAccessToken();
      const response = await axios.get(
        `${API_BASE_URL}/posts/?view_type=following`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(response.data);
    } catch (error) {
      setError("Failed to fetch following feed. Please try again.");
      console.error("Error fetching following feed:", error);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchFollowingPosts();
  }, [fetchFollowingPosts]);

  return (
    <div className="relative pt-15 min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center">
      
      {/* Glassmorphism Background Layer */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>

      <div className="relative container mx-auto px-6 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="mb-6 flex justify-between items-center bg-white/20 backdrop-blur-md p-4 rounded-lg shadow-lg">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
            👥 Following Feed
          </h1>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg shadow-md">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Loading Animation */}
        {loading && (
          <div className="flex justify-center p-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* No Posts */}
        {!loading && posts.length === 0 && (
          <div className="text-center p-8 bg-white/20 backdrop-blur-md rounded-lg shadow-md">
            <p className="text-white text-lg">No posts from followed users yet. 🤷‍♂️</p>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowingFeed;
