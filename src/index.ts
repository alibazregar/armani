import express, { Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import connectDB from "./db/connect";
const app = express();
dotenv.config();

app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  return res.status(200).send("hi from express app !" + req.query);
});
const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/chap";
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await connectDB(dbUrl);
  console.log("listening on port 3000");
});
