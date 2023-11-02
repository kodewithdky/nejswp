import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    let con = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      `Database Connected Successfully ${con.connection.host}`.bgWhite.green
    );
  } catch (error) {
    console.log(`Error while connecting database ${error}`.bgRed.white);
  }
};

export default dbConnection;
