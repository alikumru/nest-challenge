import { User } from '../entities/user.entity';
import * as jwt from 'jsonwebtoken';

const DEFAULT_EXPIRY_TIME = 90;
const DEFAULT_JWT_SECRET_STRING = 'myRandomS3cr3t';

export const signToken = async (
  user: User,
  expiryTime = DEFAULT_EXPIRY_TIME,
  secret = DEFAULT_JWT_SECRET_STRING,
): Promise<string> => {
  const payload: jwt.JwtPayload = {
    id: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * expiryTime,
    email: user.email,
  };
  try {
    const token = jwt.sign(payload, secret);
    return token;
  } catch (error) {
    throw new Error('ERROR_SIGNING_JWT_TOKEN');
  }
};

export const verifyToken = async (
  token: string,
  secret = DEFAULT_JWT_SECRET_STRING,
) => {
  // verify a token symmetric
  jwt.verify(token, secret, function (err, decoded) {
    console.log(decoded); // bar
  });

  try {
    return jwt.verify(token, secret, function (err, decoded) {
      console.log(decoded); // bar
      return decoded;
    });
  } catch (error) {
    throw new Error('ERROR_VERIFYING_JWT_TOKEN');
  }

  return '';
};
