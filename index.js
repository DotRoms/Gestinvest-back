import "dotenv/config";
import express from "express";

const PORT = process.env.PORT || 8080;

const app = express();

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(PORT, () => {
  console.log(`server listen on http://localhost:${PORT}`);
});
