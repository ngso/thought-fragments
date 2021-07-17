import validator from 'validator';

const { isEmail, isEmpty, isLength } = validator;

export const validate = (args: Record<string, string>) => {
  for (const [key, value] of Object.entries(args)) {
    if (isEmpty(value)) {
      throw new Error(`${key} cannot be empty`);
    }

    if (key === 'email' && !isEmail(value)) {
      throw new Error('Invalid email');
    }

    if (key === 'password' && !isLength(value, { min: 8 })) {
      throw new Error('Password must be at least 8 characters long');
    }
  }
};
