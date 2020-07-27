const express = require('express');
const router = express.Router();
const User = require('../models/User.model')

const bcrypt = require('bcryptjs');
const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if(username === '' || password === ''){
    res.render('auth/signup', {
      errorMessage: 'Indicate an username and a password to sign up'
    });
    return;
  }

  User.findOne({username})
    .then(user => {
      if ( user !== null) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists'
        });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass})
        .then(() => {
          res.redirect('/');
        })
        .catch((error) => {
          console.log(error)
        });
    })
    .catch((error) => {
      //what?
      next(error);
    })
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  //asignamos a variables los datos que vienen del form
  const { username, password } = req.body;
  //verificamos que los valores del form no lleguen vacíos
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login",
    });
    return;
  }

  // buscamos en la BD si existe un username con los datos del user que vienen del form
  // si no lo encuentra, nos dice que el user no existe
  // sino, nos devuelve el user
  // usamos el método compareSync para hacer hash del form input y compararlo con el password guardado en la BD

  User.findOne({ username })
  .then((user) => {
    if(!user) {
      console.log('no existe el usuario')
      res.render("auth/login", {
          errorMessage: "The username doesn't exist"
      });
      return;
    }

    if (bcrypt.compareSync(password, user.password)){
      // Save the login in the session!
      //the request object has a property called session where we can add the values we want to store on it. In this case, we are setting it up with the user’s information.
      req.session.currentUser = user;
      // let logged = { loggin: true}
      // console.log('Estas to logged ', logged)
      res.render('home', { logged: true} );
    } else {
      console.log('incorrect password')
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      })
    }
  })
  .catch((error) => {
    next(error);
  })
});

router.get('/auth/main', (req, res, next) => {
  res.render('auth/main');
});

router.get('/auth/private', (req, res, next) => {
  res.render('auth/private');
});

module.exports=router;
