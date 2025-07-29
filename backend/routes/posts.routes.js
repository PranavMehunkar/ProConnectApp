import express from "express";
import multer from "multer";
import {
  createPost,
  deletePost,
  getAllPosts,
  increment_likes,
  commentPost,
  get_comments_by_post,
  delete_comment_of_user,
} from "../controllers/posts.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(null, Date.now() + "." + ext);
  },
});
const upload = multer({ storage });

router.get("/api/posts/post", authenticateToken, getAllPosts);
router.post("/api/posts/post", authenticateToken, upload.single("media"), createPost);
router.delete("/api/posts/delete_post", authenticateToken, deletePost);
router.post("/api/posts/increment_post_like", authenticateToken, increment_likes);
router.post("/api/posts/comment", authenticateToken, commentPost);
router.get("/api/posts/get_comments", authenticateToken, get_comments_by_post);
router.delete("/api/posts/delete_comment", authenticateToken, delete_comment_of_user);

export default router;
