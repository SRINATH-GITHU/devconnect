import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostList from '../components/PostList';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="relative pt-15 min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center">
      
      {/* Glassmorphism Background Layer */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>

      <div className="relative container mx-auto px-6 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="mb-6 flex justify-between items-center bg-white/20 backdrop-blur-md p-4 rounded-lg shadow-lg">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
            🌟 Home Feed
          </h1>
          <Link
            to="/createpost"
            className="inline-flex items-center px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-800 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            <PlusCircle className="w-6 h-6 mr-2" />
            Create Post
          </Link>
        </div>

        {/* Post List */}
        <div className="space-y-6">
          <PostList viewType="home" key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default Home;
