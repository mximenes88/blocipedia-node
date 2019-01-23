'use strict';
module.exports = (sequelize, DataTypes) => {
  var Topic = sequelize.define('Wiki', {
    title: DataTypes.STRING
  }, {});
  Topic.associate = function(models) {
    // associations can be defined here
  };
  return Wiki;
};