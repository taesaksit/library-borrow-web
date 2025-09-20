export interface TLoginReq {
  email: string;
  password: string;
}

export interface TLoginRes {
  access_token: string;
  token_type: string;
}
