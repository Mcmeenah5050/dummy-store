import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import createHttpError from "http-errors";

export default async function mailService({
  from,
  to,
  subject,
  text,
  username,
  link,
  btnText,
  instructions,
}) {
  try {
    if (!to || !subject || !text) {
      throw createHttpError(
        500,
        "Email recipient, subject and text are required"
      );
    }

    //initialize mailgen
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Instapics",
        link: process.env.CLIENT_URL,
      },
    });

    //Email template configuration
    const email = {
      body: {
        name: username,
        intro: text,
        action: {
          instructions:
            instructions ||
            "To get started with Instapics, please click the button below",
          button: {
            color: "#22BC66",
            text: btnText || "Visit",
            link: link || process.env.CLIENT_URL,
          },
        },
        outro: "Need help, or have questions? Reply to this email",
      },
    };

    //Generate email HTML
    const emailBody = mailGenerator.generate(email);

    //validate SMTP configuration (SMTP is the protocols for sending emails)
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      throw createHttpError(500, "Email service not properly configurd");
    }

    //create email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    //Verify transporter connection
    await transporter.verify().catch((error) => {
      throw createHttpError(
        500,
        `Failed to connect to email service: ${error.message}`
      );
    });
    
    //send email
    const info = await transporter.sendMail({
      from: from || `Instapics <${process.env.EMAIL}>`,
      to: to,
      subject: subject,
      html: emailBody,
    });

    //log success only in dev mode
    if (process.env.NODE_ENV === "development") {
      console.log("Email sent successfully");
      console.log("Message Id:", info.messageId);
    }
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email service error:", error);
    throw createHttpError(500, "Failed to send email. Please try again later");
  }
}
