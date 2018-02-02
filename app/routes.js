import { Router } from 'express';

import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import PostsController from './controllers/posts.controller';

import authenticate from './middleware/authenticate';
import accessControl from './middleware/access-control';
import errorHandler from './middleware/error-handler';

const routes = new Router();

routes.get('/', MetaController.index);

// Authentication
routes.post('/auth/login', AuthController.login);


firstname: String,
  lastname: String,
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required.'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Email is required'],
    validate: {
      validator(email) {
        // eslint-disable-next-line max-len
        const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
        return emailRegex.test(email);
      },
      message: '{VALUE} is not a valid email.',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  role: {
    type: String,
    default: 'user',
  },

// Users
/**
 * @api {get} /users/ Get users
 * @apiGroup Users
 * @apiParam {String} firstname User firstname
 * @apiParam {String} lastname User lastname
 * @apiParam {String} username User username
 * @apiParam {String} email User email
 * @apiParam {String} role User role
 * @apiParamExample {json} Input
 *    {
 *      "firstname": "Jonh",
 *      "lastname": "Doe"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 { success:"true", {
 *      "firstname": "Jonh",
 *      "lastname": "Doe"
 *    }}
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.get('/users', UsersController.search);


routes.post('/users', UsersController.create);
routes.get('/users/me', authenticate, UsersController.fetch);
routes.put('/users/me', authenticate, UsersController.update);
routes.delete('/users/me', authenticate, UsersController.delete);
routes.get('/users/:username', UsersController._populate, UsersController.fetch);

// Post
routes.get('/posts', PostsController.search);
routes.post('/posts', authenticate, PostsController.create);
routes.get('/posts/:id', PostsController._populate, PostsController.fetch);
routes.delete('/posts/:id', authenticate, PostsController.delete);

// Admin
routes.get('/admin', accessControl('admin'), MetaController.index);

routes.use(errorHandler);

export default routes;
