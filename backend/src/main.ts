import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.send({
    ok: true,
  });
});

app.listen(3000, () => console.log("Backend running on :3000"));
