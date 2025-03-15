import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

import { UsersService } from '../users.service';

@Injectable()
export class FirebaseAdminService {
  private app: admin.app.App;

  constructor(@Inject() private usersServie: UsersService) {
    const fbPrivateKeyPath = path.join(process.cwd(), 'fb_pk.json');

    const serviceAccount = JSON.parse(
      fs.readFileSync(fbPrivateKeyPath, 'utf8'),
    ) as ServiceAccount;

    if (!admin.apps.length) {
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      this.app = admin.app();
    }
  }

  getAuth(): admin.auth.Auth {
    return this.app.auth();
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return this.getAuth().verifyIdToken(idToken);
  }

  async googleAuth(idToken: string) {
    const {
      email,
      picture,
      firebase: { sign_in_provider: provider },
    } = await this.verifyIdToken(idToken);

    let user = await this.usersServie.findUserByEmail(email);

    if (user) {
      if (provider === 'google.com') {
        if (!user.google_auth)
          throw new ForbiddenException(
            'This account was not registered using Google. Log in with email and password instead.',
          );

        return user;
      }
    } else {
      // sign up new user using google email, if no user exists already
      if (provider === 'google.com') {
        user = await this.usersServie.create({
          email,
          google_auth: true,
          avatarUrl: picture.replace('s96-c', 's384-c'),
        });
      }
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
    return this.getAuth().getUserByEmail(email);
  }

  async createUser(
    email: string,
    password: string,
  ): Promise<admin.auth.UserRecord> {
    return this.getAuth().createUser({ email, password });
  }
}
