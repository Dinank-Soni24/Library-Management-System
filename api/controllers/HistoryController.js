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
      console.log(bookId);
      //book issued
      const book = await Book.update(
        { id: bookId, issued: true },
        { issued: false }
      ).fetch();
      console.log(book);

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
        }).fetch();

        return res.status(200).json({
          message: sails.__("book.update"),
          book: book,
          history: history,
        });
      }
    }
  },
};
