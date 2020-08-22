const express = require('express')
const routes = express.Router()

// Controllers
const Profile = require('../../App/controllers/admin/profile')

// Middlewares
const {onlyUsers} = require('../../App/middlewares/session')

// Validators
const ProfileValidator = require('../../App/validators/profile')


// // Rotas de perfil de um usuário logado
routes.get('/', onlyUsers, Profile.index) // Mostrar o formulário com dados do usuário logado
routes.put('/', onlyUsers, ProfileValidator.update, Profile.put)// Editar o usuário logado

module.exports = routes