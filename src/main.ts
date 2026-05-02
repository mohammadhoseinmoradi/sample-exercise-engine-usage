import express from "express";
import path from "path";
import session from "express-session";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import portalRoutes from "./routes/portal.route.js";
import { initial } from "./utils/db.helper.js";

dotenv.config();

initial();

const app = express();
const port = process.env.PORT || 3000;

// ====================== Middleware ======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Routes
app.use("/auth/", authRoutes);
app.use("/portal/", portalRoutes);

// Home Route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    user: req.session.user,
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
