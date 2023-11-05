import randomstring from "randomstring";
import excelJS from "exceljs";
import { comparePassword, hashedPassword } from "../helpers/hashPassword.js";
import userModel from "../models/userModel.js";
import sendResetAdminPasswordEmail from "../helpers/resetAdminPassword.js";
import sendAddedUserEmail from "../helpers/addUserMail.js";

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
    const userData = await userModel.findById({ _id: req.session.userId });

    res.render("home", { admin: userData });
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
  console.log(password, userId);
  try {
    const hashPassword = await hashedPassword(password);
    const updatedData = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { password: hashPassword, token: "" } }
    );
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
};

//admin dashboard
const adminDashboard = async (req, res) => {
  let search = "";
  if (req.query.search) {
    search = req.query.search;
  }

  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  const limit = 5;
  try {
    const userData = await userModel
      .find({
        __v: 0,
        $or: [
          { name: { $regex: ".*" + search + ".*", $options: "i" } },
          { email: { $regex: ".*" + search + ".*", $options: "i" } },
          { mobile: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await userModel
      .find({
        __v: 0,
        $or: [
          { name: { $regex: ".*" + search + ".*", $options: "i" } },
          { email: { $regex: ".*" + search + ".*", $options: "i" } },
          { mobile: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
      })
      .countDocuments();

    res.render("admin-dashboard", {
      users: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
  }
};

//load add user
const loadAddUser = (req, res) => {
  try {
    res.render("new-user");
  } catch (error) {
    console.log(error);
  }
};

//add new user
const addNewUser = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const password = randomstring.generate(8);
  const image = req.file.filename;
  console.log(name, email, mobile, password, image);
  try {
    const hashPassword = await hashedPassword(password);
    const user = await new userModel({
      name,
      email,
      mobile,
      image,
      is_admin: 0,
      password: hashPassword,
    });

    const userData = await user.save();
    if (userData) {
      sendAddedUserEmail(name, email, password, userData._id);
      return res.redirect("/admin/dashboard");
    } else {
      res.render("new-user", {
        message: "Something went wrong while adding new user.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//load edit user
const loadEditUser = async (req, res) => {
  const id = await req.query.id;
  try {
    const userData = await userModel.findById({ _id: id });
    if (userData) {
      res.render("edit-user", { user: userData });
    } else {
      res.render("edit-user", { message: "Something went wrong." });
    }
  } catch (error) {
    console.log(error);
  }
};
//edit user details
const editUserDetails = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const is_verified = req.body.is_verified;
  const is_admin = req.body.is_admin;
  const id = req.body.id;
  console.log(name, email, mobile, is_verified, is_admin, id);
  try {
    const updatedData = await userModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          email,
          mobile,
          is_verified,
          is_admin,
        },
      }
    );
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
};

//delete user
const deleteUser = async (req, res) => {
  const id = req.query.id;
  try {
    const user = await userModel.deleteOne({ _id: id });
    if (user) {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error);
  }
};

//export user
const exportUsers = async (req, res) => {
  try {
    const workbook = new excelJS.Workbook();
    const workSheet = workbook.addWorksheet("My Users");
    workSheet.columns = [
      { headers: "S no.", key: "s_no" },
      { headers: "Name", key: "name" },
      { headers: "Email", key: "email" },
      { headers: "Phone", key: "mobile" },
      { headers: "Image", key: "image" },
      { headers: "Admin", key: "is_admin" },
      { headers: "Verified", key: "is_verified" },
    ];

    let counter = 1;
    const usersData = await userModel.find({ __v: 0 });
    usersData.forEach((user) => {
      user.s_no = counter;
      workSheet.addRow(user);

      workSheet.getRow(counter).eachCell((cell) => {
        cell.font = { bold: true };
      });
      counter++;
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=users.xlsx`);
    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
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
  adminDashboard,
  loadAddUser,
  addNewUser,
  loadEditUser,
  editUserDetails,
  deleteUser,
  exportUsers,
};
