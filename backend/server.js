// ============================================================
// SGPA CALC — Backend Server
// Handles: Register, Login, User Count, Reset Password, Admin User List
// Storage: simple JSON file (backend/data/users.json)
// ============================================================

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// ---------- CONFIG ----------
const PORT = 3000;
const JWT_SECRET =
  "e33d1b2b84c198e7d639ad9475d3512313274f7d03839d5ce63ea76953feb9b5";
const ADMIN_KEY = "sd@123"; // used to view the user list

// ---------- DATA STORAGE ----------
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ============================================================
// POST /api/register
// body: { name, email, password }
// ============================================================
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email and password are required." });
  }

  const users = readUsers();
  const exists = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (exists) {
    return res
      .status(409)
      .json({ error: "An account with this email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    registeredAt: new Date().toISOString(),
    lastLogin: null,
    loginCount: 0,
  };

  users.push(newUser);
  saveUsers(users);

  return res
    .status(201)
    .json({ message: "Account created successfully. You can now log in." });
});

// ============================================================
// POST /api/login
// body: { email, password }
// ============================================================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // record usage — this is how we know people are using the app
  user.lastLogin = new Date().toISOString();
  user.loginCount = (user.loginCount || 0) + 1;
  saveUsers(users);

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.json({
    message: "Login successful.",
    token,
    user: { name: user.name, email: user.email },
  });
});

// ============================================================
// GET /api/stats
// Public: just the total number of registered users
// ============================================================
app.get("/api/stats", (req, res) => {
  const users = readUsers();
  const totalLogins = users.reduce((sum, u) => sum + (u.loginCount || 0), 0);
  res.json({
    totalUsers: users.length,
    totalLogins,
  });
});

// ============================================================
// POST /api/reset-password
// body: { name, email, newPassword }
// Verifies identity by matching registered name + email, then
// overwrites the stored password with a freshly hashed one.
// ============================================================
app.post("/api/reset-password", async (req, res) => {
  const { email, name, newPassword } = req.body;

  if (!email || !name || !newPassword) {
    return res
      .status(400)
      .json({ error: "Email, registered name and new password are required." });
  }

  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res
      .status(404)
      .json({ error: "No account found with this email address." });
  }

  // Identity validation check: compare full names (case-insensitive, trimmed)
  if (user.name.toLowerCase().trim() !== name.toLowerCase().trim()) {
    return res
      .status(400)
      .json({ error: "Identity validation failed. Name does not match." });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  saveUsers(users);

  return res.json({
    message:
      "Password reset successful. You can now log in with your new password.",
  });
});

// ============================================================
// GET /api/admin/users?key=ADMIN_KEY
// Shows every user's activity (no passwords included)
// ============================================================
app.get("/api/admin/users", (req, res) => {
  if (req.query.key !== ADMIN_KEY) {
    return res.status(403).json({ error: "Invalid admin key." });
  }
  const users = readUsers().map((u) => ({
    name: u.name,
    email: u.email,
    registeredAt: u.registeredAt,
    lastLogin: u.lastLogin,
    loginCount: u.loginCount,
  }));
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
