import Mailgen from "mailgen";
import nodermailer from "nodemailer";

import type { Content } from "mailgen";

import { config } from "../config/config";
import logger from "../config/logger";
import { ApiError } from "../middlewares/error.middleware";

interface Options {
  email: string;
  subject: string;
  mailgenContent: Content;
}

const sendEmail = async (options: Options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Budget Tracker",
      link: "https://budget-trackerlink.com",
    },
  });
  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHTML = mailGenerator.generate(options.mailgenContent);

  const transporter = nodermailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  const mail = {
    from: config.smtp.user,
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHTML,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    logger.error("Failed to send email", {
      mailTo: mail.to,
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
    throw new ApiError(
      500,
      "Email sending service fail. Please use 'resend' option."
    );
  }
};

const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string
) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we'are excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgetPasswordMailgenContent = (
  username: string,
  passwordResetUrl: string
) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions:
          "To reset your password click on the following button or link",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgetPasswordMailgenContent,
};
