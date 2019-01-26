const request = require("request");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const server = require("../../src/server");
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
	beforeEach((done) => {
		this.wiki;
		this.user;

		sequelize.sync({force: true}).then((res) => {
			User.create({
				email: "morganax@bloc.com",
				password: "17777777"
			})
			.then((user) => {
				this.user = user;

				Wiki.create({
					title: "Baby Rhino",
					body: "World's cutest animal",
					userId: this.user.id
				})
				.then((wiki) => {
					this.wiki = wiki;
					done();
				})
			})
		});
	});

	describe("GET /wikis", () => {
		it("should return a status code 200 and a list of all the wikis", (done) => {
			request.get(base, (err, res, body) => {
				expect(res.statusCode).toBe(200);
				expect(err).toBeNull();
				expect(body).toContain("Wikis");
				expect(body).toContain("Baby Rhino");
				done();
			});
		});
	});

	describe("GET /wikis/new", () => {
		it("should render a form for creating new wikis", (done) => {
			request.get(`${base}new`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("New Wiki");
				done();
			});
		});
	});

	describe("GET /wikis/create", () => {
		it("should create a new wiki and redirect", (done) => {
			const options = {
				url: `${base}create`,
				form: {
					title: "Snow Owls",
					body: "The second cutest animals",
					userId: this.user.id
				}
			};
		
			request.post(options, (err, res, body) => {
				console.log(res.statusMessage);
				Wiki.findOne({where: {title: "Snow Owls"}})
				.then((wiki) => {
					expect(wiki.title).toBe("Snow Owls");
					expect(wiki.body).toBe("The second cutest animals");
					done();
				})
				.catch((err) => {
					console.log(err);
					done();
				});
			});
		});
	});

	describe("GET /wikis/:id", () => {
		it("should render a view with the selected wiki", (done) => {
			request.get(`${base}${this.wiki.id}`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("Baby Rhino");
				done();
			});
		});
	});

	describe("POST /wikis/:id/destroy", () => {
		it("should delete the selected wiki", (done) => {
			Wiki.all()
			.then((wikis) => {
				const wikiCountBeforeDelete = wikis.length;

				expect(wikiCountBeforeDelete).toBe(1);

				request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
					Wiki.all()
					.then((wikis) => {
						expect(err).toBeNull();
						expect(wikis.length).toBe(wikiCountBeforeDelete -1);
						done();
					});
				});
			});
		});
	});

	describe("GET /wikis/:id/edit", () => {
		it("should render a view with the wiki form selected in an editable form", (done) => {
			request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("Edit Wiki");
				expect(body).toContain("Baby Rhino");
				done();
			})
		});
	});

	describe("POST /wikis/:id/update", () => {
		it("should update the current wiki with new given values", (done) => {
			request.post({
				url: `${base}${this.wiki.id}/update`,
				form: {
					title: "Baby Rhino",
					body: "the not so cute animal",
					userId: "this.user.id"
				}
			}, (err, res, body) => {
				expect(err).toBeNull();
				Wiki.findOne({
					where: {id:1}
				})
				.then((wiki) => {
					expect(wiki.title).toBe("Baby Rhino");
					done();
				});
			});
		});
	});
});
