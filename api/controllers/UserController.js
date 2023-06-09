/* eslint-disable indent */
/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require("bcrypt");
const { Roles } = sails.config.constant;

module.exports = {
  signUp: async (req, res) => {
    //it set the coming header language
    const lang = req.getLocale();
    sails.hooks.i18n.setLocale(lang);

    //get the user's data from body
    const { name, email, password } = req.body;

    //check body data is coming or not
    if (!name || !email || !password) {
      return res.status(400).json({
        message: sails.__("user.dataNotCome"),
      });
    } else {
      try {
        // bcrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //get id from helper
        const id = await sails.helpers.generateId();

        // store user data in database
        const newUser = await User.create({
          id,
          name: name,
          email: email,
          password: hashedPassword,
          roles: Roles.User,
        });

        return res.status(201).json({
          message: sails.__("user.created"),
          user: newUser,
        });
      } catch (error) {
        return res.status(409).json({
          message: sails.__("user.exists"),
          error: error.toString(),
        });
      }
    }
  },

  login: async (req, res) => {
    //it set the coming header language
    const lang = req.getLocale();
    sails.hooks.i18n.setLocale(lang);

    // get the user's data from body
    const { email, password } = req.body;

    // find the user with email
    const user = await User.findOne({ email });

    //check user is exists or not
    if (!user) {
      return res.status(404).json({
        message: {
          message: sails.__("user.notfound", { lang }),
        },
      });
    } else {
      //compare the user password with body password
      const checkPassword = await bcrypt.compare(
        password,
        user.password
      );

      //check password is match or not
      if (checkPassword === true) {
        try {
          //generate the token using helper
          const token = await sails.helpers.generateToken(email, user.id, "8h");

          // store the token in database
          const userUpdate = await User.updateOne({ email }, { token: token });

          return res.status(200).json({
            message: sails.__("user.found"),
            token: token,
          });
        } catch (error) {
          return res.status(400).json({
            message: sails.__("user.notUpdate"),
            error: error,
          });
        }
      } else {
        return res.status(404).json({
          message: {
            message: sails.__("user.notfound"),
          },
        });
      }
    }
  },

  logout: async (req, res) => {
    //it set the coming header language
    const lang = req.getLocale();
    sails.hooks.i18n.setLocale(lang);

    try {
      // get the id from isLoggedIn policies
      const id = req.userData.id;

      //update the user token
      const user = await User.updateOne({ id }, { token: " " });
      res.status(200).json({
        message: sails.__("user.logout"),
      });
    } catch (error) {
      res.status(401).json({
        message: sails.__("user.notLogout"),
        error: error.toString(),
      });
    }
  },
};
