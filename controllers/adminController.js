import randomstring from "randomstring";
import { comparePassword, hashedPassword } from "../helpers/hashPassword.js";
import userModel from "../models/userModel.js";
import sendResetAdminPasswordEmail from "../helpers/resetAdminPassword.js";

//load admin login
const loadAdminLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
};

//admin login
const adminLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);

  try {
    const userData = await userModel.findOne({ email: email });
    if (userData) {
      const match = await comparePassword(password, userData.password);
      if (match) {
        if (userData.is_admin === 0) {
          res.render("login", { message: "Invalid Credential" });
        } else {
          req.session.userId = userData._id;
          res.redirect("/admin/home");
        }
      } else {
        res.render("login", { message: "Invalid Credential" });
      }
    } else {
      res.render("login", { message: "Invalid Credential" });
    }
  } catch (error) {
    console.log(error);
  }
};

//load admin home
const loadAdminHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error);
  }
};

//logout
const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
};

//load admin forgot page
const loadAdminForgot = async (req, res) => {
  try {
    res.render("forgot");
  } catch (error) {
    console.log(error);
  }
};

//send link forgot admin password
const sendLinkForgotAdminPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await userModel.findOne({ email });
    if (userData) {
      if (userData.is_admin === 0) {
        res.render("forgot", { message: "Invalid Credential" });
      } else {
        const randomString = randomstring.generate();
        const updatedData = await userModel.updateOne(
          { email },
          { $set: { token: randomString } }
        );
        sendResetAdminPasswordEmail(userData.name, email, randomString);
        res.render("forgot", {
          message: "Please check your email to reset password",
        });
      }
    } else {
      res.render("forgot", { message: "Invalid Credential" });
    }
  } catch (error) {
    console.log(error);
  }
};

//load forgot admin password
const loadForgotAdminPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const userData = await userModel.findOne({ token });
    if (userData) {
      res.render("forgot-password", { userId: userData._id });
    } else {
      res.render("404", { message: "Page Not Found" });
    }
  } catch (error) {
    console.log(error);
  }
};
//forgot admin password
const forgotAdminPassword = async (req, res) => {
  const password = req.body.password;
  const userId = req.body.userId;
  console.log(password,userId)
  try {
    const hashPassword = await hashedPassword(password);
    const updatedData = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { password: hashPassword, token: "" } }
    );
    res.redirect("/admin")
  } catch (error) {
    console.log(error);
  }
};
//export methods
export {
  loadAdminHome,
  loadAdminLogin,
  adminLogin,
  logout,
  loadAdminForgot,
  sendLinkForgotAdminPassword,
  loadForgotAdminPassword,
  forgotAdminPassword,
};
