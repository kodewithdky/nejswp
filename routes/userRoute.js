import express from "express";
import { insertUser, loadRegister } from "../controllers/userController.js";
import bodyParser from "body-parser";
import multer from "multer";
import path  from "path";
import { fileURLToPath } from 'url';

//resolve es path module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//user route
const user_route = express();

//setup view ingine
user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

//middleware 
// user_route.use(bodyParser.json());
// user_route.use(bodyParser.urlencoded({ extended: true }));

//setup multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,"../public/userImages"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });
//load file for render
user_route.get("/register", loadRegister);
//registration
user_route.post("/register",upload.single("image"), insertUser);

export { user_route };
