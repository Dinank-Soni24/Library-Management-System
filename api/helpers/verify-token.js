const jwt = require("jsonwebtoken");
module.exports = {
  friendlyName: "Verify token",

  description: "",

  inputs: {
    token: {
      type: "string",
      required: true,
    },
  },
  exits: {
    success: {
      description: "All done.",
    },
    invalid: {
      description: "The provided token is invalid.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const { token } = inputs;
      //decode the token using jwt
      const decode = await jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findOne({ email: decode.email });

      if (token === user.token) {
        return exits.success(user);
      } else {
        return exits.invalid(error);
      }
    } catch (error) {
      return exits.invalid(error);
    }
  },
};
