const Recipes = require('../../models/public/recipes')

module.exports = {
    async search(req, res) {

        let {filter} = req.query

        let results = await Recipes.search(filter)
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


        return res.render("./public/search", {filter, recipes: finalRecipes})
    
    },
    async all(req, res){

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


        return res.render("./public/recipes", {recipes: finalRecipes})
    },
    async show(req, res) {
        
        let results = await Recipes.find(req.params.id)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found!")

        results = await Recipes.files(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))

        return res.render("./public/show", {recipe, files})

    },
}
