import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/get-my-exercises", (_req, res) => {
  res.render("register", { title: "Register", error: null });
});

router.post("/get-my-exercises", async(_req, res) => {
const response = await axios.get(
  process.env.API_GET_MY_EXERCISES,
  {
    params: {
      limit: _req.query.limit,
      offset: _req.query.offset,
    },
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  }
);

return res.json(response.data);
});

router.get("/execute/:key", (_req, res) => {
    const url = new URL(_req.url);

    // example: /exercise?key=abc123
    const exerciseKey = url.searchParams.get("key");

    if (!exerciseKey) {
      return new Response("Missing exerciseKey", { status: 400 });
    }

    const baseUrl = process.env.API_REDIRECT_EXECUTE_EXERCISE!;

    const targetUrl = baseUrl.replace("{exerciseKey}", exerciseKey);

    return Response.redirect(targetUrl, 307); // keep method if POST
});

router.get("/create/:key", (_req, res) => {
  // redirect to execute
  // res.redirect(...)
});

router.get("/modify/:key", (req, res) => {
  // redirect to modify
  res.redirect(
    process.env.API_REDIRECT_MODIFY_EXERCISE +
      "?token=" +
      process.env.ACCESS_TOKEN,
  );
});

router.post("/webhook/:key", (req, _res) => {
  console.log(req.body);
  // webhook for
});

export default router;
