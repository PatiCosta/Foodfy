const Recipes = require('../../models/public/recipes')

module.exports = {
    async index(req, res){
        let results = await Recipes.all()
        let recipesResults = results.rows

        let finalRecipes = new Array()

        for (recipe of recipesResults) {
            let fileResults = Recipes.files(recipe.id)
            fileResults = (await fileResults).rows[0].path

            recipe = {
                ...recipe,
                src: `${req.protocol}://${req.headers.host}${fileResults.replace("public", "")}`
            }
            
            finalRecipes.push(recipe)
        }

        const recipes = finalRecipes.slice(0, 6)

        return res.render("./public/index", {recipes})
    },
    about(req, res){
        return res.render("./public/about")
    },
}