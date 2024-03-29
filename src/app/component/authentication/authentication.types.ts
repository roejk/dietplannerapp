export type UserRegisterModel = {
  username: string;
  email: string;
  password: string;
};

export type UserLoginModel = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};
