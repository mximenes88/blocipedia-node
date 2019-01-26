
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
    beforeEach((done) => {
        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("#create()", () => {
        it("should create a  Wiki object with a valid title and body", (done) => {
            Wiki.create({
                title: "The Hitchhiker's Guide to the Galaxy",
                body: "The first rule of space travel and other investigations",
            })
            .then((wiki) => {
                expect(wiki.title).toBe("The Hitchhiker's Guide to the Galaxy");
                expect(wiki.body).toBe("The first rule of space travel and other investigations");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
        it("should not create a wiki with a missing title or body", (done) => {
            Wiki.create({
                body: "The first rule of space travel and other investigations",
            })
            .then((wiki) => {
              Wiki.create({
                  title: "History of Space Exploration",
                  
              })
              .then((wiki) => {
                // the code in this block will not be evaluated since the validation error
                // will skip it. Instead, we'll catch the error in the catch block below
                // and set the expectations there
                done();
              })
              .catch((err) => {
                expect(err.message).toContain("Wiki.body cannot be null");
                expect(err.message).toContain("Wiki.title cannot be null");
                done();
              });
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
      
        });

        describe("#setUser", () => {
            it("should associate a wiki and an user together", (done) => {
                User.create({
                    email: "user@bloc.com",
                    password: "999999"
                })
                .then((user) => {
                    this.user = user;

                    Wiki.create({
                        title: "The Hitchhiker's Guide to the Galaxy",
                        body: "The first rule of space travel and other investigations",
                        userId: this.user.id
                    })
                    .then((wiki) => {
                        expect(wiki.userId).toBe(this.user.id);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    })
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
            });
        });
});
