import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../utils/db.helper";

const router = express.Router();

// Register GET
router.get("/register", (_req, res) => {
  res.render("register", { title: "Register", error: null });
});

// Register POST
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render("register", {
      title: "Register",
      error: "All fields are required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    ).run(username, email, hashedPassword);

    res.redirect("/login");
  } catch (err: any) {
    if (err.message.includes("UNIQUE")) {
      return res.render("register", {
        title: "Register",
        error: "Username or email already exists",
      });
    }
    console.error(err);
    res.render("register", { title: "Register", error: "Registration failed" });
  }
});

// Login GET
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    error: null,
    userDefault: process.env.DEFAULT_USER || "",
    userPass: process.env.DEFAULT_PASS || "",
  });
});

// Login POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = db
      .query("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("login", {
        title: "Login",
        error: "Invalid email or password",
      });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("login", { title: "Login", error: "Login failed" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

export default router;
