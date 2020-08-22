const Chefs = require('../../models/admin/chefs')
const Recipes = require('../../models/admin/recipes')

const Files = require('../../models/admin/files')

module.exports = {
    async all(req, res) {
        const {success, error} = req.query

        let results = await Chefs.all(req.params.id)
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

        return res.render("user/chefs/index", {chefs: finalChefs, success, error})
    },
    async show(req, res) {
        const {success, error} = req.query

        let results = await Chefs.find(req.params.id)
        let chef = results.rows[0]
        let avatar = chef.avatar

        if (avatar) {
            chef = {
                ...chef,
                avatar: `${req.protocol}://${req.headers.host}${avatar.replace("public","")}`
            }
        }

        const notFound = 'Chef não encontrado'
        if(!chef) return res.redirect(`/admin/chefs?error=${notFound}`)

        let recipesResults = await Chefs.chefRecipes(req.params.id)
        let recipes = recipesResults.rows

        let finalRecipes = new Array()

        if (recipes[0].id != null) {
            for (recipe of recipes) {
                let fileResults = Recipes.recipeFiles(recipe.id)
                fileResults = (await fileResults).rows[0].path

                recipe = {
                    ...recipe,
                    src: `${req.protocol}://${req.headers.host}${fileResults.replace("public", "")}`
                }
                
                finalRecipes.push(recipe)
            }
        }

        return res.render("user/chefs/show", {chef, items: finalRecipes, success, error})
    },
    create(req, res) {
        const {success, error} = req.query

        return res.render('user/chefs/create.njk', {success, error})
    },
    async update (req, res) {
        const {success, error} = req.query

        let results = await Chefs.find(req.params.id)
        const chef = results.rows[0]

        const notFound = 'Chef não encontrado'
        if(!chef) return res.redirect(`/admin/chefs?error=${notFound}`)

        return res.render("user/chefs/edit.njk", { chef, success, error })
    },
    async post (req, res) {
        try {
            if (!req.file)
            return res.send('Please, send one avatar')

            const file = await Files.create({name: req.file.filename, path: req.file.path})
            const file_id = file.rows[0].id

            let results = await Chefs.create({name: req.body.name, file_id})
            const chefId = results.rows[0].id

            const success = 'Chef cadastrado com sucesso!'
            return res.redirect(`/admin/chefs/${chefId}?success=${success}`)

        } catch(err) {
            console.error(err)
            const error = 'Ocorreu um erro ao cadastrar o chef. Por favor tente novamente'
            return res.redirect(`/admin/chefs/create?error=${error}`)
        }
    },
    async put(req, res) {
        try {
            let chef = await Chefs.find(req.body.id);

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

            await Chefs.update({
                id: req.body.id,
                file_id,
                name
            });
            const success = 'Chef atualizado com sucesso!'
        
            return res.redirect(`/admin/chefs/${req.body.id}?success=${success}`)

        } catch(err) {
            console.error(err)
            const error = 'Ocorreu um erro ao atualizar o chef. Por favor tente novamente'
            return res.redirect(`/admin/chefs/${req.body.id}?error=${error}`)
        }
    },
    async delete(req, res) {
        try {
            const chef = await Chefs.find(req.body.id)
            let chefFile = chef.rows[0].file_id

            await Chefs.delete(req.body.id)

            if (chefFile != null ) {
                await Files.delete(chefFile)
            }

            const success = "Chef deletado com sucesso!"
            return res.redirect(`/admin/chefs?success=${success}`)

        } catch(err) {
            console.error(err)
            const error = 'Ocorreu um erro ao deletar o chef. Por favor tente novamente'
            return res.redirect(`/admin/chefs/${req.body.id}?error=${error}`)
        }
    }
}