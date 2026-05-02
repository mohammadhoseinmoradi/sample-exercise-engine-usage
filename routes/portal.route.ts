import express from "express";

const router = express.Router();

router.get("/get-my-exercises", (_req, res) => {
  res.render("register", { title: "Register", error: null });
});

router.post("/get-my-exercises", (_req, res) => {
  // proxy get-my-exercise
});

router.get("/execute/:key", (_req, res) => {
  // redirect to execute
  // res.redirect(...)
});

router.get("/modify/:key", (req, res) => {
  // redirect to modify
  // res.redirect(...)
});

router.post("/webhook/:key", (req, _res) => {
  console.log(req.body);
  // webhook for
});

export default router;
