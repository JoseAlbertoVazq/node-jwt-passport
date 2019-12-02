const express = require('express');
const app = express();
const utils = require('./config/utils');
const userRoutes = require('./routes/user-routes');
const userController = require('./controllers/user-controller');
// import passport and passport-jwt modules
const passport = require('passport');
const passportJWT = require('passport-jwt');

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;

// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = utils.secret;

// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    console.log('payload received', jwt_payload);
    let user = userController.getUser({ id: jwt_payload.id });
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

// use the strategy
passport.use(strategy);
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes for users
app.use('/', userRoutes);
// start the app
app.listen(3000, () => {
    console.log('Express is running on port 3000');
});
