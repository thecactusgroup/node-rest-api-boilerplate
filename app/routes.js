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

// Users
/**
 * @api {get} /users/ Get all users
 * @apiGroup Users
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "success":"true", 
 *      [
 *        {
 *         	"firstname": "Jonh",
 *         	"lastname": "Doe"
 *        }
 *      ]
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.get('/users', UsersController.findAll);
/**
 * @api {post} /users/ Create user
 * @apiGroup Users
 * @apiParam {String} firstname User firstname
 * @apiParam {String} lastname User lastname
 * @apiParam {String} username User username
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * @apiParam {String} role=user User role
 * @apiParamExample {json} Input
 *    {
 *      "firstname": "Jonh",
 *      "lastname": "Doe"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "success":"true",
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.post('/users', UsersController.create);
/**
 * @api {post} /users/ Get current user
 * @apiGroup Users
  * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "success":"true", 
 *      [
 *        {
 *         	"firstname": "Jonh",
 *         	"lastname": "Doe"
 *        }
 *      ]
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.get('/users/me', authenticate, UsersController.fetch);
/**
 * @api {put} /users/me Update current user
 * @apiGroup Users
 * @apiParam {String} firstname User firstname
 * @apiParam {String} lastname User lastname
 * @apiParam {String} username User username
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * @apiParam {String} role User role
 * @apiParamExample {json} Input
 *    {
 *      "firstname": "Jonh",
 *      "lastname": "Doe"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "success":"true",
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.put('/users/me', authenticate, UsersController.update);
/**
 * @api {delete} /users/me Delete current user
 * @apiGroup Users
 * @apiParam {String} username User username
 * @apiParamExample {json} Input
 *    {
 *      "firstname": "Jonh",
 *      "lastname": "Doe"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "success":"true",
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.delete('/users/me', authenticate, UsersController.delete);
/**
 * @api {get} /users/:username Find user by Username
 * @apiGroup Users
 * @apiParam {String} username User username
 * @apiParamExample {json} Input
 *    {
 *      "username": "Jonh"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "firstname": "Jonh",
 *      "lastname": "Doe"
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.get('/users/:username', UsersController._populate, UsersController.fetch);

// Post
/**
 * @api {get} /posts Get all posts
 * @apiGroup Posts
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "text": "text"
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.get('/posts', PostsController.search);
/**
 * @api {post} /posts Create new post
 * @apiGroup Posts
 * @apiParam {String} text Post text
 * @apiParamExample {json} Input
 *    {
 *      "text": "text",
 *      "_user": "user"	
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "success": "true"
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.post('/posts', authenticate, PostsController.create);
/**
 * @api {get} /posts/:id Get post by id
 * @apiGroup Posts
 * @apiParam {String} _id Post id
 * @apiParamExample {json} Input
 *    {
 *      "text": "text",
 *      "_id": "_id"	
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "text": "text"	
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.get('/posts/:id', PostsController._populate, PostsController.fetch);
/**
 * @api {delete} /posts/:id Delete post by id
 * @apiGroup Posts
 * @apiParam {String} _id Post id
 * @apiParamExample {json} Input
 *    {
 *      "_id": "_id"	
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "success": "true"	
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.delete('/posts/:id', authenticate, PostsController.delete);

// Admin
routes.get('/admin', accessControl('admin'), MetaController.index);

routes.use(errorHandler);

export default routes;
