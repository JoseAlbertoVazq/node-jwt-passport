const Sequelize = require('sequelize');
const User = require('../models').User;
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
const secret = 'sequelizExpress';
module.exports = {
    getUsers(req, res) {
        return User.findAll()
            .then((users) => res.status(200).send(users))
            .catch(() => res.sendStatus(500));
    },

    register(req, res) {
        if (!req.body.username ||
            !req.body.password ||
            !req.body.confirmPassword ||
            !req.body.email ||
            !req.body.firstName ||
            !req.body.lastName) {
            return res.sendStatus(400);
        }

        User.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.username },
                    { email: req.body.email }
                ]
            }
        }).then((found) => {
            if (found) {
                return res.sendStatus(409);
            }
            if (req.body.password !== req.body.confirmPassword) {
                return res.sendStatus(400);
            }
            User.create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }).then((created) => {
                console.log('hola');
                return res.status(201).send({
                    "message": "User created!",
                    "details": created
                });
            }).catch(() => res.sendStatus(500));
        }).catch(() => res.sendStatus(500));
    },

    login(req, res) {
        if (!req.body.username || !req.body.password) {
            return res.sendStatus(400);
        }
        User.findOne({
            where: { username: req.body.username }
        }).then((user) => {
            if (user.password === req.body.password) {
                let payload = { id: user.id };
                let token = jwt.sign(payload, secret);
                // Now we can save this token with Express, so we can call res.locals.token
                // anywhere in our backend
                res.locals.token = token;
                return res.status(200).send({ "message": "Login successful", "token": token });
            } else {
                return res.sendStatus(400);
            }
        }).catch(() => res.sendStatus(500));
    },
    // helper method for jwt
    getUser(id) {
        return User.findOne({
            where: id
        });
    }
}