const Sequelize = require('sequelize');
const User = require('../models').User;
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
const utils = require('../config/utils');
const bcrypt = require('bcrypt');
const SALT_NUMBER = 10;
module.exports = {
    getUsers(req, res) {
        console.log(res.locals.token);
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
            // Before creating the user in our db, let's bcrypt it!
            bcrypt.hash(req.body.password, SALT_NUMBER, (err, hash) => {
                if (err || hash == undefined) return res.sendStatus(500);
                User.create({
                    username: req.body.username,
                    password: hash,
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                }).then((created) => {
                    return res.status(201).send({
                        "message": "User created!",
                        "details": created
                    });
                }).catch((error) => res.status(500).send(error));
            })
        }).catch(() => res.sendStatus(500));
    },

    login(req, res) {
        if (!req.body.username || !req.body.password) {
            return res.sendStatus(400);
        }
        return User.findOne({
            where: { username: req.body.username }
        }).then((user) => {
            if (!user) return res.sendStatus(400);
            // Compare the password attribute of the body request with
            // bcrypted password stored in db
            bcrypt.compare(req.body.password, user.password, ((err, result) => {
                if (err) return res.sendStatus(500);
                if (result) {
                    let payload = { id: user.id };
                    let token = jwt.sign(payload, utils.secret, { expiresIn: '30m' });
                    user.update({ token: token });
                    return res.status(200).send({ "message": "Login successful", "token": token });
                } else {
                    return res.sendStatus(400);
                }
            }))
        }).catch(() => res.sendStatus(404));
    },
    // helper method for jwt
    getUser(id) {
        return User.findOne({
            where: id
        });
    }
}