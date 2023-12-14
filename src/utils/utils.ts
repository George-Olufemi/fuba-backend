import { logger, InternalServerException, Httpcode } from '../helper';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

class Utils {
  public async randomFileName(): Promise<string> {
    let randomFileName: string;
    const byte = 16;
    const randomHexCode = crypto.randomBytes(byte).toString('hex');
    const timestamp = Date.now().toString();
    randomFileName = `${randomHexCode}_${timestamp}`;
    return randomFileName;
  }

  public async hashPayload(payload: string): Promise<string> {
    const salt = Number(process.env.SALT);
    return await bcrypt.hash(payload, salt);
  }

  public async dehashPayload(payload: string, hashedPayload: string) {
    return await bcrypt.compare(payload, hashedPayload);
  }
}

export default Utils;
