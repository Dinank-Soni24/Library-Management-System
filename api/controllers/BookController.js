/**
 * BookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  addBook: async (req, res) => {
    //get the book name and email from body
    const { name, categoryId, authorId, price, publishYear } = req.body;

    //check body data is coming or not
    if (!name || !categoryId || !authorId || !price || !publishYear) {
      return res.status(400).json({
        message: sails.__("book.dataNotCome"),
      });
    } else {
      try {
        //get id from helper
        const id = await sails.helpers.generateId();

        const newBook = await Book.create({
          id,
          name,
          price,
          publishYear,
          issued: false,
        }).fetch();

        // Add the bookId and authorId in BookAuthor
        const newBookAuthor = await BookAuthor.create({
          id: await sails.helpers.generateId(),
          bookId: newBook.id,
          authorId: authorId,
        }).fetch();

        // Add the bookId and categoryId in BookCategory
        const nebBookCategory = await BookCategory.create({
          id: await sails.helpers.generateId(),
          bookId: newBook.id,
          categoryId: categoryId,
        }).fetch();

        return res.status(201).json({
          message: sails.__("book.created"),
          book: newBook,
          author: newBookAuthor,
          category: nebBookCategory,
        });
      } catch (error) {
        return res.status(404).json({
          message: {
            message: sails.__("book.notCreated"),
            error: error.toString(),
          },
        });
      }
    }
  },

  getBook: async (req, res) => {
    try {
      // pagination
      const limit = req.query.limit || 2;
      const skip = req.query.skip || 0;
      //find all book from database
      const book = await Book.find({ limit: limit, skip: skip })
        .populate("categoryId")
        .populate("authorId");

      return res.status(200).json({
        message: sails.__("book.exists"),
        book: book,
      });
    } catch (error) {
      return res.status(409).json({
        message: sails.__("book.notExists"),
        error: error,
      });
    }
  },

  updateBook: async (req, res) => {
    //get the book id from params and bookData from body
    const { id } = req.params;
    const { name, price, publishYear, categoryId, authorId } = req.body;

    if (name || price || publishYear || categoryId || authorId) {
      try {
        const book = await Book.update(
          { id },
          { name: name, price: price, publishYear: publishYear }
        ).fetch();
        const bookAuthor = await BookAuthor.update(
          { bookId: id },
          { authorId: authorId }
        ).fetch();
        const bookCategory = await BookCategory.update(
          { bookId: id },
          { categoryId: categoryId }
        ).fetch();
        return res.status(200).json({
          message: sails.__("book.update"),
          book: book,
          author: bookAuthor,
          category: bookCategory,
        });
      } catch (error) {
        return res.status(409).json({
          message: sails.__("book.notUpdate"),
          error: error.toString(),
        });
      }
    } else {
      return res.status(400).json({
        message: sails.__("book.dataNotCome"),
      });
    }
  },

  deleteBook: async (req, res) => {
    try {
      //get the book id from params
      const { id } = req.params;

      //delete book from database
      const book = await Book.destroy({ id }).fetch();

      //check the author is deleted or not
      if (book.length === 0) {
        return res.status(404).json({
          message: sails.__("book.notFound"),
        });
      } else {
        return res.status(200).json({
          message: sails.__("book.delete"),
          book: book,
        });
      }
    } catch (error) {
      return res.status(409).json({
        message: sails.__("book.notDeleted"),
        error: error.toString(),
      });
    }
  },
};
