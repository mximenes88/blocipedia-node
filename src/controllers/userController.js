const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

module.exports = {
  signUp(req, res, next){
    res.render("users/signup");
  },

  create(req, res, next){
		let newUser = {
			email: req.body.email,
			password: req.body.password,
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

 downgrade(req, res, next){
	 userQueries.downgrade(req.params.id, (err, user) => {
		 if(err){
			 req.flash("notice", "There was an error processing this request");
			 res.redirect("users/downgrade");
		 } else{
			 req.flash("notice", "Your account has been changed back to standard");
			 res.redirect(`/`);
		 }
	 });
 },

}