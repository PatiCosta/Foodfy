const Recipes = require('../models/admin/recipes')

async function onlyOwnerOrAdmin (req, res, next) {
    let results = ""

    if (req.params.id) {
        results = await Recipes.find(req.params.id)
    } else {
        results = await Recipes.find(req.body.id)
    }

    const recipe = results.rows[0]

    if (req.session.sessionId !== recipe.user_id && req.session.isAdmin == false) {
        const error = 'Desculpe, você não pode alterar esta receita'
        return res.redirect(`/admin/recipes?error=${error}`)
    }

    next()
}

module.exports = {
    onlyOwnerOrAdmin,
}