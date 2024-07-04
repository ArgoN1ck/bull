import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

const DEFAULT_SALT_LENGTH = 16;

@Injectable()
export class HashingService {
  private logger = new Logger(HashingService.name);

  hashPassword(target: string): string {
    try {
      const salt = this.generateSalt();
      const hash = this.hashWithSalt(target, salt);

      return `${salt}:${hash}`;
    } catch (err: any) {
      this.logger.warn(err.message);
      throw err;
    }
  }

  compare(target: string, hash: string): boolean {
    const [salt, storedHash] = hash.split(':');

    const hashOfInput = this.hashWithSalt(target, salt);

    return hashOfInput === storedHash;
  }

  private generateSalt(): string {
    return crypto.randomBytes(DEFAULT_SALT_LENGTH).toString('hex');
  }

  private hashWithSalt(hash: string, salt: string): string {
    const _hash = crypto.createHmac('sha256', salt);
    _hash.update(hash);
    return _hash.digest('hex');
  }
}
