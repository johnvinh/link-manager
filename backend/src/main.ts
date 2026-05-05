import express from "express";
import { fetchLinks, createLink, updateLink, deleteLink, LinkNotFoundError } from "./storage-helpers.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send({
    ok: true,
  });
});

app.get("/links", async (req, res) => {
  try {
    const links = await fetchLinks();
    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/links", async (req, res) => {
  try {
    const { url } = req.body;

    // 1. Requirement check
    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    // 2. Format check
    try {
      new URL(url);
    } catch (err) {
      res.status(400).json({ error: "Invalid URL" });
      return;
    }

    const newLink = await createLink(req.body);
    res.status(201).json(newLink);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/links/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedLink = await updateLink(id, req.body);
    res.json(updatedLink);
  } catch (err) {
    if (err instanceof LinkNotFoundError) {
      res.status(404).json({ error: "Not Found" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.delete("/links/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await deleteLink(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof LinkNotFoundError) {
      res.status(404).json({ error: "Not Found" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(3000, () => console.log("Backend running on :3000"));
