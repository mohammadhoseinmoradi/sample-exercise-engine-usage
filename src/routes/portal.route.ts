import express from "express";
import axios from "axios";
import { to } from "await-to-js";
const router = express.Router();

router.get("/get-my-exercises", (_req, res) => {
  res.render("register", { title: "Register", error: null });
});

router.post("/get-my-exercises", async (_req, res) => {
  const response = await axios.get(process.env.API_GET_MY_EXERCISES, {
    params: {
      limit: _req.query.limit,
      offset: _req.query.offset,
    },
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  });

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

router.get("/create/:metadata", (_req, res) => {
  const baseUrl = process.env.API_REDIRECT_CREATE_EXERCISE!;
  const token = process.env.ACCESS_TOKEN!;
  const url = new URL(baseUrl);

  // query params
  url.searchParams.set("token", token);
  url.searchParams.set("metadata", _req.query.metadata as string);

  // redirect
  return res.redirect(307, url.toString());
});

router.get("/modify/:exerciseKey/:metadata", (req, res) => {
  const baseUrl = process.env.API_REDIRECT_MODIFY_EXERCISE!;
  const token = process.env.ACCESS_TOKEN!;
  const url = new URL(baseUrl);
  baseUrl.replace("{exerciseKey}", req.params.exerciseKey);

  // query params
  url.searchParams.set("token", token);
  url.searchParams.set("metadata", req.query.metadata as string);

  // redirect
  return res.redirect(307, url.toString());
});

router.post("/webhook/:key", (req, _res) => {
  console.log(req.body);
  // webhook for
});

router.get("/exercise-image/:key", async (_req, res) => {
  const url = new URL(_req.url);

  // example: /exercise?key=abc123
  const exerciseKey = url.searchParams.get("key");

  if (!exerciseKey) {
    return new Response("Missing exerciseKey", { status: 400 });
  }

  const baseUrl = process.env.API_GET_EXERCISE_IMAGE!;

  const targetUrl = baseUrl.replace("{exerciseKey}", exerciseKey);
  const finalUrl = targetUrl.replace("{poseId}", "0");

  const [err, response] = await to(
    axios.get(finalUrl, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    }),
  );
  if (err) {
    return new Response("Missing get image", { status: 400 });
  }
  return res.json(response);
});

export default router;
