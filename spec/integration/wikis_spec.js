const request = require ("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require ("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;


describe("routes : wikis", () =>{
    beforeEach((done) =>{
        this.wiki;
        this.user;

        sequelize.sync({force:true}).then((res) =>{
            User.create({
                email:"mximenes@utopia.com",
                password: "123456"
            })
            .then((user) =>{
                
            })
        })






    });
  

})