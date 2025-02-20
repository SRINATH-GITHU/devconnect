// src/components/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notificationSlice';
import { UserPlus, UserMinus, Edit, PlusCircle, X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import UserPosts from '../user/UserPosts';

//import Post from "../Post"; // Import Post component
const DEFAULT_PROFILE_PIC = "https://wallpaperaccess.com/full/1111980.jpg";

export default function ProfilePage() {
  const { user, updateUser, getAccessToken } = useAuth();
  const dispatch = useDispatch();

  // Profile States
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileData, setProfileData] = useState({
    bio: '',
    location: '',
    birth_date: '',
    profile_picture: null,
    is_followed: false,
    followers_count: 0,
    following_count: 0
  });



     // User Posts State
  // const [posts, setPosts] = useState([]);
  // const [postsLoading, setPostsLoading] = useState(true);
  
    // Fetch User's Posts
    // useEffect(() => {
    //   const fetchUserPosts = async () => {
    //     setPostsLoading(true);
    //     try {
    //       const token = getAccessToken();
    //       const response = await axios.get(
    //         `${API_BASE_URL}/posts/?view_type=profile&username=${user.username}`,
    //         {
    //           headers: { Authorization: `Bearer ${token}` },
    //         }
    //       );
    //       setPosts(response.data);
    //     } catch (error) {
    //       console.error("Error fetching user's posts:", error);
    //     } finally {
    //       setPostsLoading(false);
    //     }
    //   };
  
    //   if (user?.username) {
    //     fetchUserPosts();
    //   }
    // }, [user, getAccessToken]);
  

  // Create Post States
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [postPreview, setPostPreview] = useState('');
  const [postError, setPostError] = useState('');
  const [postLoading, setPostLoading] = useState(false);

  // Profile Fetch Effect
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `${API_BASE_URL}/users/${user}/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, getAccessToken]);

  // User Data Effect
  useEffect(() => {
    if (user) {
      setProfileData({
        bio: user.bio || '',
        location: user.location || '',
        birth_date: user.birth_date || '',
        profile_picture: user.profile_picture || null,
        is_followed: user.is_followed || false,
        followers_count: user.followers_count || 0,
        following_count: user.following_count || 0
      });
    }
  }, [user]);

  // Profile Image Handlers
  const handleImageError = () => {
    setImageError(true);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData({ ...profileData, profile_picture: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Post Image Handler
  const handlePostImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      setPostPreview(URL.createObjectURL(file));
    }
  };

  // Create Post Handler
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent && !postImage) {
      setPostError('Please add either text or an image');
      return;
    }

    setPostLoading(true);
    setPostError('');

    const formData = new FormData();
    if (postContent) formData.append('content', postContent);
    if (postImage) formData.append('image', postImage);

    try {
      const token = getAccessToken();
      await axios.post(`${API_BASE_URL}/posts/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Reset post form
      setPostContent('');
      setPostImage(null);
      setPostPreview('');
      setShowCreatePost(false);
      
      dispatch(addNotification({
        type: 'success',
        message: 'Post created successfully!'
      }));
    } catch (error) {
      setPostError('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setPostLoading(false);
    }
  };

  // Profile Update Handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAccessToken();
      const formData = new FormData();
      formData.append('bio', profileData.bio);
      formData.append('location', profileData.location);
      formData.append('birth_date', profileData.birth_date);
      if (profileData.profile_picture instanceof File) {
        formData.append('profile_picture', profileData.profile_picture);
      }

      const response = await axios.patch(
        `${API_BASE_URL}/users/me/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      updateUser(response.data);
      setEditing(false);
      setPreviewImage(null);
      dispatch(addNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      }));
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error.response?.data?.message || 'Failed to update profile'
        }));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const avatarUrl = imageError ? DEFAULT_PROFILE_PIC : (previewImage || user.profile_picture || DEFAULT_PROFILE_PIC);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center">
      
      {/* Glassmorphism Background Layer */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>
  
      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-12 w-full">
        <div className="bg-white/20 backdrop-blur-md shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
          
          {/* Header Section */}
          <div className="px-6 py-5 border-b border-gray-300 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">👤 Profile Information</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition transform hover:scale-105"
              >
                {showCreatePost ? "Cancel Post" : "Create Post"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition transform hover:scale-105"
              >
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
  
          {/* Create Post Section */}
          {showCreatePost && (
            <div className="px-6 py-5 border-b border-gray-300">
              <form onSubmit={handleCreatePost}>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                />
                
                {postPreview && (
                  <div className="relative my-3">
                    <img src={postPreview} alt="Preview" className="max-h-96 object-contain rounded-lg shadow-md" />
                    <button
                      type="button"
                      onClick={() => { setPostImage(null); setPostPreview(""); }}
                      className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 shadow-md"
                    >
                      ✖
                    </button>
                  </div>
                )}
  
                {postError && <div className="text-red-500 mb-2">{postError}</div>}
  
                <div className="flex justify-between items-center mt-4">
                  <label className="cursor-pointer text-indigo-300 hover:text-indigo-400">
                    <input type="file" accept="image/*" onChange={handlePostImageChange} className="hidden" />
                    📸 Add Photo
                  </label>
  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreatePost(false)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-white hover:bg-gray-100 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={postLoading || (!postContent && !postImage)}
                      className={`px-4 py-2 rounded-lg transition transform hover:scale-105 ${
                        postLoading || (!postContent && !postImage)
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {postLoading ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
  
          {/* Profile Picture Section */}
          <div className="px-6 py-5 flex justify-center">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Profile"
                onError={handleImageError}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          </div>
  
          {/* Profile Edit Form */}
          {editing ? (
            <form onSubmit={handleProfileUpdate} className="px-6 py-5 border-t border-gray-300">
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="mt-2 block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  />
                </div>
  
                <div>
                  <label className="block text-white font-medium">Bio</label>
                  <textarea
                    rows={3}
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  />
                </div>
  
                <div>
                  <label className="block text-white font-medium">Location</label>
                  <input
                    type="text"
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                </div>
  
                <div>
                  <label className="block text-white font-medium">Birth Date</label>
                  <input
                    type="date"
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    value={profileData.birth_date}
                    onChange={(e) => setProfileData({ ...profileData, birth_date: e.target.value })}
                  />
                </div>
  
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2 px-4 border border-transparent shadow-md text-white bg-indigo-600 hover:bg-indigo-700 transition transform hover:scale-105 rounded-lg"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center text-white py-5">
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="mt-1">{user.bio || "-"}</p>
            </div>
          )}
  
          {/* Profile Stats */}
          <div className="px-6 py-5 border-t border-gray-300 flex justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData.followers_count}</div>
              <div className="text-gray-300">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData.following_count}</div>
              <div className="text-gray-300">Following</div>
            </div>
          </div>
        </div>



          <UserPosts/>
      </div>
    </div>
  );
  
}