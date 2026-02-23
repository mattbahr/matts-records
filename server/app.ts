import cors from "cors";
import express, { Router } from "express";
import image from "./routes/image.ts";
import record from "./routes/record.ts";

type Application = ReturnType<typeof express>;

const app: Application = express();

const recordRouter: Router = record as unknown as Router;
const imageRouter: Router = image as unknown as Router;

app.use(cors());
app.use("/record", recordRouter);
app.use("/image", imageRouter);

export default app;
