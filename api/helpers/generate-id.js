const { v4: uuidv4 } = require("uuid");
module.exports = {


  friendlyName: 'Generate id',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function () {
    return uuidv4()
  }


};

