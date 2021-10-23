import axios from 'axios';
import { prismaClient } from '../prisma';
import { sign } from 'jsonwebtoken';

interface IAcessTokenResponse {
  access_token: string;
}

interface UserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticatedUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token';

    const { data: acessTokenResponse } = await axios.post<IAcessTokenResponse>(
      url,
      null,
      {
        params: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code
        },
        headers: {
          Accept: 'application/json'
        }
      }
    );

    const response = await axios.get<UserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          authorization: `Bearer ${acessTokenResponse.access_token}`
        }
      }
    );

    const { login, name, avatar_url, id } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          name,
          avatar_url
        }
      });
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id
        }
      },
      process.env.TOKEN_SECRET,
      {
        subject: user.id,
        expiresIn: '1d'
      }
    );

    return { token, user };
  }
}

export { AuthenticatedUserService };
