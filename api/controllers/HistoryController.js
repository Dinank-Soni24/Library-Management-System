/**
 * HistoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  issuedBook: async (req, res) => {
    //get user id from token
    const userId = req.userData.id;
    // console.log(userId);

    const bookId = req.body.bookId;

    if (!bookId) {
      return res.status(400).json({
        message: sails.__("book.dataNotCome"),
      });
    } else {
      //book issued
      const book = await Book.update(
        { id: bookId, issued: false },
        { issued: true }
      ).fetch();

      if (book.length === 0) {
        return res.status(404).json({
          message: sails.__("book.notFound"),
        });
      } else {
        //get id from helper
        const id = await sails.helpers.generateId();
        const history = await History.create({
          id,
          bookId,
          userId,
          returnBook: false,
        }).fetch();

        return res.status(200).json({
          message: sails.__("book.update"),
          book: book,
          history: history,
        });
      }
    }
  },

  returnBook: async (req, res) => {
    //get user id from token
    const userId = req.userData.id;

    const bookId = req.body.bookId;

    if (!bookId) {
      return res.status(400).json({
        message: sails.__("book.dataNotCome"),
      });
    } else {
      const history = await History.updateOne(
        {
          bookId: bookId,
          userId: userId,
          returnBook: false,
        },
        { returnBook: true }
      );

      if (!history) {
        return res.status(404).json({
          message: sails.__("history.notFound"),
        });
      } else {
        //book issued
        const book = await Book.update(
          { id: bookId, issued: true },
          { issued: false }
        ).fetch();

        if (book.length === 0) {
          return res.status(404).json({
            message: sails.__("book.notFound"),
          });
        } else {
          return res.status(200).json({
            message: sails.__("book.update"),
            book: book,
            history: history,
          });
        }
      }
    }
  },

  getHistory: async (req, res) => {
    // pagination
    const limit = req.query.limit || 2;
    const skip = req.query.skip || 0;

    const bookId = req.body.bookId;
    // console.log(req.body);

    if (!bookId) {
      return res.status(400).json({
        message: sails.__("book.dataNotCome"),
      });
    } else {
      //find all history from database
      const history = await History.find({
        where: { bookId: bookId },
        limit: limit,
        skip: skip,
      }).populate("bookId");

      if (history.length === 0) {
        return res.status(409).json({
          message: sails.__("history.notFound"),
        });
      } else {
        return res.status(200).json({
          message: sails.__("history.found"),
          history: history,
        });
      }
    }
  },
};
