export interface Account {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  requiresDynamicPin: boolean;
  createdAt: string;
}

export interface PinResponse {
  row_number: number;
  TIMESTAMP: number;
  CODIGO: number;
}