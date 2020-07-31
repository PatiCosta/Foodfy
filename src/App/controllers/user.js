const User = require('../models/users')
const Files = require('../models/files')
const files = require('../models/files')


module.exports = {
    async recipeIndex(req, res){

        let results = await User.recipeIndex()
        let recipes = results.rows

        let finalRecipes = new Array()

        for (recipe of recipes) {
            let fileResults = User.recipeFiles(recipe.id)
            fileResults = (await fileResults).rows[0].path

            recipe = {
                ...recipe,
                src: `${req.protocol}://${req.headers.host}${fileResults.replace("public", "")}`
            }
            
            finalRecipes.push(recipe)
        }


        return res.render("user/recipeIndex", {items: finalRecipes})
    },

    async recipeShow(req, res) {

        let results = await User.recipeFind(req.params.id)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found!")

        results = await User.recipeFiles(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))

        return res.render("user/recipeShow", {item: recipe, files})
    },

    async recipeEdit(req, res) {

        let results = await User.recipeFind(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send('Recipe not found')

        results = await User.chefOptions()
        const options = results.rows

        results = await User.recipeFiles(recipe.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("user/recipeEdit.njk", { item: recipe, options, files })
    },

    async recipeCreate (req, res) {
        const chefOptions = await User.chefOptions()

        return res.render('user/recipeCreate.njk', {chefOptions})
    
    },

    async recipePost (req, res) {
        if (req.files.lenght == 0)
            return res.send('Please, send at least one image')

        let results = await User.recipeCreate(req.body)
        const recipe_id = results.rows[0].id

        let recipeFilesPromise = req.files.map(file => User.recipeFileCreate({file, recipe_id}))
        await Promise.all(recipeFilesPromise)

        return res.redirect(`/admin/receitas/${recipe_id}`)
    },

    async recipePut(req, res){

        await User.recipeUpdate(req.body)

        if (req.files) {
            const newFilesPromise = req.files.map((file) => 
                User.recipeFileCreate({file, recipe_id: req.body.id}))
            await Promise.all(newFilesPromise)

        }

        if (req.body.removed_files) {
            const removedFilesId = req.body.removed_files.split(',');

            removedFilesId.splice(removedFilesId.length - 1, 1);

            const removedFilesPromise = removedFilesId.map((id) => User.recipeFileDelete({file_id: id, recipe_id: req.body.id}))
            await Promise.all(removedFilesPromise)
        }


        return res.redirect(`/admin/recipes/${req.body.id}`)

    },

    async recipeDelete(req, res){

        const results = await User.recipeFiles(req.body.id)

        const removeRecipeFilesPromise = results.rows.map((file) => User.recipeFileDelete({file_id: file.file_id, recipe_id: req.body.id}))
        await Promise.all(removeRecipeFilesPromise)
        
        await User.recipeDelete(req.body.id)

        return res.redirect('/admin/recipes')
    },

    async chefIndex(req, res) {

        let results = await User.chefIndex(req.params.id)
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

        return res.render("user/chefIndex", {chefs: finalChefs})
    },

    async chefShow(req, res) {

        let results = await User.chefFind(req.params.id)
        let chef = results.rows[0]
        let avatar = chef.avatar

        if (avatar) {
            chef = {
                ...chef,
                avatar: `${req.protocol}://${req.headers.host}${avatar.replace("public","")}`
            }
        }

        if(!chef) return res.send("Chef not found!")

        let recipesResults = await User.chefRecipes(req.params.id)
        let recipes = recipesResults.rows

        let finalRecipes = new Array()

        if (recipes[0].id != null) {
            for (recipe of recipes) {
                let fileResults = User.recipeFiles(recipe.id)
                fileResults = (await fileResults).rows[0].path

                recipe = {
                    ...recipe,
                    src: `${req.protocol}://${req.headers.host}${fileResults.replace("public", "")}`
                }
                
                finalRecipes.push(recipe)
            }
        }

        return res.render("user/chefShow", {chef, items: finalRecipes})
    },

    chefCreate(req, res) {
        return res.render('user/chefCreate.njk')
    },

    async chefPost (req, res) {
        if (!req.file)
            return res.send('Please, send one avatar')

        const file = await Files.create({name: req.file.filename, path: req.file.path})
        const file_id = file.rows[0].id

        let results = await User.chefCreate({name: req.body.name, file_id})
        const chefId = results.rows[0].id

        return res.redirect(`/admin/chefs/${chefId}/edit`)
    },

    async chefEdit (req, res) {

        let results = await User.chefFind(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send('Chef not found')


        return res.render("user/chefEdit.njk", { chef })
    },

    async chefPut(req, res) {

        let chef = await User.chefFind(req.body.id);

        if (!chef) return res.redirect('/admin/chefs?error=Chef não encontrado');

            let update = {
                ...chef.rows[0],
                ...req.body
            };


            if (req.file) {
                const file = await Files.create({
                    name: req.file.filename,
                    path: req.file.path,
                });

                update.file_id = file.rows[0].id;
            }

            let file_id = update.file_id
            let name = update.name


            await User.chefUpdate({
                id: req.body.id,
                file_id,
                name
            });
    
        return res.redirect(`/admin/chefs/${req.body.id}`)
    },

    async chefDelete(req, res) {

        const chef = await User.chefFind(req.body.id)
        let chefFile = chef.rows[0].file_id

        await User.chefDelete(req.body.id)

        if (chefFile != null ) {
            await Files.delete(chefFile)
        }

            return res.redirect(`/admin/chefs`)
    }
    
}