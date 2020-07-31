const express = require('express')
const routes = express.Router()
const user = require('./App/controllers/user')
const public = require('./App/controllers/public')
const multer = require('./App/middlewares/multer')


//public-view

routes.get("/", public.index)
routes.get("/sobre", public.about)
routes.get("/receitas", public.listRecipes)
routes.get("/receitas/:id", public.recipeDetail)
routes.get("/chefs", public.listChefs)
routes.get("/search", public.search)

//admin
routes.get("/admin/recipes", user.recipeIndex);
routes.get("/admin/recipes/create", user.recipeCreate);
routes.get("/admin/recipes/:id", user.recipeShow);
routes.get("/admin/recipes/:id/edit", user.recipeEdit);

routes.get("/admin/chefs", user.chefIndex)
routes.get("/admin/chefs/create", user.chefCreate)
routes.get("/admin/chefs/:id", user.chefShow)
routes.get("/admin/chefs/:id/edit", user.chefEdit)

routes.post("/admin/recipes", multer.array("photos", 5), user.recipePost); 
routes.put("/admin/recipes", multer.array("photos", 5), user.recipePut); 
routes.delete("/admin/recipes", user.recipeDelete); 

routes.post("/admin/chefs", multer.single('avatar'), user.chefPost)
routes.put("/admin/chefs", multer.single('avatar'), user.chefPut)
routes.delete("/admin/chefs", user.chefDelete)




module.exports = routes
