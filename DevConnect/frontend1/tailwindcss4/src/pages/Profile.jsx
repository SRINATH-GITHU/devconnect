
// src/pages/Profile.jsx
import { useParams } from 'react-router-dom';
import { PostList } from '../components/Post';

const Profile = () => {
  const { username } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile info component would go here */}
      <PostList username={username} viewType="profile" />
    </div>
  );
};
