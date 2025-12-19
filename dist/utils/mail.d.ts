import type { Content } from "mailgen";
interface SendEmailOptions {
    email: string;
    subject: string;
    mailgenContent: Content;
}
export declare function sendEmail(options: SendEmailOptions): Promise<void>;
export {};
