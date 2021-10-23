import { Request, Response } from 'express';
import { AuthenticatedUserService } from '../services/AuthenticatedUserService';

class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { code } = request.body;

    const service = new AuthenticatedUserService();

    try {
      const result = await service.execute(code);

      return response.json(result);
    } catch (err) {
      return response.json({ error: err.message });
    }
  }
}

export { AuthenticateUserController };
