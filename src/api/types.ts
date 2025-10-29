// src/api/types.ts

export type SignupDto = {
  email: string;
};

export type VerifyEmailDto = {
  email: string;
  code: string;
};

export type CreatePasswordDto = {
  password: string;
  // createPassword expects token in body per your controller signature,
  // but the service code you posted accepts token as separate param.
  // We'll call the endpoint with { token, password }.
};

export type LoginDto = {
  email: string;
  password: string;
};

export type CreatePinDto = {
  pin: string;
};
