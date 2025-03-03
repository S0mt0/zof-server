import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { APP_NAME } from '../lib/constants/utils';
import { MailOptions, MailOptionsV2 } from './type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private viewPath: string;
  private sender: string;

  constructor(
    private configservice: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.sender = `${APP_NAME} <${configservice.get<string>('GOOGLE_AUTH_USER')}>`;
    this.viewPath = path.join(__dirname, '..', '..', 'views', 'emails');
  }

  /**
   * Sends emails using nodemailer and gmail as mail service
   * @param payload [MailOptions]
   */
  async viaNodemailer(payload: MailOptions) {
    const { from, html, text, subject, attachments, to } = payload;

    const mailOptions = {
      from: from || this.sender,
      to,
      subject,
      html,
      text,
      attachments,
    };

    return await this.mailerService.sendMail(mailOptions);
  }

  /**
   * Sends emails using nodemailer and gmail as mail service
   * @param payload [MailOptionsV2]
   */
  async send(payload: MailOptionsV2) {
    const { from, subject, to, template, context } = payload;

    const mailOptions: MailOptionsV2 = {
      from: from || this.sender,
      to,
      subject,
      template,
      context,
    };

    // const options: NodemailerExpressHandlebarsOptions = {
    //   viewEngine: {
    //     extname: ".handlebars",
    //     partialsDir: this.viewPath,
    //     defaultLayout: false,
    //   },
    //   viewPath: this.viewPath,
    //   extName: ".handlebars",
    // };

    // transporter.use("compile", htmlToText({ wordwrap: 130 }));
    // transporter.use("compile", hbs(options));

    return await this.mailerService.sendMail(mailOptions);
  }
}
