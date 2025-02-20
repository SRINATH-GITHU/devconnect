
// src/pages/Following.jsx
import { PostList } from '../components/Post';

const Following = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PostList viewType="following" />
    </div>
  );
};

export { Home, Profile, Following };