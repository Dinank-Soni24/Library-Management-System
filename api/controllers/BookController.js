/**
 * BookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { v4: uuidv4 } = require("uuid");
module.exports = {
  addBook: async (req, res) => {
    //it set the coming header language
    const lang = req.getLocale();
    sails.hooks.i18n.setLocale(lang);

    //get the book name and email from body
    const { name, categoryId, authorId, price, publishYear } = req.body;

    //check body data is coming or not
    if (!name || !categoryId || !authorId || !price || !publishYear) {
      return res.status(400).json({
        message: sails.__("book.dataNotCome"),
      });
    } else {
      if (publishYear.length === 4) {
        try {
          //get id from helper
          const id = await sails.helpers.generateId();
          const categoryIds = categoryId.split(',');
          const authorIds = authorId.split(',');
          //find author & category in database
          const author = await Author.findOne({ id: { in: authorIds} });
          const category = await Category.find({ id: { in: categoryIds} });
          console.log(category);


          // check author and category is in database or not.
          if (author.length === 0 || category.length === 0) {
            return res.status(404).json({
              message: {
                message: sails.__("data.notFound"),
              },
            });
          } else {
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
            // const nebBookCategory = await BookCategory.create({
            //   id: await sails.helpers.generateId(),
            //   bookId: newBook.id,
            //   categoryId: categoryId,
            // }).fetch();
            const newBookCategory = await BookCategory.createEach(categoryIds.map(category => ({
              id: uuidv4(),
              bookId: newBook.id,
              categoryId: category,
            })));

            return res.status(201).json({
              message: sails.__("book.created"),
              book: newBook,
              author: newBookAuthor,
              category: newBookCategory,
            });
          }
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
    //it set the coming header language
    const lang = req.getLocale();
    sails.hooks.i18n.setLocale(lang);

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
      sort: "createdAt DESC",
    })
      .populate("categoryId", {
        where: { name: { contains: searchCategory } },
      })
      .populate("authorId", { where: { name: { contains: searchAuthor } } });

    //check book data is coming or not
    if (books.length === 0) {
      return res.status(409).json({
        message: sails.__("book.notFound"),
      });
    } else {
      // filter category and author for search
      const result = books.filter(
        (book) => book.categoryId.length && book.authorId.length
      );

      //check result is coming or not
      if (result.length === 0) {
        return res.status(409).json({
          message: sails.__("book.notFound"),
        });
      } else {
        return res.status(200).json({
          message: sails.__("book.found"),
          count: result.length,
          book: result,
        });
      }
    }
  },

  updateBook: async (req, res) => {
    //it set the coming header language
    const lang = req.getLocale();
    sails.hooks.i18n.setLocale(lang);

    //get the book id from params and bookData from body
    const { id } = req.params;
    const { name, price, publishYear, categoryId, authorId } = req.body;

    if (name || price || publishYear || categoryId || authorId) {
      try {
        // update book with coming data from body
        const book = await Book.update(
          { id },
          { name: name, price: price, publishYear: publishYear }
        );

        // update bookAuthor with coming data from body
        const bookAuthor = await BookAuthor.update(
          { bookId: id },
          { authorId: authorId }
        );

        // update bookCategory with coming data from body
        const bookCategory = await BookCategory.update(
          { bookId: id },
          { categoryId: categoryId }
        );

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
      //it set the coming header language
      const lang = req.getLocale();
      sails.hooks.i18n.setLocale(lang);

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
    //it set the coming header language
    const lang = req.getLocale();
    sails.hooks.i18n.setLocale(lang);

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
      return res.status(409).json({
        message: sails.__("book.notFound"),
      });
    } else {
      // filter category and author for search
      const result = books.filter(
        (book) => book.categoryId.length && book.authorId.length
      );

      //check result is coming or not
      if (result.length === 0) {
        return res.status(409).json({
          message: sails.__("book.notFound"),
        });
      } else {
        return res.status(200).json({
          message: sails.__("book.found"),
          count: result.length,
          book: result,
        });
      }
    }
  },
};
