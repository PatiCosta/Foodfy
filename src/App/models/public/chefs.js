const db = require('../../../config/db')

module.exports = {
    all() {
        return db.query(`
        SELECT chefs.*, count(recipes) as total_recipes, files.path as avatar
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        LEFT JOIN files ON (files.id = chefs.file_id)
        GROUP BY chefs.id, files.id
        `)
    },
}

