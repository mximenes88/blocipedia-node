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
      type: DataTypes.STRING,
    },
    role:{
      type: DataTypes.STRING,
      defaultValue:"standard"
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
    User.hasMany(models.Collaborator, {
			foreignKey: 'userId',
			as: 'collaborators',
		});

    User.prototype.isStandard = function() {
      return this.role === "standard";
    };
    User.prototype.isAdmin = function() {
      return this.role === "admin";
    };
    User.prototype.isPremium = function() {
      return this.role === "premium";
    };
  }
  return User;
}