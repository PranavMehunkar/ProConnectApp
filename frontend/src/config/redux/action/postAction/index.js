import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Get all posts
export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.get("/api/posts/post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error fetching posts");
    }
  }
);

// ✅ Create post with optional media
export const createPost = createAsyncThunk(
  "post/createPost",
  async ({ file, body }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("body", body);
      if (file) {
        formData.append("media", file);
      }

      const response = await clientServer.post("/api/posts/post", formData, {
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Post create error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Delete a post
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.delete("/api/posts/delete_post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          post_id: post_id.post_id,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

// ✅ Like a post
export const incrementPostLike = createAsyncThunk(
  "post/incrementLike",
  async (post, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.post(
        "api/posts/increment_post_like",
        {
          post_id: post.post_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Like failed");
    }
  }
);

// ✅ Get all comments for a post
export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.get("/api/posts/get_comments", {
        params: {
          post_id: postData.post_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id: postData.post_id,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

// ✅ Post a comment
export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.post(
        "/comment",
        {
          post_id: commentData.post_id,
          body: commentData.body,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);
