const express = require('express')
const routes = express.Router()
const user = require('./App/controllers/user')
const public = require('./App/controllers/public')

//public-view

routes.get("/", public.index)
routes.get("/sobre", public.about)
routes.get("/receitas", public.listRecipes)
routes.get("/receitas/:id", public.recipeDetail)
routes.get("/chefs", public.listChefs)
routes.get("/search", public.search)

//admin
routes.get("/admin/recipes", user.index);
routes.get("/admin/recipes/create", user.create);
routes.get("/admin/recipes/:id", user.show);
routes.get("/admin/recipes/:id/edit", user.edit);

routes.post("/admin/recipes", user.post); 
routes.put("/admin/recipes", user.put); 
routes.delete("/admin/recipes", user.delete); 

module.exports = routes
