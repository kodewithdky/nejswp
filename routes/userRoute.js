import express from "express";
import {
  editUserProfile,
  forgotLoad,
  forgotPassword,
  insertUser,
  loadEditProfile,
  loadHome,
  loadRegister,
  loadResetPassword,
  loadVerification,
  loginLoad,
  loginUser,
  resetPassword,
  sendVerificationLink,
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
user_route.use(express.static("public"))
user_route.use(
  session({
    name: `daffyduck`,
    secret: "some-secret-example",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // This will only work if you have https enabled!
      maxAge: 7 * 24 * 3600 * 1000, // 1 hour
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
//load email verifcation page for rander
user_route.get("/verification",loadVerification) 
//verification
user_route.post("/verification",sendVerificationLink)
//load profile edit page for render
user_route.get("/edit-user-profile",isLogin,loadEditProfile)
//edit profile
user_route.post("/edit-user-profile",upload.single("image"),editUserProfile)


//export route
export { user_route };
