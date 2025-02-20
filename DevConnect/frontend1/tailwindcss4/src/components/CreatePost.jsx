// src/components/CreatePost.jsx
import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const CreatePost = ({ onPostCreated, onClose }) => {
  const { getAccessToken } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !image) {
      setError('Please add either text or an image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    if (content) formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const token = getAccessToken();
      await axios.post(`${API_BASE_URL}/posts/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setContent('');
      setImage(null);
      setPreview('');
      onPostCreated && onPostCreated();
    } catch (error) {
      setError('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Create New Post</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded-lg mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="3"
        />
        
        {preview && (
          <div className="relative mb-2">
            <img
              src={preview}
              alt="Preview"
              className="max-h-96 object-contain rounded"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview('');
              }}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
            >
              ×
            </button>
          </div>
        )}

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="flex justify-between items-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="text-indigo-500">Add Photo</span>
          </label>

          <button
            type="submit"
            disabled={loading || (!content && !image)}
            className={`px-4 py-2 rounded-lg ${
              loading || (!content && !image)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;