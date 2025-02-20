
// src/store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    following: [],
    loading: false,
    error: null
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    toggleFollow: (state, action) => {
      const { userId, isFollowed } = action.payload;
      state.users = state.users.map(user => 
        user.id === userId 
          ? { ...user, is_followed: !isFollowed }
          : user
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setUsers, setFollowing, toggleFollow, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
