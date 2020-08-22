const express = require('express')
const routes = express.Router()

const Index = require('../App/controllers/public/index')
const Recipes = require('../App/controllers/public/recipes')
const Chefs = require('../App/controllers/public/chefs')

const admin = require('./admin')

routes.use('/admin', admin)


//public-view

routes.get("/", Index.index)
routes.get("/sobre", Index.about)
routes.get("/receitas", Recipes.all)
routes.get("/receitas/:id", Recipes.show)
routes.get("/chefs", Chefs.all)
routes.get("/search", Recipes.search)


module.exports = routes
