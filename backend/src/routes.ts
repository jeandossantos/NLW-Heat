import { Router } from 'express';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { CreateMessageController } from './controllers/CreateMessageController';
import { GetLast3MessagesController } from './controllers/GetLast3MessageController';
import { ProfileUserController } from './controllers/ProfileUserController';
import { ensureAuthenticated } from './middlewares/ensureAuthenticate';

const routes = Router();

routes.post('/authenticate', new AuthenticateUserController().handle);

routes.get('/profile', ensureAuthenticated, new ProfileUserController().handle)

routes.post('/messages', ensureAuthenticated, new CreateMessageController().handle);
routes.get('/messages/last3', new GetLast3MessagesController().handle);

export default routes;