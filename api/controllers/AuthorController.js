/**
 * AuthorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  addAuthor: async (req, res) => {
    //get the author name and email from body
    const { name, email } = req.body;

    //check body data is coming or not
    if (!name || !email) {
      return res.status(400).json({
        message: sails.__("author.dataNotCome"),
      });
    } else {
      try {
        //get id from helper
        const id = await sails.helpers.generateId();

        // store author data in database
        const newAuthor = await Author.create({
          id,
          name,
          email,
        }).fetch();

        return res.status(201).json({
          message: sails.__("author.created"),
          author: newAuthor,
        });
      } catch (error) {
        return res.status(409).json({
          message: sails.__("author.exists"),
          error: error,
        });
      }
    }
  },

  getAuthor: async (req, res) => {
    // pagination
    const limit = req.query.limit || 2;
    const skip = req.query.skip || 0;
    //search query
    const searchName = req.query.name || "";
    //find all author from database
    const author = await Author.find({
      where: {
        name: { contains: searchName },
      },
      limit: limit,
      skip: skip,
    });
    //check book data is coming or not
    if (author.length === 0) {
      return res.status(404).json({
        message: sails.__("author.notFound"),
      });
    } else {
      return res.status(200).json({
        message: sails.__("author.found"),
        count: author.length,
        author: author,
      });
    }
  },

  updateAuthor: async (req, res) => {
    //get the author id from params and name from body
    const { id } = req.params;
    const { name, email } = req.body;

    if (name || email) {
      try {
        //update author data in database using author id
        const author = await Author.update(
          { id },
          { name: name, email: email }
        ).fetch();

        //check the author is update or not
        if (author.length === 0) {
          return res.status(404).json({
            message: sails.__("author.notFound"),
          });
        } else {
          return res.status(200).json({
            message: sails.__("author.update"),
            author: author,
          });
        }
      } catch (error) {
        return res.status(409).json({
          message: sails.__("author.notUpdate"),
          error: error.toString(),
        });
      }
    } else {
      return res.status(400).json({
        message: sails.__("author.dataNotCome"),
      });
    }
  },

  deleteAuthor: async (req, res) => {
    try {
      //get the author id from params
      const { id } = req.params;

      //delete author from database
      const author = await Author.destroy({ id }).fetch();

      //check the author is deleted or not
      if (author.length === 0) {
        return res.status(404).json({
          message: sails.__("author.notFound"),
        });
      } else {
        return res.status(200).json({
          message: sails.__("author.delete"),
          author: author,
        });
      }
    } catch (error) {
      return res.status(409).json({
        message: sails.__("author.notDeleted"),
        error: error.toString(),
      });
    }
  },
};
