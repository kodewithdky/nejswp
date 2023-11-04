//check login
const isLogin = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
//check logout
const isLogout = async (req, res, next) => {
  try {
    if (req.session.userId) {
      return res.redirect("/admin");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export { isLogin, isLogout };
