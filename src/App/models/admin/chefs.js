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
    create(data) {
        const query = `
            INSERT INTO chefs (
                name,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            data.name,
            data.file_id
        ]
        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT chefs.*, count(recipes) as total_recipes,
            (SELECT files.path
                FROM chefs
                RIGHT JOIN files ON (files.id = chefs.file_id)
                WHERE chefs.id = $1
            ) AS avatar
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            `, [id])
    },
    chefFile(id) {
        return db.query(`
        SELECT files.* FROM files
            LEFT JOIN chefs ON (chefs.file_id = files.id)
        WHERE chefs.id = $1
        `, [id])
    },
    update({id, file_id, name}) {

        const query = `
            UPDATE chefs SET
                name=($1),
                file_id=($2)
            WHERE id = $3
            `

        const values = [
            name,
            file_id,
            id
        ]

        return db.query(query, values)    
    },
    delete(id) {
        return db.query(`
            DELETE FROM chefs 
            WHERE id = $1`, [id])
    },
    chefRecipes(id) {
        return db.query(`
            SELECT recipes.*, chefs.name as chef_name
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            ORDER BY recipes.created_at DESC
        `, [id])
    }
}