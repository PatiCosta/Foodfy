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
routes.get("/admin/receitas", user.recipeIndex);
routes.get("/admin/receitas/create", user.recipeCreate);
routes.get("/admin/receitas/:id", user.recipeShow);
routes.get("/admin/receitas/:id/edit", user.recipeEdit);

routes.get("/admin/chefs", user.chefIndex)
routes.get("/admin/chefs/create", user.chefCreate)
routes.get("/admin/chefs/:id", user.chefShow)
routes.get("/admin/chefs/:id/edit", user.chefEdit)

routes.post("/admin/receitas", user.recipePost); 
routes.put("/admin/receitas", user.recipePut); 
routes.delete("/admin/receitas", user.recipeDelete); 

routes.post("/admin/chefs", user.chefPost)
routes.put("/admin/chefs", user.chefPut)
routes.delete("/admin/chefs", user.chefDelete)




module.exports = routes
