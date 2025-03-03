// mail options
export interface MailOptions {
  to: string;
  html: string;
  subject: string;
  from?: string;
  text?: string;
  fromName?: string;
  attachments?: any;
  template?: string;
  context?: MailContext;
}

export type MailContext = {
  fullName?: string;
  username?: string;
  email?: string;
  pasword?: string;
  code?: string;
  expiresIn?: number | string;
  extLink?: string;
  otherLinks?: string;
  date?: string;
  baseUrl?: string;

  [key: string]: any;
};

export interface MailOptionsV2 {
  to: string;
  subject: string;
  template: string;
  context: MailContext;
  from?: string;
  text?: string;
  attachments?: any;
}
