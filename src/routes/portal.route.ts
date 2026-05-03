import express from "express";
import axios from "axios";
import { to } from "await-to-js";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

router.use(authMiddleware);
router.get("/get-my-exercises", async(_req, res) => {
    let error = "";
  if (!_req.user) {
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
    user: _req.user,
    response: response?.data.results,
  });
});

router.post("/get-my-exercises", async (_req, res) => {
  const [err,response] = await to (axios.get(process.env.API_GET_MY_EXERCISES, {
    params: {
      limit: _req.query.limit,
      offset: _req.query.offset,
    },
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  }))
  if(err){
    return new Response("Missing get exersice", { status: 400 });
  }

  return res.json(response.data);
});

router.get("/execute/:key", (req, res) => {
  const exerciseKey = req.params.key;

  if (!exerciseKey) {
    return res.status(400).send("Missing exerciseKey");
  }

  const baseUrl = process.env.API_REDIRECT_EXECUTE_EXERCISE!;

  const targetUrl = baseUrl.replace("{exerciseKey}", exerciseKey);
  const url = new URL(targetUrl);
  url.searchParams.set("token", process.env.ACCESS_TOKEN!);
  return res.redirect(307, url.toString());  
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

  let finalUrl = baseUrl.replace("{exerciseKey}", req.params.exerciseKey);

  const url = new URL(finalUrl);

  // از params نه query
  url.searchParams.set("token", token);
  url.searchParams.set("metadata", req.params.metadata);

  return res.redirect(307, url.toString());
});

router.post("/webhook/:key", (req, _res) => {
  console.log(req.body);
  // webhook for
});

router.get("/exercise-image/:key", async (req, res) => {
  const exerciseKey = req.params.key;

  if (!exerciseKey) {
    return res.status(400).send("Missing exerciseKey");
  }

  const baseUrl = process.env.API_GET_EXERCISE_IMAGE!;

  const targetUrl = baseUrl.replace("{exerciseKey}", exerciseKey);
  const finalUrl = targetUrl.replace("{poseId}", "1");

  try {
    const response = await axios.get(finalUrl, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "image/png");
    return res.send(response.data);
  } catch (err) {
    return res.status(400).send("Missing get image");
  }
});

export default router;
