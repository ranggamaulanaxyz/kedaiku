export interface User {
  id: string;
  name: string;
}

export interface Token {
  accessToken?: string;
  refreshToken?: string;
}
