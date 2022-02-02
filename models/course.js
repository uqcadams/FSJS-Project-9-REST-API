"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    // Defining the One-to-One relationship
    static associate(models) {
      this.belongsTo(models.User, {
        // Synchronising association options across models
        as: "associatedUser",
        foreignKey: {
          fieldName: "userId",
          allowNull: false,
        },
      });
    }
  }
  Course.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A title is required.",
          },
          notEmpty: {
            msg: "Please provide a title.",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A description is required.",
          },
          notEmpty: {
            msg: "Please provide a description.",
          },
        },
      },
      estimatedTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
