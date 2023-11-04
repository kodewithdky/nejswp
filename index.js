import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dbConnection from "./config/db.js";
import {user_route} from "./routes/userRoute.js";
import { admin_route } from "./routes/adminRoute.js";

//configure env
dotenv.config();
//port
const PORT = process.env.PORT || 7071;
//rest object
const app = express();
//database config
dbConnection();


//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//routes
//user-route
app.use("/", user_route);
//admin-route
app.use("/admin", admin_route);

//rest api
app.get("/", (req, res) => {
  res.send("KodeWithDKY");
});

app.listen(PORT, () => {
  console.log(`Server Is Running ON Port ${PORT}`.bgCyan.white);
});
