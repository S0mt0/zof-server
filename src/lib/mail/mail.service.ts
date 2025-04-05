import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { APP_NAME, GOOGLE_APP_PASSWORD, GOOGLE_APP_USER } from '../constants';

@Global()
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private sender: string;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get(GOOGLE_APP_USER),
        pass: this.configService.get(GOOGLE_APP_PASSWORD),
      },
    });

    this.sender = `${APP_NAME} <${this.configService.get(GOOGLE_APP_USER)}>`;
  }

  async send(options: {
    subject: string;
    to: string;
    html?: string;
    text?: string;
  }) {
    return await this.transporter.sendMail({ ...options, from: this.sender });
  }
}
