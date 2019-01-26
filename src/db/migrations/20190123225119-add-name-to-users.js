'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
       return queryInterface.addColumn(
         "Users",
         "name",

         {
          type: DataTypes.STRING,
  
         }
       )
      
    
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.removeColumn("Users", "name");
  }
};
