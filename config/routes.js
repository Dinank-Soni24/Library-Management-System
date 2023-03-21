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
  //user controller
  "POST /user/signup": "UserController.signup", //signup user
  "POST /user/login": "UserController.login", //login user
  "GET /user/logout": "UserController.logout", //logout user

  //category controller
  "POST /admin/category": "CategoryController.addCategory", // add category in database (unique name)
  "GET /admin/category": "CategoryController.getCategory", // get all category from database
  "POST /admin/category/:id": "CategoryController.updateCategory", //update category in database
  "DELETE /admin/category/:id": "CategoryController.deleteCategory", // deleted category from database

  //author controller
  "POST /admin/author": "AuthorController.addAuthor", // add author in database (unique email)
  "GET /admin/author": "AuthorController.getAuthor", // get all author from database
  "POST /admin/author/:id": "AuthorController.updateAuthor", // update author in database
  "DELETE /admin/author/:id": "AuthorController.deleteAuthor", //delete author from database

  // book controller
  "POST /admin/book": "BookController.addBook", // add book in database
  "GET /admin/book": "BookController.getBook", // get all book from database
  "POST /admin/book/:id": "BookController.updateBook", // update book in database
  "DELETE /admin/book/:id": "BookController.deleteBook", // delete book from database
  "GET /user/book": "BookController.availableBook", // available book for user

  //history controller
  "POST /user/book/issued": "HistoryController.issuedBook", // issued book history add when user buy book
  "POST /user/book/return": "HistoryController.returnBook", // update book history when user return the book
  "POST /admin/book/history": "HistoryController.getHistory", // check history by bookId only admin
};
