import { Router } from "express";
import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getUserAndProfile,
  register,
  login,
  updateUserProfile,
  uploadProfilePicture,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionRequests,
  whatAreMyConnections,
  acceptConnectionRequest,
  getUserProfileAndUserBasedOnUsername,
} from "../controllers/user.controller.js";

import multer from "multer";

const router = Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Public Routes (no auth required)
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user/get_all_users').get(getAllUserProfile);
router.route('/user/get_profile_based_on_username').get(getUserProfileAndUserBasedOnUsername);
router.route('/user/download_resume').get(downloadProfile);

// ✅ Protected Routes (require JWT token)
router.route('/get_user_and_profile').get(authenticateToken, getUserAndProfile);
router.route('/user_update').post(authenticateToken, updateUserProfile);
router.route('/update_profile_data').post(authenticateToken, updateProfileData);
router.route("/update_profile_picture").post(authenticateToken, upload.single('profile_picture'), uploadProfilePicture);
router.route("/user/send_connection_request").post(authenticateToken, sendConnectionRequest);
router.route("/user/getConnectionRequests").get(authenticateToken, getMyConnectionRequests);
router.route("/user/user_connection_request").get(authenticateToken, whatAreMyConnections);
router.route("/user/accept_connection_request").post(authenticateToken, acceptConnectionRequest);

export default router;
