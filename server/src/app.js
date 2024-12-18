import express, { json } from "express";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:5174",
    "http://localhost:5175",
    "https://dummy-store-gamma.vercel.app",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USERNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRETKEY,
  secure: true,
});

app.use(cors(corsOptions)); //accept incoming ip addresses
app.use(morgan("dev")); //logs http requests to the terminal
app.use(json({ limit: "25mb" })); //parses http requests in json format
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(compression()); //reduce the sizes of data being sent
app.use(cookieParser()); //store user refreshToken in cookies

app.disable("x-powered-by"); //disables the header which provides information about the stack being used. used for secure purposes

//routes in express
app.get("/", (req, res) => {
  res.send("Hello express");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
//error for wrong routes
app.use((req, res, next) => {
  return next(createHttpError(404, "Endpoint not found"));
});

//general and specific errors
app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "An unknown error has occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
