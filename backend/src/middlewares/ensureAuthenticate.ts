import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';

interface IPayload {
    sub: string;
}
const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization;

    if (!authToken) return res.status(401).send('Token.invalid.');

    const [, token] = authToken.split(" ");

    try {
        const { sub } = verify(token, process.env.MY_SECRET) as IPayload;
        req.user_id = sub;
        return next();
    } catch (error) {
        return res.status(401).send('Token.invalid.');
    }
}

export {
    ensureAuthenticated
}