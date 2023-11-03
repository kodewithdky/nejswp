import nodemailer from "nodemailer";

//send verify email
const sendVerificationEmail = async (name, email, userId) => {
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
      subject: "For Verification Email",
      html:
        "<p>HI! " +
        name +
        ', Please click here to <a href="http://localhost:7070/verify?id=' +
        userId +
        '" target="_blank">Verify </a> your mail. </p>',
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

export default sendVerificationEmail;
