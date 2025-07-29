import bcrypt from "bcrypt";
import User from "../models/user.model.js"; // Adjust the path if needed
import path from 'path';
import fs from 'fs';
import UserModel from '../models/user.model.js';
import ProfileModel from "../models/profile.model.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "defaultSecret"; 



export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      token,
      user: {
        userId: {
          _id: user._id,
          name: user.name,
          username: user.username,
          profilePicture: user.profilePicture || '',
        },
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const register = async (req, res) => {
  try {
    const { email, password, username, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    // Your logic for accepting a connection request
    res.status(200).json({ message: "Connection accepted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  try {
    const { id } = req.query;

    // You must resolve the actual file path based on your app logic
    const filePath = path.resolve(`./public/uploads/resumes/${id}.pdf`);

    if (fs.existsSync(filePath)) {
      res.download(filePath, `${id}_profile.pdf`);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password"); // omit password
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionRequests = async (req, res) => {
  try {
    const { userId } = req.user; // assuming req.user is populated by auth middleware

    const user = await UserModel.findById(userId).populate("connectionRequests", "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ requests: user.connectionRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await UserModel.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await UserModel.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await ProfileModel.findOne({ userId: user._id });

    res.status(200).json({ user, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body; // ID of the user to whom the request is sent
    const { userId } = req.user;     // ID of the sender (from JWT middleware)

    if (userId === receiverId) {
      return res.status(400).json({ message: "You cannot send a request to yourself." });
    }

    const sender = await UserModel.findById(userId);
    const receiver = await UserModel.findById(receiverId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    // Avoid duplicate requests
    if (receiver.connectionRequests.includes(userId)) {
      return res.status(400).json({ message: "Request already sent." });
    }

    receiver.connectionRequests.push(userId);
    await receiver.save();

    res.status(200).json({ message: "Connection request sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming JWT middleware attaches req.user
    const updatedData = req.body;

    let profile = await ProfileModel.findOne({ userId });

    if (!profile) {
      // If no profile exists, create one
      profile = new ProfileModel({ userId, ...updatedData });
    } else {
      // Else, update existing
      Object.assign(profile, updatedData);
    }

    await profile.save();
    res.status(200).json({ message: "Profile updated successfully", profile });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.user; // from JWT auth middleware
    const updates = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User profile updated", user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const { userId } = req.user; // assuming JWT auth sets req.user
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = `/uploads/profile_pictures/${file.filename}`;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { profilePicture: imagePath },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: imagePath,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  try {
    const { userId } = req.user; // from auth middleware

    const user = await UserModel.findById(userId).populate("connections", "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ connections: user.connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
