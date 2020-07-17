const db = require('../../config/db')

module.exports = {
    index(callback) {
        let query = `            
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`

        db.query(query, function(err, results) {
            if(err) throw `Database error! ${err}` 

            return callback(results.rows)
        })
    },
    search(filter, callback) {
        let query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        `

        db.query(query, function(err, results){
            if (err) throw `Database error! ${err}`

            return callback (results.rows)
        })
    },
    find(id, callback) {
        db.query(`SELECT recipes.*, chefs.name AS chef
                    FROM recipes
                    LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
                WHERE recipes.id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}` 

            return callback(results.rows[0])
        })
    },
    chefs(callback) {
        db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY name`, function(err, results){
            if (err) throw `Database error! ${err}`

            return callback(results.rows)
        })
    },
    allRecipes(callback) {
        db.query(`SELECT * FROM recipes`, function(err, results){
            if(err) throw `Database error! ${err}` 

            return callback(results.rows)
        })
    }
}