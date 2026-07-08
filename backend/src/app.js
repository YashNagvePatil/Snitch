import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRotuer from "../routes/auth.route.js";
const app = express();

 
 app.use(morgan("dev"));
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use(cookieParser());
 
 app.get("/", (req, res) => {
   res.send("Hello World!");
 });


 app.use("/api/auth", authRotuer);

 export default app;