import userModel from "../models/userModel.js";
import { comparePassword, hashedPassword } from "../helpers/hashPassword.js";
import sendVerificationEmail from "../helpers/emailVerification.js";
import randomstring from "randomstring";
import sendResetPasswordEmail from "../helpers/resetPassword.js";

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
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

//load forgot page
const forgotLoad = async (req, res) => {
  try {
    res.render("forgot");
  } catch (error) {
    console.log(error);
  }
};

//forgot password
const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    //find user
    const userData = await userModel.findOne({ email });
    if (userData) {
      if (userData.is_verified === 0) {
        res.render("forgot", { message: "Please verify your email." });
      } else {
        const randomString = randomstring.generate();
        const updatedData = await userModel.updateOne(
          { email },
          { $set: { token: randomString } }
        );
        sendResetPasswordEmail(userData.name, email, randomString);
        res.render("forgot", {
          message: "Please check your mail to reset your password.",
        });
      }
    } else {
      res.render("forgot", { message: "User email is incorrect." });
    }
  } catch (error) {
    console.log(error);
  }
};

//load reset password page
const loadResetPassword = async (req, res) => {
  const token = req.query.token;

  try {
    const tokenData = await userModel.findOne({ token });
    if (tokenData) {
      res.render("forgot-password", { userId: tokenData._id });
    } else {
      res.render("404", { message: "Page Not Found" });
    }
  } catch (error) {
    console.log(error);
  }
};

//reset password
const resetPassword = async (req, res) => {
  const password = req.body.password;
  const cpassword = req.body.cpassword;
  const userId = req.body.userId;
  //matching password
  if (password != cpassword) {
    res.render("forgot-password", { message: "Password does not match." });
  }
  //hashed password
  const hashPassword = await hashedPassword(password);
  const updatedData = await userModel.findByIdAndUpdate(
    { _id: userId },
    { $set: { password: hashPassword, token: "" } }
  );
  res.redirect("/");
  try {
  } catch (error) {
    console.log(error);
  }
};

//load verification page
const loadVerification = (req, res) => {
  try {
    res.render("verification");
  } catch (error) {
    console.log(error);
  }
};

//send verification link
const sendVerificationLink=async(req,res)=>{
  try {
    const email=req.body.email
    const userData=await userModel.findOne({email})
    if(userData){
       if(userData.is_verified!=0){
        res.render("verification",{message:"Email allready verified."})
       }else{
        sendVerificationEmail(userData.name,email,userData._id)
        res.render("verification",{message:"Verification link were sended on your email Please check."})
       }
    }else{
      res.render("verification",{message:"This email does not exist."})
    }
  } catch (error) {
    console.log(error)
  }
}

//export methods
export {
  loadRegister,
  insertUser,
  verifyEmail,
  loginLoad,
  loginUser,
  loadHome,
  userLogout,
  forgotLoad,
  forgotPassword,
  loadResetPassword,
  resetPassword,
  loadVerification,
  sendVerificationLink
};
