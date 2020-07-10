const Public = require('../models/publics')

module.exports = {
    index(req, res){
        Public.index(function(allRecipes){
            return res.render("./public-view/index", {items: allRecipes})
        })
    },
    about(req, res){
        return res.render("./public-view/sobre")
    },
    listRecipes(req, res){
        Public.index(function(allRecipes){
            return res.render("./public-view/receitas", {items: allRecipes})
        })
    },
    recipeDetail(req, res) {
        Public.find(req.params.id, function(recipe) {
            if (!recipe) return res.send("Recipe not found")
    
            recipe.created_at = date(recipe.created_at).format
    
            return res.render('./public-view/item', {item: recipe})
        })
    },
    listChefs(req, res) {
        Public.chefs(function(allChefs){
            return res.render("./public-view/chefs", {chefs: allChefs})
        })
    },
    search(req, res) {
        let filter = req.query
        Public.findBy(filter, function(recipes){
            return res.render("./public-view/search", {items: recipes})
        })
    }
}