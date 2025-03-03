// import moment from 'moment';

/**
 * Content of the mail sent after a user registers containing the verificatio code that they'll be using to verify their email account
 * @param username Receiver's username
 * @param code Email verification code
 * @param subject Subject of the message
 * @returns {Object} HTML, text, and subject of the email
 */
export const emailVerificationTemplate = (
  username: string,
  code: number | string,
  subject?: string,
) => {
  return {
    subject: subject || `[${code}] Verify your account`,

    text: `Hello ${username}! Welcome to the  Co Foundation family. We are so thrilled to have you onboard! Please use the code, ${code}, to verify your email.`,

    html: ` <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>
                      *,
                      * > * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        color: #5a5858;
                      }
  
                      .container {
                        padding-inline: 1rem;
                      }
  
                      .container p {
                        margin-bottom: 1rem;
                        line-height: 1.5;
                      }
  
                      main {
                        width: 90%;
                        margin-inline: auto;
                        max-width: 620px;
                        font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
                      }
  
                      header {
                        padding: 1.75rem;
                        border-bottom: 1px solid #f7b946d7;
                      }
  
                      header img {
                        max-width: 120px;
                        display: inline;
                      }
  
                      .body {
                        padding: 2rem 1.1rem;
                      }
  
                      h1 {
                        font-size: 1rem;
                        margin-bottom: 1rem;
                        color: #000;
                      }
  
                      h3 {
                        margin-bottom: 1rem;
                        margin-top: 1rem;
                        color: #000;
                      }
  
                      .footer {
                        width: 80%;
                        margin: 1rem auto;
                        padding: 1rem;
                        text-align: center;
                      }
  
                      .footer small {
                        color: #b1b0b0;
                        font-size: 10px;
                        text-align: center;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <main>
                        <header>
                          <img
                            src="https://res.cloudinary.com/doszbexiw/image/upload/v1711805286/HireUs_Logistics_Logo_hg21lo.png"
                            alt="logo"
                          />
                        </header>
                        <div class="body">
                          <h1>Hello ${username},</h1>
                          <p>
                            Welcome to the  Co Foundation family! We are so thrilled to have you
                            onboard. <br />
                            And we have so many exciting features in stock for you. But first,
                            let us verify your email.
                          </p>
                          <p>Here's you verification code</p>
                          <h3>${code}</h3>
                        </div>
  
                        <div class="footer">
                          <small
                            >This message was intended for ${username}. If you did not sign up
                            on  Co Foundation&trade;, <br />please ignore this email.</small
                          >
                        </div>
                      </main>
                    </div>
                  </body>
                </html>`,
  };
};
/**
 * Content of the mail sent when a user requests for email verification token to be resent
 * @param username Receiver's username
 * @param code Email verification code
 * @param subject Subject of the message
 * @returns {Object} HTML, text, and subject of the email
 */
export const emailVerificationResendTemplate = (
  username: string,
  code: number | string,
  subject?: string,
) => {
  return {
    subject: subject || `[${code}] Activate your account`,

    text: `Hello ${username}, please use the code, ${code}, to activate your account.`,

    html: ` <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>
                      *,
                      * > * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        color: #5a5858;
                      }
  
                      .container {
                        padding-inline: 1rem;
                      }
  
                      .container p {
                        margin-bottom: 1rem;
                        line-height: 1.5;
                      }
  
                      main {
                        width: 90%;
                        margin-inline: auto;
                        max-width: 620px;
                        font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
                      }
  
                      header {
                        padding: 1.75rem;
                        border-bottom: 1px solid #f7b946d7;
                      }
  
                      header img {
                        max-width: 120px;
                        display: inline;
                      }
  
                      .body {
                        padding: 2rem 1.1rem;
                      }
  
                      h1 {
                        font-size: 1rem;
                        margin-bottom: 1rem;
                        color: #000;
                      }
  
                      h3 {
                        margin-bottom: 1rem;
                        margin-top: 1rem;
                        color: #000;
                      }
  
                      .footer {
                        width: 80%;
                        margin: 1rem auto;
                        padding: 1rem;
                        text-align: center;
                      }
  
                      .footer small {
                        color: #b1b0b0;
                        font-size: 10px;
                        text-align: center;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <main>
                        <header>
                          <img
                            src="https://res.cloudinary.com/doszbexiw/image/upload/v1711805286/HireUs_Logistics_Logo_hg21lo.png"
                            alt="logo"
                          />
                        </header>
                        <div class="body">
                          <h1>Hello ${username},</h1>
                          <p>
                            Please use the code below to activate your account:
                          </p>
                          <h3>${code}</h3>
                        </div>
  
                        <div class="footer">
                          <small
                            >This message was intended for ${username}. If you did not sign up
                            on  Co Foundation&trade;, <br />please ignore this email.</small
                          >
                        </div>
                      </main>
                    </div>
                  </body>
                </html>`,
  };
};

/**
 * Content of the mail sent after a user requests to change their password. This email contains the verification code used to initiate a psasword reset
 * @param username Receiver's username
 * @param code Email verification code
 * @param subject Subject of the message
 * @returns {Object} HTML, text, and subject of the email
 */
export const resetPasswordTemplate = (
  username: string,
  code: number | string,
  subject?: string,
) => {
  return {
    subject: subject || `[${code}] Reset your password`,

    text: `Dear ${username}, you requested to reset your password on  Co Foundation. Use the 4-digit token below to initiate a password reset.`,

    html: ` <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <style>
                    *,
                    * > * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                      color: #5a5858;
                    }
  
                    .container {
                      padding-inline: 1rem;
                    }
  
                    main {
                      width: 90%;
                      margin-inline: auto;
                      max-width: 620px;
                    }
  
                    header {
                      padding: 1.75rem;
                      border-bottom: 1px solid #f7b946d7;
                    }
  
                    header img {
                      max-width: 120px;
                      display: inline;
                    }
  
                    .body {
                      padding: 2rem 1.1rem;
                    }
  
                    h1 {
                      font-size: 1rem;
                      margin-bottom: 1rem;
                      color: #000;
                    }
  
                    h3 {
                      margin-bottom: 1rem;
                      margin-top: 1rem;
                      color: #000;
                    }
  
                    .ps {
                      width: 80%;
                      margin: 1rem auto;
                      padding: 1rem;
                      text-align: center;
                    }
  
                    .ps small {
                      color: #b1b0b0;
                      font-size: 10px;
                      text-align: center;
                    }
  
                    @media screen and (min-width: 768px) {
                    .body, 
                    header, 
                    main,
                    .container {
                      background-color: #fff;
                      }
                    } 
                  </style>
                </head>
                <body>
                  <div class="container">
                    <main>
                      <header>
                          <img
                              src="https://res.cloudinary.com/doszbexiw/image/upload/v1711805286/HireUs_Logistics_Logo_hg21lo.png"
                              alt="logo"
                          />
                      </header>
                      <div class="body">
                        <h1>Dear ${username},</h1>
                        <p>
                          You requested to reset your password on
                          <strong> Co Foundation&trade;.</strong> Use the 4-digit code below to
                          initiate a password reset.
                        </p>
                        <h3>${code}</h3>
                        <p>This code is valid for the next 15 minutes.</p>
                      </div>
  
                      <div class="ps">
                        <small>This message was intended for ${username}. If you did not request a
                          password reset from  Co Foundation&trade;, please ignore this email.</small>
                      </div>
                    </main>
                  </div>
                </body>
              </html>`,
  };
};

/**
 * Content of the mail sent after a user successfully changes or updates their password.
 * @param username Receiver's username
 * @param subject Subject of the message
 * @param timestamp Date object
 * @returns {Object} HTML, text, and subject of the email
 */
export const newPasswordSuccessTemplate = (
  username: string,
  subject?: string,
  timestamp: Date = new Date(),
) => {
  return {
    subject: subject || 'Password changed successfully',

    text: `Dear ${username}, your password has been successfully updated. Timestamp: ${timestamp}`,

    html: ` <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <style> 
                    *,
                    * > * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                      color: #5a5858;
                    }
  
                    .container {
                      padding-inline: 1rem;
                    }
  
                    main {
                      width: 90%;
                      margin-inline: auto;
                      max-width: 620px;
                    }
  
                    header {
                      padding: 1.75rem;
                      border-bottom: 1px solid #f7b946d7;
                    }
  
                    header img {
                      max-width: 120px;
                      display: inline;
                    }
  
                    .body {
                      padding: 2rem 1.1rem;
                    }
  
                    h1 {
                      font-size: 1rem;
                      margin-bottom: 1rem;
                      color: #000;
                    }
  
                    h3 {
                      margin-bottom: 1rem;
                      margin-top: 1rem;
                      color: #000;
                    }
  
                    .ps {
                      width: 80%;
                      margin: 1rem auto;
                      padding: 1rem;
                      text-align: center;
                    }
  
                    .ps small {
                      color: #b1b0b0;
                      font-size: 10px;
                      text-align: center;
                    }
  
                    .timestamp {
                      margin-top: 1rem;
                    }
  
                    @media screen and (min-width: 768px) {
                    .body, 
                    header, 
                    main,
                    .container {
                      background-color: #fff;
                      }
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <main>
                      <header>
                        <img
                          src="https://res.cloudinary.com/doszbexiw/image/upload/v1711805286/HireUs_Logistics_Logo_hg21lo.png"
                          alt="logo"
                        />
                      </header>
                      <div class="body">
                        <h1>Dear ${username},</h1>
                        <p>
                          You have successfully updated your login password on
                          <strong> Co Foundation&trade;.</strong>
                        </p>
                        <p class="timestamp">
                          <strong>Timestamp: </strong> ${
                            (new Date(), 'MMMM Do YYYY, h:mm:ss a')
                          }
                        </p>
                      </div>
  
                      <div class="ps">
                        <small>This message was intended for ${username}. If you did not initiate a
                          password update on Co Foundation&trade;, please ignore this email.</small>
                      </div>
                    </main>
                  </div>
                </body>
              </html>`,
  };
};

// ${
//     moment(timestamp).format(
//   'MMMM Do YYYY, h:mm:ss a',
// )}
