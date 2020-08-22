const db = require('../../../config/db')


module.exports = {
    search(filter) {
        let query = `
            SELECT recipes.*, chefs.name as chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.title ILIKE '%${filter}%'
            ORDER BY recipes.updated_at DESC
        `

        return db.query(query)
    },
    find(id) {
        return db.query(`
            SELECT recipes.*, chefs.id as chef_id, chefs.name as chef_name, files.path as images
            FROM recipe_files
            FULL JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id])
    },
    all() {
        let query = `            
        SELECT recipes.*, chefs.name as chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.created_at DESC
            `
        return db.query(query)
    },
    files(id) {
        return db.query(`
        SELECT recipe_files.*, files.path FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
        `, [id])
    }
}