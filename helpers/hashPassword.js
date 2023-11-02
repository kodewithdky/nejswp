import bcrypt from "bcrypt";

const hashedPassword = (password) => {
  try {
    let salt = bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (error) {
    console.warn(error);
  }
};

const comparePassword = (password, hashPassword) => {
  try {
    return bcrypt.compare(password, hashPassword);
  } catch (error) {
    console.warn(error);
  }
};

export { hashedPassword, comparePassword };
