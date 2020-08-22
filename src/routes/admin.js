const express = require('express')
const routes = express.Router()

const users = require('./admin/users')
const profile = require('./admin/profile')
const chefs = require('./admin/chefs')
const recipes = require('./admin/recipes')


routes.use('/users', users)
routes.use('/profile', profile)
routes.use('/chefs', chefs)
routes.use('/recipes', recipes)

// Middlewares

const {isLoggedRedirect} = require('../App/middlewares/session')

// Validators
const SessionValidator = require('../App/validators/session')

// Controllers
const Session = require('../App/controllers/admin/session')

// // // login/logout Session
routes.get('/login', isLoggedRedirect, Session.loginForm)
routes.post('/login', SessionValidator.login, Session.login)
routes.post('/logout', Session.logout)

// // // reset password / forgot
routes.get('/forgot-password', Session.forgotForm)
routes.get('/password-reset', Session.resetForm)
routes.post('/forgot-password', SessionValidator.forgot , Session.forgot)
routes.post('/password-reset', SessionValidator.reset , Session.reset)


module.exports = routes
