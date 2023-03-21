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
      console.log(publishYear.length);
      return res.status(400).json({
        message: sails.__("book.dataNotCome"),
      });
    } else {
      if (publishYear.length === 4) {
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
      } else {
        return res.status(400).json({
          message: sails.__("book.notYearData"),
        });
      }
    }
  },

  getBook: async (req, res) => {
    // pagination
    const limit = req.query.limit || 2;
    const skip = req.query.skip || 0;

    //search query
    const searchName = req.query.name || "";
    const searchAuthor = req.query.author || "";
    const searchCategory = req.query.category || "";

    //find all book from database
    const books = await Book.find({
      where: {
        name: { contains: searchName },
      },
      limit: limit,
      skip: skip,
    })
      .populate("categoryId", {
        where: { name: { contains: searchCategory } },
      })
      .populate("authorId", { where: { name: { contains: searchAuthor } } });

    //check book data is coming or not
    if (books.length === 0) {
      return res.status(404).json({
        message: sails.__("book.notFound"),
      });
    } else {
      const result = books.filter(
        (book) => book.categoryId.length && book.authorId.length
      );
      if (result.length === 0) {
        return res.status(404).json({
          message: sails.__("book.notFound"),
        });
      } else {
        return res.status(200).json({
          message: sails.__("book.found"),
          book: result,
        });
      }
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

  availableBook: async (req, res) => {
    // pagination
    const limit = req.query.limit || 2;
    const skip = req.query.skip || 0;

    //search query
    const searchName = req.query.name || "";
    const searchAuthor = req.query.author || "";
    const searchCategory = req.query.category || "";

    //find all available book from database
    const books = await Book.find({
      where: {
        issued: false,
        name: { contains: searchName },
      },
      limit: limit,
      skip: skip,
    })
      .populate("authorId", { where: { name: { contains: searchAuthor } } })
      .populate("categoryId", {
        where: { name: { contains: searchCategory } },
      });

    //check book data is coming or not
    if (books.length === 0) {
      return res.status(404).json({
        message: sails.__("book.notFound"),
      });
    } else {
      const result = books.filter(
        (book) => book.categoryId.length && book.authorId.length
      );
      if (result.length === 0) {
        return res.status(404).json({
          message: sails.__("book.notFound"),
        });
      } else {
        return res.status(200).json({
          message: sails.__("book.found"),
          book: result,
        });
      }
    }
  },
};
