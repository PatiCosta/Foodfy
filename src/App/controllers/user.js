const User = require('../models/users')
const users = require('../models/users')


module.exports = {
    recipeIndex(req, res){

        User.recipeIndex(function(recipes){
            res.render("user/recipeIndex", { items: recipes })
        })
    },

    recipeShow(req, res) {

        const { id } = req.params

        User.recipeFind(id, function(recipe) {
            if (!recipe) return res.send("Recipe not found")

            return res.render('user/recipeShow', {item: recipe})
        })
    },

    recipeEdit(req, res) {

        const { id } = req.params

        User.recipeFind(id, function(recipe) {
            User.chefOptions(function(options) {
                if (!recipe) return res.send("Instructor not found")

                return res.render('user/recipeEdit.njk', {item: recipe, options})
            })
            
        })
    },

    recipeCreate (req, res) {
        User.chefOptions(function(options) {
        return res.render('user/recipeCreate.njk', {chefOptions: options})
        })
    },

    recipePost (req, res) {
        User.recipeCreate(req.body, function(recipe){
            return res.redirect(`/admin/receitas/${recipe.id}`)
        })
    },

    recipePut(req, res){
        User.recipeUpdate(req.body, function() {
            return res.redirect(`/admin/receitas/${req.body.id}`)
        })

    },

    recipeDelete(req, res){
        User.recipeDelete(req.body.id, function() {
            return res.redirect(`/admin/receitas`)
        })
    },

    chefIndex(req, res) {
        User.chefIndex(function(chefs) {
            res.render("user/chefIndex", { chefs })
        })
    },

    chefShow(req, res) {

        User.chefFind(req.params.id, function(chef) {
            User.chefRecipes(req.params.id, function(items){
                if (!chef) return res.send("Chef not found")

                return res.render('user/chefShow.njk', {chef, items})
            })
        })
    },

    chefCreate(req, res) {
        return res.render('user/chefCreate.njk')
    },

    chefPost (req, res) {
        User.chefCreate(req.body, function(chef){
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },

    chefEdit (req, res) {
        const { id } = req.params

        User.chefFind(id, function(chef) {
            if (!chef) return res.send("Chef not found")

            return res.render('user/chefEdit.njk', {chef})
        })
    },

    chefPut(req, res) {
        User.chefUpdate(req.body, function(){
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },

    chefDelete(req, res) {
        User.chefDelete(req.body.id, function(){
            return res.redirect(`/admin/chefs`)
        })
    }
    
}