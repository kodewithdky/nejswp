import userModel from "../models/userModel.js";
import { comparePassword, hashedPassword } from "../helpers/hashPassword.js";
import sendVerificationEmail from "../helpers/emailVerification.js";

//load register page
const loadRegister = async (req, res) => {
  try {
    await res.render("registration");
  } catch (error) {
    console.warn(error);
  }
};

//register
const insertUser = async (req, res) => {
  //hashing password
  let hashPassword = await hashedPassword(req.body.password);
  try {
    const user = await new userModel({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      image: req.file.filename,
      is_admin: 0,
      password: hashPassword,
    });
    //save user data
    let userData = await user.save();
    //send response
    if (userData) {
      sendVerificationEmail(req.body.name, req.body.email, userData._id);
      res.render("registration", {
        message: "Registration Successfully. Please verify your email.",
      });
    } else {
      res.render("registration", { message: "Registration Failed" });
    }
  } catch (error) {
    console.warn(error);
  }
};

//verify email
const verifyEmail = async (req, res) => {
  try {
    const updateInfo = await userModel.updateOne(
      { _id: req.query.id },
      { $set: { is_verified: 1 } }
    );

    console.log(updateInfo);
    res.render("emailVerified");
  } catch (error) {
    console.log(error.message);
  }
};

//load login page
const loginLoad = async (req, res) => {
  try {
    await res.render("login");
  } catch (error) {
    console.log(error);
  }
};

//login
const loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    //find user
    const userData = await userModel.findOne({ email: email });
    if (userData) {
      //copare password
      const match = await comparePassword(password, userData.password);
      if (match) {
        if (userData.is_verified === 0) {
          res.render("login", { message: "Please verify your email." });
        } else {
          req.session.userId = userData._id;
          res.redirect("/home");
        }
      } else {
        res.render("login", { message: "Invalid credential." });
      }
    } else {
      res.render("login", { message: "Invalid credential." });
    }
  } catch (error) {
    console.log(error);
  }
};

//load home page
const loadHome = (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error);
  }
};

//logout
const userLogout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect("/")
  } catch (error) {
    console.log(error);
  }
};
export {
  loadRegister,
  insertUser,
  verifyEmail,
  loginLoad,
  loginUser,
  loadHome,
  userLogout
};
