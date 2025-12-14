import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import type { Content } from "mailgen";
import { config } from "../config/config";
import logger from "../config/logger";

interface SendEmailOptions {
  email: string;
  subject: string;
  mailgenContent: Content;
}

/**
 * Send email using Nodemailer and Mailgen
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Budget Tracker",
      link: config.server.clientUrl,
    },
  });

  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHTML = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
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
    logger.info("Email sent successfully", {
      to: mail.to,
      subject: mail.subject,
    });
  } catch (error) {
    logger.error("Failed to send email", {
      to: mail.to,
      subject: mail.subject,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}
