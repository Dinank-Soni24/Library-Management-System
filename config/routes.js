/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "POST /user/signup": "UserController.signup", //signup user
  "POST /user/login": "UserController.login", //login user
  "GET /user/logout": "UserController.logout", //logout user

  "POST /admin/category": "CategoryController.addCategory", // add category in database (unique name)
  "GET /admin/category": "CategoryController.getCategory", // get all category from database
  "POST /admin/category/:id": "CategoryController.updateCategory", //update category in database
  "DELETE /admin/category/:id": "CategoryController.deleteCategory", // deleted category from database

  "POST /admin/author": "AuthorController.addAuthor", // add author in database (unique email)
  "GET /admin/author": "AuthorController.getAuthor", // get all author from database
  "POST /admin/author/:id": "AuthorController.updateAuthor", // update author in database
  "DELETE /admin/author/:id": "AuthorController.deleteAuthor",

  "POST /admin/book": "BookController.addBook",
  "GET /admin/book": "BookController.getBook",
  "POST /admin/book/:id": "BookController.updateBook",
  "DELETE /admin/book/:id": "BookController.deleteBook",
};
