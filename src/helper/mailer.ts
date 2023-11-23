import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { logger } from './logger';

dotenv.config();
class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  public async sendVerificationMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"Lekzzicon From FUBA" ${process.env.SMTP_SENDER}`,
        to,
        subject,
        html,
      };
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Message sent to ${to} with message ID: ${info.messageId}`);
    } catch (err: any) {
      logger.error(err.message);
      throw err;
    }
  }
}

export default MailerService;
