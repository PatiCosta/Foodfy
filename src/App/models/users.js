const db = require('../../config/db')
const { date } = require('../lib/utils')

module.exports = {
    recipeCreate(data, callback){

        const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database error! ${err}` 

            return callback(results.rows[0])
        })
    },

    recipeIndex(callback) {
        let query = `            
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            `

        db.query(query, function(err, results) {
            if(err) throw `Database error! ${err}` 

            return callback(results.rows)
        })
    },

    recipeFind(id, callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chef
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}` 

            return callback(results.rows[0])
        })
    },

    recipeUpdate(data, callback) {
        const query = `UPDATE recipes SET chef_id=($1), image=($2), title=($3), ingredients=($4), preparation=($5), information=($6) WHERE id = $7`
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database error! ${err}` 

            return callback()
        })
    },

    recipeDelete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database error! ${err}` 

            return callback()  
        })
    },

    chefOptions(callback) {
        db.query(`SELECT * FROM chefs`, function(err, results){
            if (err) throw `Database error! ${err}`

            return callback(results.rows)
        })
    },


    chefCreate(data, callback) {
        const query = `
            INSERT INTO chefs (
                name,
                avatar_url
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url
        ]
        db.query(query, values, function(err, results) {
            if (err) throw `Database error! ${err}`

            return callback(results.rows[0])
        })
    },

    chefFind(id, callback) {
        db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id], function(err, results) {
            if (err) throw `Database error! ${err}`

            return callback(results.rows[0])
        })
    },

    chefUpdate(data, callback) {

        const query = `
            UPDATE chefs SET
                name=($1),
                avatar_url=($2)
            WHERE id = $3
            `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) `Database error! ${err}`

            return callback()
        })        
    },

    chefDelete(id, callback) {
        db.query(`
            DELETE FROM chefs 
            WHERE id = $1`, [id], function(err, results) {
            if(err) `Database error! ${err}`

            callback()
        })
    },

    chefRecipes(id, callback) {
        db.query(`
            SELECT recipes.*
            FROM recipes
            WHERE recipes.chef_id = $1`, [id], function(err, results) {
                if (err) throw `Database error! ${err}`

                callback(results.rows)
        })
    },

    chefIndex(callback) {
        db.query(`
            SELECT chefs.*, count(recipes) AS recipes_amount
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY name`, function(err, results){
            if (err) throw `Database error! ${err}`

        return callback(results.rows)
        })

    }
}
