
'use strict';
const faker = require('faker');

let users = [];
for (let i = 1; i <= 25; i++) {
	users.push({
		email: faker.internet.email(),
		password: faker.internet.password(),
		role: faker.random.arrayElement(),
		createdAt: new Date(),
		updatedAt: new Date(),
	});
}

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Users', users, {});
  }
};

  