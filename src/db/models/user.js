'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.INTEGER,
     },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    name :{
      type: DataTypes.INTEGER,
    },
    role:{
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wiki, {
			foreignKey: 'userId',
			as: 'wikis',
    });
  }
    User.prototype.isStandard = function() {
      return this.role === "standard";
    };
    User.prototype.isAdmin = function() {
      return this.role === "admin";
    };
    User.prototype.isPremium = function() {
      return this.role === "premium";
    };
  return User;
}