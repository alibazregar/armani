import express, { Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import connectDB from "./db/connect";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/public",express.static("public"));
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  return res.status(200).send("<h1>hi from armani express app !</h1>");
});
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project Chap API",
      version: "1.0.0",
    },
  },
  apis: ["./dist/routes/**/**index.js", "./dist/routes/**/index.js"],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
const dbUrl = process.env.MONGO_URL;
if (!dbUrl) {
  throw new Error("mongo url not provided");
}
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await connectDB(dbUrl);
  console.log("listening on port 3000");
});
