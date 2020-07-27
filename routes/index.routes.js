const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('home'));

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route 
  } else {
    res.redirect("/login");
  }
});

// renderizamos la plantilla secret.hbs con el username
// deconstruimos en la variable username el username de req.session.currentUser

router.get("/secret", function (req, res, next) {
  res.render("secret");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // si no puede acceder a los datos de sesión, redirige a /login
    res.redirect("/login");
  });
});

module.exports = router;
