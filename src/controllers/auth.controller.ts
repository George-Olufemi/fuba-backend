import AuthService from '../services/auth.service';
import { Request, Response } from 'express';

const authService: AuthService = new AuthService();

class AuthController {
  public async onboarding(_req: Request, res: Response) {
    try {
      const response = await authService.signUp();
      return res.status(201).json(response);
    } catch (err: any) {
      throw err;
    }
  }

  public async login(_req: Request, res: Response) {
    try {
      const response = await authService.signIn();
      return res.status(201).json(response);
    } catch (err: any) {
      throw err;
    }
  }
}

export default AuthController;
