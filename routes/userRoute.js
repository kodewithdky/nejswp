import express from "express";
import {
  forgotLoad,
  forgotPassword,
  insertUser,
  loadHome,
  loadRegister,
  loadResetPassword,
  loginLoad,
  loginUser,
  resetPassword,
  userLogout,
  verifyEmail,
} from "../controllers/userController.js";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import { isLogin, isLogout } from "../middleware/auth.js";

//resolve es path module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//user route
const user_route = express();
//session middleware
user_route.use(
  session({
    name: `daffyduck`,
    secret: "some-secret-example",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // This will only work if you have https enabled!
      maxAge: 60000, // 1 min
    },
  })
);
//setup view ingine
user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

//middleware
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

//setup multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });
//load registration file for render
user_route.get("/register", isLogout, loadRegister);
//registration
user_route.post("/register", upload.single("image"), insertUser);
//verify email
user_route.get("/verify", verifyEmail);
//lodad login file for render
user_route.get("/", isLogout, loginLoad);
user_route.get("/login", isLogout, loginLoad);
// login
user_route.post("/login", loginUser);
// load home file for render
user_route.get("/home", isLogin, loadHome);
//logout
user_route.get("/logout",isLogin,userLogout)
//load gorgot file for render
user_route.get("/forgot",isLogout,forgotLoad)
//forgot 
user_route.post("/forgot",forgotPassword)
//load reset password file for render
user_route.get("/forgot-password",isLogout,loadResetPassword)
//reset password
user_route.post("/forgot-password",resetPassword)
export { user_route };
