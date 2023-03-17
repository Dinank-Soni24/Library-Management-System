/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

const bcrypt = require("bcrypt");
module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return console.log(1);;
  // }

  const user = await User.findOne({roles: 'a'});
  const { Roles } = sails.config.constant;
  const { v4: uuidv4 } = require('uuid');
  const hashedPassword = await bcrypt.hash('123456', 10);
  if (!user) {
    await User.createEach([

      { id: uuidv4(),name: 'Dinank Soni',email: 'dinank@soni.com',  password: hashedPassword, roles: Roles.Admin},

    ]);
  }

// console.log(User.count());
  // await User.createEach([

  //   { name: 'Dinank Soni',email: 'dinank@soni.com',  password: 123456, roles: 'a'},
  //   // { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

};
