//check admin is login
const isAdminLogin = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/admin");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

//check admin is logout
const isAdminLogout = async (req, res, next) => {
  try {
    if (req.session.userId) {
      return res.redirect("/admin/home");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export { isAdminLogin, isAdminLogout };
