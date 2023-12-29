import express, { Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import connectDB from "./db/connect";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
dotenv.config();
app.use(express.static("public"));
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  return res.status(200).send("hi from express app !" + req.query);
});
const options = {
  swaggerDefinition: {
    info: {
      title: "Project Chap API",
      version: "1.0.0",
    },
  },
  apis: ["**/*.ts"], // specify your file pattern here
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/chap";
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await connectDB(dbUrl);
  console.log("listening on port 3000");
});
