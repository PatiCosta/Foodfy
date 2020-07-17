const Public = require('../models/publics')

module.exports = {
    index(req, res){
        Public.index(function(recipes){
            res.render("./public-view/index", { items: recipes })
        })
    },
    search(req, res) {
        
        let {filter} = req.query

        Public.search(filter, function(items) {
            res.render("./public-view/search", {filter, items})
        })
    },
    about(req, res){
        return res.render("./public-view/sobre")
    },
    listRecipes(req, res){
        Public.allRecipes(function(allRecipes){
            return res.render("./public-view/receitas", {items: allRecipes})
        })
    },
    recipeDetail(req, res) {
        Public.find(req.params.id, function(recipe) {
            if (!recipe) return res.send("Recipe not found")
    
            return res.render('./public-view/item', {item: recipe})
        })
    },
    listChefs(req, res) {
        Public.chefs(function(allChefs){
            return res.render("./public-view/chefs", {chefs: allChefs})
        })
    }
}