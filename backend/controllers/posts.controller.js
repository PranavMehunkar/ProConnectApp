import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import PostModel from "../models/posts.model.js"; // ✅ Fix: Use correct model name
import Comment from "../models/comments.model.js";

// ✅ Health Check
export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

// ✅ Create Post
export const createPost = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);
    
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ message: "Post body is required" });
    }

    const mediaFile = req.file?.filename || null;

    const newPost = new PostModel({
      userId: req.user.id,
      body,
      media: mediaFile,
    });

    await newPost.save();

    return res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Create Post Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name username email profilePicture");

    return res.json({ posts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Post
export const deletePost = async (req, res) => {
  const { post_id } = req.body;
  const userId = req.user._id;

  try {
    const post = await PostModel.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await PostModel.deleteOne({ _id: post_id });
    return res.json({ message: "Post Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Comment on Post
export const commentPost = async (req, res) => {
  const { post_id, commentBody } = req.body;
  const userId = req.user._id;

  try {
    const post = await PostModel.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = new Comment({
      userId,
      postId: post_id,
      comment: commentBody,
    });

    await comment.save();

    return res.status(200).json({ message: "Comment Added" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get Comments for Post
export const get_comments_by_post = async (req, res) => {
  const post_id = req.query.post_id;

  try {
    const post = await PostModel.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({ postId: post_id })
      .populate("userId", "username name")
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Comment
export const delete_comment_of_user = async (req, res) => {
  const { comment_id } = req.body;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(comment_id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: comment_id });
    return res.json({ message: "Comment Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Increment Post Likes
export const increment_likes = async (req, res) => {
  const { post_id } = req.body;

  try {
    const post = await PostModel.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes += 1;
    await post.save();

    return res.json({ message: "Likes Incremented", likes: post.likes });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
