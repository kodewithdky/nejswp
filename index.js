import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnection from "./config/db.js";

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


//rest api
app.get("/", (req, res) => {
  res.send("KodeWithDKY");
});

app.listen(PORT, () => {
  console.log(`Server Is Running ON Port ${PORT}`.bgCyan.green);
});
