import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
console.log("MONGO_URI from .env:", process.env.MONGO_URI);

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // or your frontend URL
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(express.json()); // ✅ ensure this is BEFORE your routes
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ✅ Use routes
app.use("/", userRoutes);
app.use("/", postRoutes); // includes /api/posts/...

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI in .env");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");
    app.listen(9090, () => console.log("🚀 Server running on port 9090"));
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
};


start();
