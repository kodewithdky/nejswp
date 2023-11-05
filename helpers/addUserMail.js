import nodemailer from "nodemailer";

//send verify email
const sendAddedUserEmail = async (name, email, password, userId) => {
  try {
    //creating transporter
    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    //creating mail options
    const message = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "Admin added you verify your email.",
      html:
        "<p>HI! " +
        name +
        ', Please click here to <a href="http://localhost:7070/verify?id=' +
        userId +
        '" target="_blank">Verify </a> your email. </p> <br/> <b>Email: </b> ' +
        email +
        "<br/> <b>Password: </b>" +
        password +
        "",
    };
    //send email
    await transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email has been send:", info.response);
      }
    });
  } catch (error) {
    console.warn(error);
  }
};

export default sendAddedUserEmail;
