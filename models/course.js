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
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      estimatedTime: DataTypes.STRING,
      materialsNeeded: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
