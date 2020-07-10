const db = require('../../config/db')

module.exports = {
    index(callback) {
        let query = 
        `SELECT * FROM recipes`

        db.query(query, function(err, results) {
            if(err) throw `Database error! ${err}` 

            return callback(results.rows)
        })
    },
    find(id, callback) {
        db.query(`SELECT * FROM recipes WHERE id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}` 

            return callback(results.rows[0])
        })
    },
    chefs(callback) {
        let query = 
        `SELECT * FROM chefs`

        db.query(query, function(err, results) {
            if(err) throw `Database error! ${err}` 

            return callback(results.rows)
        })
    },
    findBy(filter, callback){
        db.query(`SELECT * FROM recipes WHERE recipes.title ILIKE '%${filter}%'`, function(err, results){
            if(err) throw `Database error! ${err}` 

            return callback(results.rows)
        })
    }
}