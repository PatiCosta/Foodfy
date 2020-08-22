const express = require('express')
const routes = express.Router()

// Controllers
const Recipes = require('../../App/controllers/admin/recipes')

// Middlewares
const multer = require('../../App/middlewares/multer')
const {onlyUsers} = require('../../App/middlewares/session')

// Validators
const RecipeValidator = require('../../App/validators/recipes')


//recipes routes
routes.get("/", onlyUsers, Recipes.all);
routes.get("/create", onlyUsers, Recipes.create);
routes.get("/:id", onlyUsers, Recipes.show);
routes.get("/:id/edit", onlyUsers, RecipeValidator.onlyOwnerOrAdmin, Recipes.update);

routes.post("/", onlyUsers, multer.array("photos", 5), Recipes.post); 
routes.put("/:id", onlyUsers, RecipeValidator.onlyOwnerOrAdmin, multer.array("photos", 5), Recipes.put); 
routes.delete("/", onlyUsers, RecipeValidator.onlyOwnerOrAdmin, Recipes.delete); 

module.exports = routes