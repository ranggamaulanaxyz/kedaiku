export interface User {
  id: string;
  name: string;
  email?: string;
}
export interface Partner {
  id: string;
  name: string;
}

export interface Token {
  accessToken?: string;
  refreshToken?: string;
}
