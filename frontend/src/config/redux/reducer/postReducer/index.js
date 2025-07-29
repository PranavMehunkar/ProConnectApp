import { createSlice } from "@reduxjs/toolkit";
import {
  getAllComments,
  getAllPosts,
  createPost,
  deletePost,
  incrementPostLike,
  postComment,
} from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Posts
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all the posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts.reverse();
        console.log("POSTS FETCHED:", state.posts);
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create Post
      .addCase(createPost.fulfilled, (state, action) => {
        state.isError = false;
        state.message = "Post created successfully";
        state.posts = [action.payload.post, ...state.posts]; 
      })

      .addCase(createPost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })

      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload.post_id
        );
        state.message = "Post deleted successfully.";
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })

      // Increment Post Like
      .addCase(incrementPostLike.fulfilled, (state, action) => {
        const updatedPost = state.posts.find(
          (post) => post._id === action.payload.post_id
        );
        if (updatedPost) {
          updatedPost.likes = action.payload.likes;
        }
      })

      // Get Comments
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.postId = action.payload.post_id;
        state.comments = action.payload.comments;
        console.log("COMMENTS FETCHED:", state.comments);
      })

      // Post Comment
      .addCase(postComment.fulfilled, (state, action) => {
        state.comments = [...state.comments, action.payload];
      })
      .addCase(postComment.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetPostId } = postSlice.actions;

export default postSlice.reducer;
