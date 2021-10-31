import axios from 'axios';
import prisma from '../prisma';
import { sign } from 'jsonwebtoken';

interface IAccessTokenResponse {
    access_token: string;
}

interface IUserResponse {
    id: number;
    name: string;
    avatar_url: string;
    login: string;
}

export class AuthenticateUserService {
    async execute(code: string) {
        const url = 'https://github.com/login/oauth/access_token';

        const data = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            headers: {
                "Accept": "application/json"
            }
        });

        const response = await axios.get<IUserResponse>('http://api.github.com/user', {
            headers: {
                authorization: `Bearer ${data.data.access_token}`
            }
        });

        const { id, name, avatar_url, login } = response.data;

        let user = await prisma.user.findFirst({
            where: {
                github_id: id
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    github_id: id,
                    name,
                    login,
                    avatar_url,
                }
            });
        }

        const token = sign(
            {
                id: user.id,
                name: user.name,
                avatar_url: user.avatar_url
            },
            process.env.MY_SECRET,
            {
                subject: user.id,
                expiresIn: '1d'
            });

        return { user, token }
    }
}