import crypto from 'crypto';

const signEmail = (email: string) =>
  process.env.CRISP_SECRET_KEY
    ? crypto
        .createHmac('sha256', process.env.CRISP_SECRET_KEY)
        .update(email)
        .digest('hex')
    : null;

export default signEmail;
