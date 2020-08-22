const db = require('../../../config/db')
const {hash} = require('bcryptjs')
const Recipes = require('./recipes')
const fs = require('fs')

module.exports = {
    list () {
        let query = "SELECT * FROM users"

        return db.query(query)
    },
    async findOne(filters) {
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            query= `${query}
            ${key}
            `

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    },
    async create (data) {

        try {
            const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id
            `

            if (!data.is_admin) {
                data = {
                    ...data,
                    is_admin: false
                }
            } else {
                data.is_admin = true
            }

            const passwordHash = await hash(data.password, 8)

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.is_admin
            ]

            const results = await db.query(query, values)
            return results.rows[0].id
        } catch(err) {
            console.error(err)
        }
    },
    async update(id, fields) {
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            } else {
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = '${id}'
                `
            }
        })

        await db.query(query)
        return
    },
    async delete(id) {
        // catch all recipes
        let results = await db.query('SELECT * FROM recipes WHERE user_id = $1', [id])
        const recipes = results.rows

        // catch all files
        const allFilesPromise = recipes.map(recipe => 
            Recipes.recipeFiles(recipe.id)
            )

        let promiseResults = await Promise.all(allFilesPromise)

        // remove user
        await db.query('DELETE FROM users WHERE id = $1', [id])

        // remove images
        promiseResults.map(results => {
            results.rows.map(file => fs.unlinkSync(file.path))
        })
    }
}