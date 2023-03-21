/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  UserController: {
    'logout': ['isLoggedIn']
  },
  HistoryController: {
    'issuedBook': ['isLoggedIn','isUser'],
    'returnBook': ['isLoggedIn','isUser'],
    'getHistory': ['isLoggedIn','isAdmin'],
  },
  categoryController: {
    '*': ['isLoggedIn','isAdmin'],
  },
  authorController: {
    '*': ['isLoggedIn','isAdmin'],
  },
  bookController: {
    'addBook': ['isLoggedIn','isAdmin'],
    'getBook': ['isLoggedIn','isAdmin'],
    'updateBook': ['isLoggedIn','isAdmin'],
    'deleteBook': ['isLoggedIn','isAdmin'],
    'availableBook': ['isLoggedIn','isUser'],
  }

};
