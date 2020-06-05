const express = require('express')
const routes = express.Router()
const data = require('./data.json')
const user = require('./controllers/user')

//public-view

routes.get("/", function(req, res){
    return res.render("./public-view/index", {items: data.recipes})
})
routes.get("/sobre", function(req, res){
    return res.render("./public-view/sobre")
})
routes.get("/receitas", function(req, res){
    return res.render("./public-view/receitas", { items: data.recipes })
})
routes.get("/receitas/:id", function (req, res) {
    const id = req.params.id;

    const recipe = data.recipes.find(function(recipe){
        return recipe.id == id
    })
    if (!recipe) {
        return res.send("Recipe not found!")
    }
  
    return res.render("./public-view/item", {item: recipe});
})

//admin
routes.get("/admin/recipes", user.index);
routes.get("/admin/recipes/create", user.create);
routes.get("/admin/recipes/:id", user.show);
routes.get("/admin/recipes/:id/edit", user.edit);

routes.post("/admin/recipes", user.post); 
routes.put("/admin/recipes", user.put); 
routes.delete("/admin/recipes", user.delete); 

module.exports = routes
