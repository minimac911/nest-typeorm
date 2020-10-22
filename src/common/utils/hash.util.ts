import { genSalt, hash } from 'bcryptjs';

export class HashSaltResponse {
  hash: string;
  salt: string;
  constructor(hash, salt) {
    this.hash = hash;
    this.salt = salt;
  }
}

export default class HashUtil {
  public async hashPassword(password: string): Promise<HashSaltResponse> {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    return new HashSaltResponse(hashedPassword, salt);
  }

  public async checkHash(password: string, salt: string): Promise<boolean> {
    return false;
  }
}
