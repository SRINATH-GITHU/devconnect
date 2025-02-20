import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Post from "../Post";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle } from "lucide-react";

const UserPosts = ({ className = "" }) => {
  const { user, getAccessToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) return;
      
      const params = new URLSearchParams();
      params.append("view_type", "profile");
      params.append("username", user.username);
      params.append("page", pageNumber);
      
      const token = getAccessToken();
      const response = await axios.get(
        `${API_BASE_URL}/posts/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (pageNumber === 1) {
        setPosts(response.data);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
      }

      setHasMore(response.data.length > 0);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        "Failed to fetch posts. Please try again later."
      );
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [user, getAccessToken]);

  useEffect(() => {
    if (user) {
      setPage(1);
      fetchPosts(1);
    }
  }, [user, fetchPosts]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const handleLike = (postId, likeData) => {
    setPosts(posts.map((post) => 
      post.id === postId 
        ? { ...post, is_liked: likeData.is_liked, likes_count: likeData.likes_count }
        : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className={`pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {posts.map((post) => (
        <div key={post.id} className=" p-4">
          {/* border rounded-lg shadow-md */}
          <Post 
            post={post} 
            onLike={handleLike}
            onDelete={handlePostDelete}
          />
        </div>
      ))}
      
      {loading && (
        <div className="flex justify-center p-4 col-span-full">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {!loading && hasMore && posts.length > 0 && (
        <div className="flex justify-center p-4 col-span-full">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 border border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPosts;


// const UserPosts = ({ className = "" }) => {
//   const { user, getAccessToken } = useAuth();
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const fetchPosts = useCallback(async (pageNumber = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       if (!user) return;
      
//       const params = new URLSearchParams();
//       params.append("view_type", "profile");
//       params.append("username", user.username);
//       params.append("page", pageNumber);
      
//       const token = getAccessToken();
//       const response = await axios.get(
//         `${API_BASE_URL}/posts/?${params.toString()}`,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       if (pageNumber === 1) {
//         setPosts(response.data);
//       } else {
//         setPosts((prevPosts) => [...prevPosts, ...response.data]);
//       }

//       setHasMore(response.data.length > 0);
//     } catch (error) {
//       setError(
//         error.response?.data?.message || 
//         "Failed to fetch posts. Please try again later."
//       );
//       console.error("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [user, getAccessToken]);

//   useEffect(() => {
//     if (user) {
//       setPage(1);
//       fetchPosts(1);
//     }
//   }, [user, fetchPosts]);

//   const handleLoadMore = () => {
//     if (!loading && hasMore) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       fetchPosts(nextPage);
//     }
//   };

//   const handleLike = (postId, likeData) => {
//     setPosts(posts.map((post) => 
//       post.id === postId 
//         ? { ...post, is_liked: likeData.is_liked, likes_count: likeData.likes_count }
//         : post
//     ));
//   };

//   const handlePostDelete = (postId) => {
//     setPosts(posts.filter((post) => post.id !== postId));
//   };

//   if (error) {
//     return (
//       <div className="flex items-center pt-15 justify-center p-4 bg-red-50 text-red-700 rounded-lg">
//         <AlertCircle className="w-5 h-5 mr-2" />
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className={`space-y-4 ${className}`}>
//       {posts.map((post) => (
//         <Post 
//           key={post.id} 
//           post={post} 
//           onLike={handleLike}
//           onDelete={handlePostDelete}
//         />
//       ))}
      
//       {loading && (
//         <div className="flex justify-center  pt-15 p-4">
//           <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}
      
//       {!loading && hasMore && posts.length > 0 && (
//         <div className="flex justify-center  pt-15 p-4">
//           <button
//             onClick={handleLoadMore}
//             className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 border border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Load More
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserPosts;
