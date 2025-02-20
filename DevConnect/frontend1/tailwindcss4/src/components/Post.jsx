import { useState, useEffect } from "react";
import { Heart, MessageCircle, Trash2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const Post = ({ post, onLike, onDelete }) => {
  const { user, getAccessToken } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [post.id]); // Only fetch when post ID changes

  const fetchComments = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/posts/${post.id}/comments/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const token = getAccessToken();
      const response = await axios.post(
        `${API_BASE_URL}/posts/${post.id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onLike(post.id, response.data);
    } catch (error) {
      console.error("Like failed:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/posts/${post.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(post.id);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = getAccessToken();
      const response = await axios.post(
        `${API_BASE_URL}/posts/${post.id}/comments/`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/posts/${post.id}/comments/${commentId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-md w-full max-w-md mx-auto">
      {/* Header Section */}
      <div className="flex items-center space-x-3">
        <Link to={`/profile/${post.author.username}`}>
          <img
            src={post.author.profile_picture || "/default-avatar.png"}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link to={`/profile/${post.author.username}`} className="font-semibold text-sm">
            {post.author.username}
          </Link>
          <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="mt-2 text-sm">{post.content}</p>

      {/* Post Image */}
      {post.image && (
        <img src={post.image} alt="Post" className="mt-2 rounded-md w-full object-cover" />
      )}

      {/* Actions: Like, Comment, Delete */}
      <div className="flex items-center justify-between mt-2 text-gray-600 text-xs">
        <button onClick={handleLike} className="flex items-center space-x-1">
          <Heart className={`w-4 h-4 ${post.is_liked ? "text-red-500" : "text-gray-500"}`} />
          <span>{post.likes_count}</span>
        </button>

        <button className="flex items-center space-x-1">
          <MessageCircle className="w-4 h-4" />
          <span>{comments.length}</span>
        </button>

        {user?.id === post.author.id && (
          <button onClick={handleDelete} className="text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleCommentSubmit} className="mt-3 flex items-center space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="border p-2 text-sm flex-1 rounded-md"
        />
        <button type="submit" className="text-blue-500">
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Comments List */}
      <div className="mt-2 space-y-2">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-gray-300 pl-3 flex justify-between">
              <div>
                <p className="text-sm font-semibold">{comment.author.username}</p>
                <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                <p className="mt-1 text-sm">{comment.content}</p>
              </div>
              {user?.id === comment.author.id && (
                <button
                  onClick={() => handleCommentDelete(comment.id)}
                  className="text-red-500 text-xs ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Post;
