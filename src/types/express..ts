import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      id: string; // o cualquier campo que quieras agregar
      // ejemplo: email?: string;
    };
  }
}
