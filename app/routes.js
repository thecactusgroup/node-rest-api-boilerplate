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


/**
* @apiDefine HeaderAuthorization
* @apiHeader {String} Authorization Bearer [token]
* @apiHeaderExample {json} Header-Example:
*     {
*       "Authorization": "eyJh..."
*     }
*
* @apiErrorExample {json} Token error
 *    HTTP/1.1 401 
 *    {
 *      "Unauthorized"
 *    }
*/


// Authentication
/**
 * @api {post} /auth/login Authentication
 * @apiGroup Login
 * @apiParam {String} username username
 * @apiParam {String} password password
 * @apiParamExample {json} Input
 *    {
 *      "username": "john perez",
 *      "password": "password1"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200
 *    {
 *      "token":"eyJh..."
 *    }
 * @apiErrorExample {json} Login error
 *    HTTP/1.1 401 
 *    {
 *      "message": "Please verify your credentials"
 *    }
 *    HTTP/1.1 500 Internal Server Error
 */
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
 *			"updatedAt": "2018-02-06T12:35:59.819Z",
 *			"createdAt": "2018-02-06T12:35:59.819Z",
 *			"username": "jamesdean",
 *			"email": "example@gmail.com",
 *			"role": "user",
 *			"id": "5a79a12f2ca0fe10402f7b78"
 *		  }
 *      ]
 *    }
 * @apiErrorExample {json} Get error
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
 * @apiUse HeaderAuthorization
 * @apiParamExample {json} Input
 *    {
 *      "firstname": "Jonh",
 *      "lastname": "Doe",
 *      "username": "johndoe",
 *      "email": "example@email.com",
 *      "password": "supersecret"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "success":"true",
 *    }
 * @apiErrorExample {json} Create error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.post('/users', authenticate, UsersController.create);
/**
 * @api {post} /users/ Get current user
 * @apiGroup Users
 * @apiUse HeaderAuthorization
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
 * @apiErrorExample {json} Get error
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
 * @apiUse HeaderAuthorization
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
 * @apiUse HeaderAuthorization
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
 * @apiErrorExample {json} Delete error
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
 *      "updatedAt": "2018-02-06T12:35:59.819Z",
 *      "createdAt": "2018-02-06T12:35:59.819Z",
 *      "username": "jamesdean",
 *      "email": "example@gmail.com",
 *      "role": "user",
 *      "id": "5a79a12f2ca0fe10402f7b78"
 *    }
 * @apiErrorExample {json} Get error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.get('/users/:username', UsersController._populate, UsersController.fetch);

// Post
/**
 * @api {get} /posts Get all posts
 * @apiGroup Posts
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204
 *    [
 *      {
 *         "_id": ObjectId('5a79a2f33d9a491219b36da4'),
 *         "updatedAt": ISODate('2018-02-06T12:43:31.443Z'),
 *         "createdAt": ISODate('2018-02-06T12:43:31.443Z'),
 *         "text": "Vero maiores magni vel omnis et.",
 *         "_user": ObjectId('5a79a2f33d9a491219b36da3'),
 *         "__v": 0
 *      }
 *    ]
 * @apiErrorExample {json} Get error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.get('/posts', PostsController.search);
/**
 * @api {post} /posts Create new post
 * @apiGroup Posts
 * @apiUse HeaderAuthorization
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
 * @apiErrorExample {json} Create error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.post('/posts', authenticate, PostsController.create);
/**
 * @api {get} /posts/:id Get post by id
 * @apiGroup Posts
 * @apiUse HeaderAuthorization
 * @apiParam {String} _id Post id
 * @apiParamExample {json} Input
 *    {
 *      "_id": "id"	
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 
 *    {
 *      "_id": ObjectId('5a79a2f33d9a491219b36da4'),
 *      "updatedAt": ISODate('2018-02-06T12:43:31.443Z'),
 *      "createdAt": ISODate('2018-02-06T12:43:31.443Z'),
 *      "text": "Vero maiores magni vel omnis et.",
 *      "_user": ObjectId('5a79a2f33d9a491219b36da3'),
 *      "__v": 0	
 *    }
 * @apiErrorExample {json} Get error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.get('/posts/:id', PostsController._populate, PostsController.fetch);
/**
 * @api {delete} /posts/:id Delete post by id
 * @apiGroup Posts
 * @apiUse HeaderAuthorization
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
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
routes.delete('/posts/:id', authenticate, PostsController.delete);

// Admin
routes.get('/admin', accessControl('admin'), MetaController.index);

routes.use(errorHandler);

export default routes;
