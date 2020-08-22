const Recipes = require('../../models/public/recipes')

module.exports = {
    async index(req, res){
        let results = await Recipes.all()
        let recipes = results.rows

        let finalRecipes = new Array()

        for (recipe of recipes) {
            let fileResults = Recipes.files(recipe.id)
            fileResults = (await fileResults).rows[0].path

            recipe = {
                ...recipe,
                src: `${req.protocol}://${req.headers.host}${fileResults.replace("public", "")}`
            }
            
            finalRecipes.push(recipe)
        }

        return res.render("./public/index", {items: finalRecipes})
    },
    about(req, res){
        return res.render("./public/about")
    },
}