const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const wikiQueries = require("../db/queries.wikis.js");
const User = require("../db/models/").User;
const Wiki = require("../db/models/").Wiki;


module.exports = {
  signUp(req, res, next){
    res.render("users/signup");
  },

  create(req, res, next){
		let newUser = {
			email: req.body.email,
			password: req.body.password,
			name:req.body.name,
			passwordConfirmation: req.body.passwordConfirmation

		};
		userQueries.createUser(newUser, (err, user) => {
			if(err){
				req.flash("error", err);
				res.redirect("/users/signup");
			} else {
				passport.authenticate("local")(req, res, () => {
					req.flash("notice", "You've successfully signed in!");
					sgMail.setApiKey(process.env.SENDGRID_API_KEY);
					const msg = {
						to: user.email,
						from: 'nanaximenes8@hotmail.com',
						subject: 'The new Wiki',
						text: 'the way to collaborate',
						html: '<strong>Welcome to Blocipedia!</strong>',
					};
				 sgMail.send(msg);
					res.redirect("/");
				})
			}
		});
		console.log(process.env.SENDGRID_API_KEY);
	},

  signInForm(req, res, next){
    res.render("users/signin");
  },

  signIn(req, res, next){
    passport.authenticate('local')(req, res, () => {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else{
        req.flash("notice", "You've successfully signed in!")
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

	upgradePage(req, res, next){
		res.render("users/upgrade");
	},

 upgrade(req, res, next){
	 const stripe = require("stripe")("sk_test_2tAMuq7WXNKR0Eitecy7Kng");
	 const token = req.body.stripeToken;
	 const charge = stripe.charges.create({
		 amount: 1500,
		 currency: "cad",
		 description: "Upgrade",
		 source: token,
		 statement_descriptor: 'Blocipedia Upgrade',
		 capture: false,
	 });
	 userQueries.upgrade(req.params.id, (err, user) => {
		 if(err && err.type ==="StripeCardError"){
			 req.flash("notice", "Your payment was unsuccessful");
			 res.redirect("/users/upgrade");
		 } else{
			 req.flash("notice", "Your payment was successful, you are now a Premium Member!");
			 res.redirect(`/`);

		 }
	 }) ;
 },

 downgradePage(req, res, next) {
	 res.render("users/downgrade");
 },

 	downgrade(req, res, next) {
	userQueries.downgrade(req.user.dataValues.id);
	wikiQueries.privateToPublic(req.user.dataValues.id);
	req.flash('notice', 'You are no longer a premium user and your private wikis are now public.');
	res.redirect('/');
},
	showCollaborations(req, res, next) {
		userQueries.getUser(req.user.id, (err, result) => {
			user = result['user'];
			collaborations = result['collaborations'];
			if (err || user == null) {
				res.redirect(404, '/');
			} else {
				res.render('users/collaborations', { user, collaborations });
			}
		});
	},
}
