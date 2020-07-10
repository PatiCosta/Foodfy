const User = require('../models/users')
const db = require('../../config/db')


module.exports = {
index(req, res){

    User.index(function(allRecipes){
        return res.render("./user/index", {items: allRecipes})
    })

},

show(req, res) {

    User.find(req.params.id, function(recipe) {
        if (!recipe) return res.send("Recipe not found")

        recipe.created_at = date(recipe.created_at).format

        return res.render('user/show', {recipe})
    })
},

edit(req, res) {

    User.find(req.params.id, function(recipe) {
        if (!recipe) return res.send("Instructor not found")

        recipe.created_at = date(recipe.created_at).format

        return res.render('user/edit', {recipe})
    })
},

create (req, res) {
    return res.render('user/create')
},

post (req, res) {
    User.create(req.body, function(newRecipe){
        return res.redirect(`/admin/recipes/${newRecipe.id}`)
    })
},

put(req, res){

    const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields')
            }
        }

        User.update(req.body, function() {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })

},

delete(req, res){
    User.delete(req.body.id, function() {
        return res.redirect(`/admin/recipes`)
    })
}
}