"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    // Defining the One-to-Many relationship
    static associate(models) {
      this.hasMany(models.Course, {
        // Synchronising association options across models
        as: "associatedUser",
        foreignKey: {
          fieldName: "userId",
          allowNull: false,
        },
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A first name is required.",
          },
          notEmpty: {
            msg: "Please provide a first name.",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A last name is required.",
          },
          notEmpty: {
            msg: "Please provide a last name.",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "An email address is required.",
          },
          notEmpty: {
            msg: "Please provide an email address.",
          },
          isEmail: {
            args: true,
            msg: "Please provide a valid email format",
          },
        },
      },
      password: {
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
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
