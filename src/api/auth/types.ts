export interface RegisterInterface {
  username: string;
  email: string;
  password: string;
}

export type ResetPasswordInterface = {
  token: string;
  email: string;
  password: string;
};
