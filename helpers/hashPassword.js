import bcrypt from "bcrypt";
//hashing password
const hashedPassword = async (password) => {
  try {
    let salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.warn(error);
  }
};
//conparing password
const comparePassword = async (password, hashPassword) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    console.warn(error);
  }
};

export { hashedPassword, comparePassword };
