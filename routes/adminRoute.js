import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import multer from "multer";
import {
  addNewUser,
  adminDashboard,
  adminLogin,
  editUserDetails,
  forgotAdminPassword,
  loadAddUser,
  loadAdminForgot,
  loadAdminHome,
  loadAdminLogin,
  loadEditUser,
  loadForgotAdminPassword,
  logout,
  sendLinkForgotAdminPassword,
} from "../controllers/adminController.js";
import { isAdminLogin, isAdminLogout } from "../middleware/adminAuth.js";

//admin route
const admin_route = express();

//resolve es path module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//session middleware
admin_route.use(express.static("public"));
admin_route.use(
  session({
    name: `daffyduck`,
    secret: "some-secret-example",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // This will only work if you have https enabled!
      maxAge: 7 * 24 * 3600 * 1000, // 1 week
    },
  })
);

//setup view ingine
admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");

//setup body-parser middleware
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

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

//routes

//export route
//load login file for render
admin_route.get("/", isAdminLogout, loadAdminLogin);

//admin login
admin_route.post("/", adminLogin);
//load home file for render
admin_route.get("/home", isAdminLogin, loadAdminHome);
//logout
admin_route.get("/admin/logout", isAdminLogin, logout);
//load admin forgot page for render
admin_route.get("/forgot", isAdminLogout, loadAdminForgot);
//send link for forgot admin password
admin_route.post("/forgot", sendLinkForgotAdminPassword);
//loadforget andmin password
admin_route.get("/forgot-password", isAdminLogout, loadForgotAdminPassword);
//forgot admin password
admin_route.post("/forgot-password", forgotAdminPassword);
//admin dashbord
admin_route.get("/dashboard", isAdminLogin, adminDashboard);
//load add user page for render
admin_route.get("/new-user", isAdminLogin, loadAddUser);
//add user
admin_route.post("/new-user",upload.single("image"), addNewUser);
//load edit user page for render
admin_route.get("/edit-user",isAdminLogin,loadEditUser)
admin_route.post("/edit-user",editUserDetails)
//any route
admin_route.get("/*", function (req, res) {
  res.redirect("/admin");
});
export { admin_route };
