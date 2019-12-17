const Sequelize = require('sequelize');
const User = require('../models').User;
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
const utils = require('../config/utils');
const bcrypt = require('bcrypt');
const SALT_NUMBER = 10;
module.exports = {
    getUsers(req, res) {
        return User.findAll({
            attributes: {
                exclude: ['id', 'password', 'access_token', 'createdAt', 'updatedAt']
            }
        })
            .then((users) => res.status(200).send({
                "message": "OK",
                "details": users
            }))
            .catch(() => res.status(500).send(utils.internal));
    },

    register(req, res) {
        if (!req.body.username ||
            !req.body.password ||
            !req.body.confirmPassword ||
            !req.body.email ||
            !req.body.firstName ||
            !req.body.lastName) {
            return res.status(400).send(utils.badRequest);
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
                return res.status(409).send(utils.conflict);
            }
            if (req.body.password !== req.body.confirmPassword) {
                return res.status(400).send(utils.badRequest);
            }
            // Before creating the user in our db, let's bcrypt it!
            bcrypt.hash(req.body.password, SALT_NUMBER, (err, hash) => {
                if (err || hash == undefined) return res.status(500).send(utils.internal);
                User.create({
                    username: req.body.username,
                    password: hash,
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                }).then((created) => {
                    let payload = { id: created.id };
                    let token = jwt.sign(payload, utils.secret, { expiresIn: '30m' });
                    created.update({ access_token: token });
                    return res.status(201).send({
                        "message": "OK",
                        "details": {
                            "username": created.username,
                            "access_token": created.access_token
                        }
                    });
                }).catch((error) => res.status(500).send(error));
            })
        }).catch(() => res.status(500).send(utils.internal));
    },

    login(req, res) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).send(utils.badRequest);
        }
        return User.findOne({
            where: { username: req.body.username }
        }).then((user) => {
            if (!user) return res.status(400).send(utils.badRequest);
            // Compare the password attribute of the body request with
            // bcrypted password stored in db
            bcrypt.compare(req.body.password, user.password, ((err, result) => {
                if (err) return res.status(500).send(utils.internal);
                if (result) {
                    let payload = { id: user.id };
                    let token = jwt.sign(payload, utils.secret, { expiresIn: '30m' });
                    user.update({ access_token: token });
                    return res.status(200).send({
                        "message": "OK",
                        "details": {
                            "access_token": token
                        }
                    });
                } else {
                    return res.status(400).send(utils.badRequest);
                }
            }))
        }).catch(() => res.status(404).send(utils.notFound));
    },

    // helper method for jwt
    getUser(id) {
        return User.findOne({
            where: id
        });
    }
}