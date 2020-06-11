require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const { selectFromResults } = require("./utils");
const {
  searchPhotos,
  classifyPhoto,
  getClassified,
  updatePhoto,
  getUserProfile
} = require("./api");

const port = process.env.PORT || 9999;

const app = express();

globalThis.fetch = fetch;

app.use(cors());
app.use(bodyParser.json());

const sleep = (time) => new Promise((accept) => setTimeout(accept, time));

app.use(async (req, res, next) => {
  await sleep(1000);
  next();
});

app.get("/search", async (req, res) => {
  try {
    const { query } = req;
    const { search } = query;

    if (!search) {
      throw new Error("Empty search string");
    }

    const data = await searchPhotos({ search }).then(
      ({ results, ...rest }) => ({
        ...rest,
        results: results.map(selectFromResults)
      })
    );

    return res.send(data);
  } catch (e) {
    console.log("search", e);
    return res.status(500).send({ message: "Something went wrong..." });
  }
});

app.post("/classify", async (req, res) => {
  try {
    const { body } = req;
    const { photo, classification } = body;
    const data = await classifyPhoto({
      photo,
      classification
    });
    return res.send(data);
  } catch (e) {
    console.log("classify", e);
    return res.status(500).send({ message: "Something went wrong..." });
  }
});

app.get("/classified", async (_, res) => {
  try {
    const data = await getClassified();
    return res.send(data);
  } catch (e) {
    console.log("classified", e);
    return res.status(500).send({ message: "Something went wrong..." });
  }
});

app.post("/updatePhoto", async (req, res) => {
  try {
    const { body } = req;
    const { photo } = body;

    const updated = await updatePhoto(photo);
    return res.send(updated);
  } catch (e) {
    console.log("updatePhoto", e);
    return res.status(500).send({ message: "Something went wrong..." });
  }
});

app.get("/user", async (req, res) => {
  try {
    const { query } = req;
    const { username } = query;
    const user = await getUserProfile({ username });
    return res.send(user);
  } catch (e) {
    console.log("user", e);
    return res.status(500).send({ message: "Something went wrong..." });
  }
});

app.listen(port, () => console.log(`Server running at port: ${port}`));
