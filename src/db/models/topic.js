'use strict';
module.exports = (sequelize, DataTypes) => {
  var Topic = sequelize.define('Topic', {
    title: DataTypes.STRING
  }, {});
  Topic.associate = function(models) {
    // associations can be defined here
  };
  return Topic;
};