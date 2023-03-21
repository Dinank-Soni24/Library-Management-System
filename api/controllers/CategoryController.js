/* eslint-disable indent */
/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  addCategory: async (req, res) => {
    //get the category name from body
    const { name } = req.body;

    //check body data is coming or not
    if (!name) {
      return res.status(400).json({
        message: sails.__("category.dataNotCome"),
      });
    } else {
      try {
        //get id from helper
        const id = await sails.helpers.generateId();

        // store category data in database
        const newCategory = await Category.create({
          id,
          name,
        }).fetch();

        return res.status(201).json({
          message: sails.__("category.created"),
          category: newCategory,
        });
      } catch (error) {
        return res.status(409).json({
          message: sails.__("category.exists"),
          error: error,
        });
      }
    }
  },

  getCategory: async (req, res) => {
    // pagination
    const limit = req.query.limit || 2;
    const skip = req.query.skip || 0;
    //search query
    const searchName = req.query.name || "";
    //find all category from database
    const category = await Category.find({
      where: {
        name: { contains: searchName },
      },
      limit: limit,
      skip: skip,
    });
    //check book data is coming or not
    if (category.length === 0) {
      return res.status(409).json({
        message: sails.__("category.notFound"),
      });
    } else {
      return res.status(200).json({
        message: sails.__("category.found"),
        category: category,
      });
    }
  },

  updateCategory: async (req, res) => {
    //get the category id from params and name from body
    const { id } = req.params;
    const { name } = req.body;

    //check body data is coming or not
    if (!name) {
      return res.status(400).json({
        message: sails.__("category.dataNotCome"),
      });
    } else {
      try {
        //update category data in database using category id
        const category = await Category.updateOne(
          { id },
          { name: name }
        );
        //check the category is update or not
        if (!category) {
          return res.status(404).json({
            message: sails.__("category.notFound"),
          });
        } else {
          return res.status(200).json({
            message: sails.__("category.update"),
            category: category,
          });
        }
      } catch (error) {
        return res.status(409).json({
          message: sails.__("category.notUpdate"),
          error: error.toString(),
        });
      }
    }
  },

  deleteCategory: async (req, res) => {
    try {
      //get the category id from params
      const { id } = req.params;

      //delete category from database
      const category = await Category.destroy({ id }).fetch();
      console.log(category);

      //check the category is deleted or not
      if (category.length === 0) {
        return res.status(404).json({
          message: sails.__("category.notFound"),
        });
      } else {
        return res.status(200).json({
          message: sails.__("category.deleted"),
          category: category,
        });
      }
    } catch (error) {
      return res.status(409).json({
        message: sails.__("category.notDeleted"),
        error: error.toString(),
      });
    }
  },
};
