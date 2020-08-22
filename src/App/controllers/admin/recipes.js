const Recipes = require('../../models/admin/recipes')

module.exports = {
    async all(req, res){
        const {success, error} = req.query

        let results = await Recipes.all()
        let recipes = results.rows

        let finalRecipes = new Array()

        for (recipe of recipes) {
            let results = await Recipes.recipeFiles(recipe.id)
            fileResults = results.rows[0].path

            recipe = {
                ...recipe,
                src: `${req.protocol}://${req.headers.host}${fileResults.replace("public", "")}`
            }
            
            finalRecipes.push(recipe)
        }

        return res.render("user/recipes/index", {items: finalRecipes, success, error})
    },
    async show(req, res) {
        const {success, error} = req.query

        let results = await Recipes.find(req.params.id)
        const recipe = results.rows[0]

        const notFound = 'Receita não encontrada'
        if(!recipe) return res.redirect(`/admin/recipes?error=${notFound}`)

        results = await Recipes.recipeFiles(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))

        return res.render("user/recipes/show", {item: recipe, files, success, error})
    },
    async update(req, res) {
        const {success, error} = req.query

        let results = await Recipes.find(req.params.id)
        const recipe = results.rows[0]

        const notFound = 'Receita não encontrada'
        if(!recipe) return res.redirect(`/admin/recipes?error=${notFound}`)

        results = await Recipes.chefOptions()
        const options = results.rows

        results = await Recipes.recipeFiles(recipe.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("user/recipes/edit.njk", { item: recipe, options, files, success, error })
    },
    async create (req, res) {
        const {success, error} = req.query
        const chefOptions = await Recipes.chefOptions()
        const options = chefOptions.rows

        return res.render('user/recipes/create.njk', {chefOptions: options, success, error})
    
    },
    async post (req, res) {
        try {
            if (req.files.lenght == 0)
            return res.send('Please, send at least one image')

            let results = await Recipes.create(req.body, req.session.sessionId)
            const recipe_id = results.rows[0].id

            let recipeFilesPromise = req.files.map(file => Recipes.recipeFileCreate({file, recipe_id}))
            await Promise.all(recipeFilesPromise)

            const success = 'Receita cadastrada com sucesso!'

            return res.redirect(`/admin/recipes/${recipe_id}?success=${success}`)

        } catch(err) {
            console.log(err)
            const error = 'Opa, ocorreu um erro no cadastro da receita. Por favor tente novamente'
            return res.redirect(`/admin/recipes/create?error=${error}`) 
        }
    },
    async put(req, res){
        try {
            await Recipes.update(req.body)

            if (req.files) {
                const newFilesPromise = req.files.map((file) => 
                    Recipes.recipeFileCreate({file, recipe_id: req.body.id}))
                await Promise.all(newFilesPromise)

            }

            if (req.body.removed_files) {
                const removedFilesId = req.body.removed_files.split(',');

                removedFilesId.splice(removedFilesId.length - 1, 1);

                const removedFilesPromise = removedFilesId.map((id) => Recipes.recipeFileDelete({file_id: id, recipe_id: req.body.id}))
                await Promise.all(removedFilesPromise)
            }

            const success = 'Receita atualizada com sucesso!'

            return res.redirect(`/admin/recipes/${req.body.id}?success=${success}`)

        } catch(err) {
            console.error(err)
            const error = 'Opa, ocorreu um erro na edição da receita. Por favor tente novamente'
            return res.redirect(`/admin/recipes/${req.body.id}?error=${error}`)
        }

    },
    async delete(req, res){
        try {
            const results = await Recipes.recipeFiles(req.body.id)

            const removeRecipeFilesPromise = results.rows.map((file) => Recipes.recipeFileDelete({file_id: file.file_id, recipe_id: req.body.id}))
            await Promise.all(removeRecipeFilesPromise)
            
            await Recipes.recipeDelete(req.body.id)

            const success = 'Receita deletada com sucesso!'

            return res.redirect(`/admin/recipes?success=${success}`)

        } catch(err) {
            console.error(err)
            const error = 'Opa, ocorreu um erro deletando a receita. Por favor tente novamente'
            return res.redirect(`/admin/recipes/${req.body.id}?error=${error}`)
        }
    },
}