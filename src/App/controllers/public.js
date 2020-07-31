const Public = require('../models/publics')

module.exports = {
    async index(req, res){
        let results = await Public.allRecipes()
        let recipes = results.rows

        let finalRecipes = new Array()

        for (recipe of recipes) {
            let fileResults = Public.files(recipe.id)
            fileResults = (await fileResults).rows[0].path

            recipe = {
                ...recipe,
                src: `${req.protocol}://${req.headers.host}${fileResults.replace("public", "")}`
            }
            
            finalRecipes.push(recipe)
        }


        return res.render("./public-view/index", {items: finalRecipes})
    },
    async search(req, res) {

        let {filter} = req.query

        let results = await Public.search(filter)
        let recipes = results.rows

        let finalRecipes = new Array()

        for (recipe of recipes) {
            let fileResults = Public.files(recipe.id)
            fileResults = (await fileResults).rows[0].path

            recipe = {
                ...recipe,
                src: `${req.protocol}://${req.headers.host}${fileResults.replace("public", "")}`
            }
            
            finalRecipes.push(recipe)
        }


        return res.render("./public-view/search", {filter, items: finalRecipes})
    
    },
    about(req, res){
        return res.render("./public-view/sobre")
    },
    async listRecipes(req, res){

        let results = await Public.allRecipes()
        let recipes = results.rows

        let finalRecipes = new Array()

        for (recipe of recipes) {
            let fileResults = Public.files(recipe.id)
            fileResults = (await fileResults).rows[0].path

            recipe = {
                ...recipe,
                src: `${req.protocol}://${req.headers.host}${fileResults.replace("public", "")}`
            }
            
            finalRecipes.push(recipe)
        }


        return res.render("./public-view/receitas", {items: finalRecipes})
    },
    async recipeDetail(req, res) {
        
        let results = await Public.find(req.params.id)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found!")

        results = await Public.files(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))

        return res.render("./public-view/item", {item: recipe, files})

    },
    async listChefs(req, res) {
        let results = await Public.chefs(req.params.id)
        let chefs = results.rows

        let finalChefs = new Array()

        for (chef of chefs) {
            let avatar = chef.avatar

            if (avatar != null) {
                chef = {
                    ...chef,
                    avatar: `${req.protocol}://${req.headers.host}${avatar.replace("public","")}`
                }
            }
            finalChefs.push(chef)
        }

        return res.render("./public-view/chefs", {chefs: finalChefs})

    }
}