import userModel from "../models/userModel.js";
import { hashedPassword } from "../helpers/hashPassword.js";
import sendVerificationEmail from "../helpers/emailVerification.js";

//load register page
const loadRegister = async (req, res) => {
  try {
    res.render("registration");
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

export { loadRegister, insertUser, verifyEmail };
