const express = require('express')
const routes = express.Router()

// Controllers
const Chefs = require('../../App/controllers/admin/chefs')

// Middlewares
const {onlyUsers, onlyAdminChefs} = require('../../App/middlewares/session')
const multer = require('../../App/middlewares/multer')


// chefs routes
routes.get("/", onlyUsers, Chefs.all)
routes.get("/create", onlyUsers, onlyAdminChefs, Chefs.create)
routes.get("/:id", onlyUsers, Chefs.show)
routes.get("/:id/edit", onlyUsers, onlyAdminChefs, Chefs.update)

routes.post("/", onlyUsers, onlyAdminChefs, multer.single('avatar'), Chefs.post)
routes.put("/", onlyUsers, onlyAdminChefs, multer.single('avatar'), Chefs.put)
routes.delete("/", onlyUsers, onlyAdminChefs, Chefs.delete)

module.exports = routes