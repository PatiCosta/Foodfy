const express = require('express')
const routes = express.Router()

// Controllers
const User = require('../../App/controllers/admin/user')

// Middlewares
const {onlyAdminUsers, onlyOtherAdmin} = require('../../App/middlewares/session')

// Validators
const UserValidator = require('../../App/validators/user')



// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', onlyAdminUsers, User.list) //Mostrar a lista de usuários cadastrados
routes.get('/create', onlyAdminUsers, User.create) // Criar usuário
routes.get('/:id', onlyAdminUsers, User.edit) // Mostrar usuário


routes.post('/', UserValidator.post, onlyAdminUsers, User.post) //Cadastrar um usuário
routes.put('/', onlyAdminUsers, User.put) // Editar um usuário
routes.delete('/', onlyAdminUsers, onlyOtherAdmin, User.delete) // Deletar um usuário

module.exports = routes
