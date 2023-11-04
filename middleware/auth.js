const isLogin = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      res.redirect("/");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.userId) {
      res.redirect("/home");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export { isLogin, isLogout };
