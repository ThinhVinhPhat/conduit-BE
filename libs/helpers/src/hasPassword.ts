const bcrypt = require('bcrypt');

export const hasPassword = async (password: string, salt: number) => {
  const Salt = await bcrypt.genSalt(salt);
  const hashedPassword = await bcrypt.hash(password, Salt);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};
