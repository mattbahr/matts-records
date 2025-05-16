import cors from "cors";
import express from "express";
import image from "./routes/image.ts";
import record from "./routes/record.ts";

const app = express();

app.use(cors());
app.use("/record", record);
app.use("/image", image);

export default app;
