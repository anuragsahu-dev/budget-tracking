"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const mailgen_1 = __importDefault(require("mailgen"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../config/logger"));
async function sendEmail(options) {
    const mailGenerator = new mailgen_1.default({
        theme: "default",
        product: {
            name: "Budget Tracker",
            link: config_1.config.server.clientUrl,
        },
    });
    const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHTML = mailGenerator.generate(options.mailgenContent);
    const transporter = nodemailer_1.default.createTransport({
        host: config_1.config.smtp.host,
        port: config_1.config.smtp.port,
        auth: {
            user: config_1.config.smtp.user,
            pass: config_1.config.smtp.pass,
        },
    });
    const mail = {
        from: config_1.config.smtp.user,
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHTML,
    };
    try {
        await transporter.sendMail(mail);
        logger_1.default.info("Email sent successfully", {
            to: mail.to,
            subject: mail.subject,
        });
    }
    catch (error) {
        logger_1.default.error("Failed to send email", {
            to: mail.to,
            subject: mail.subject,
            error: error instanceof Error ? error.message : error,
        });
        throw error;
    }
}
