'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: DataTypes.STRING
  }, {});
  Wiki.associate = function(models) {
    // associations can be defined here
  };
  return Wiki;
};