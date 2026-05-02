import express from "express";
import path from "path";
import session from "express-session";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import portalRoutes from "./routes/portal.route.js";
import { initial } from "./utils/db.helper.js";
import axios from "axios";
import { to } from "await-to-js";

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
app.get("/", async (req, res) => {
  let error = "";
  if (!req.session.user) {
    res.render("login", {
      title: "Login",
      error: null,
      userDefault: process.env.DEFAULT_USER || "",
      userPass: process.env.DEFAULT_PASS || "",
    });
    return;
  }
  const [err, response] = await to(
    axios.get(process.env.API_GET_MY_EXERCISES, {
      params: {
        limit: 10,
        offset: 0,
      },
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    }),
  );

  if (err) {
    console.log(err);
    error = "Error in server";
  }

  if (response?.data.error) {
    console.log(err);
    error = response.data.message;
  }

  res.render("index", {
    title: "Home",
    error,
    user: req.session.user,
    response: response?.data.results,
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
