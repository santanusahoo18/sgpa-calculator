// ============================================================
// SGPA CALC — Backend Server (MongoDB Atlas version)
// Handles: Register, Login, User Count, Reset Password, Admin User List, Notes
// Storage: MongoDB (via Mongoose)
// ============================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// ---------- CONFIG ----------
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_KEY = process.env.ADMIN_KEY;
const MONGO_URI = process.env.MONGO_URI;

if (!JWT_SECRET || !ADMIN_KEY || !MONGO_URI) {
  console.error(
    "❌ Missing required environment variables. Check your .env file for MONGO_URI, JWT_SECRET, ADMIN_KEY.",
  );
  process.exit(1);
}

// ---------- DATABASE CONNECTION ----------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ---------- USER SCHEMA ----------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
  loginCount: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

// ---------- NOTE SCHEMA ----------
const noteSchema = new mongoose.Schema({
  stream: { type: String, required: true }, // science / arts / commerce
  dept: { type: String, required: true }, // e.g. computer_science
  semester: { type: String, required: true }, // e.g. "1"
  title: { type: String, required: true },
  link: { type: String, required: true }, // Google Drive link
  type: { type: String, enum: ["notes", "pyq"], default: "notes" }, // notes or previous-year-questions
  uploadedAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

// ============================================================
// POST /api/register
// body: { name, email, password }
// ============================================================
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required." });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "Account created successfully. You can now log in." });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ============================================================
// POST /api/login
// body: { email, password }
// ============================================================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful.",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ============================================================
// GET /api/stats
// ============================================================
app.get("/api/stats", async (req, res) => {
  try {
    const users = await User.find({}, "loginCount");
    const totalLogins = users.reduce((sum, u) => sum + (u.loginCount || 0), 0);
    res.json({
      totalUsers: users.length,
      totalLogins,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ============================================================
// POST /api/reset-password
// body: { name, email, newPassword }
// ============================================================
app.post("/api/reset-password", async (req, res) => {
  try {
    const { email, name, newPassword } = req.body;

    if (!email || !name || !newPassword) {
      return res.status(400).json({
        error: "Email, registered name and new password are required.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ error: "No account found with this email address." });
    }

    if (user.name.toLowerCase().trim() !== name.toLowerCase().trim()) {
      return res
        .status(400)
        .json({ error: "Identity validation failed. Name does not match." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (err) {
    console.error("Reset-password error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ============================================================
// GET /api/admin/users
// Header: x-admin-key: ADMIN_KEY
// ============================================================
app.get("/api/admin/users", async (req, res) => {
  try {
    if (req.header("x-admin-key") !== ADMIN_KEY) {
      return res.status(403).json({ error: "Invalid admin key." });
    }
    const users = await User.find(
      {},
      "name email registeredAt lastLogin loginCount",
    );
    res.json(users);
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ============================================================
// GET /api/notes
// Public — returns all notes so any user's browser/device can see them.
// ============================================================
app.get("/api/notes", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type === "notes" || req.query.type === "pyq") {
      filter.type = req.query.type;
    }
    const notes = await Note.find(filter).sort({ uploadedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ============================================================
// POST /api/notes
// Header: x-admin-key: ADMIN_KEY
// body: { stream, dept, semester, title, link }
// ============================================================
app.post("/api/notes", async (req, res) => {
  try {
    if (req.header("x-admin-key") !== ADMIN_KEY) {
      return res.status(403).json({ error: "Invalid admin key." });
    }

    const { stream, dept, semester, title, link, type } = req.body;
    if (!stream || !dept || !semester || !title || !link) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const resourceType = type === "pyq" ? "pyq" : "notes";

    const note = await Note.create({
      stream,
      dept,
      semester,
      title,
      link,
      type: resourceType,
    });
    return res.status(201).json(note);
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ============================================================
// DELETE /api/notes/:id
// Header: x-admin-key: ADMIN_KEY
// ============================================================
app.delete("/api/notes/:id", async (req, res) => {
  try {
    if (req.header("x-admin-key") !== ADMIN_KEY) {
      return res.status(403).json({ error: "Invalid admin key." });
    }
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted." });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
