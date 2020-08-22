const db = require('../../../config/db')
const { date } = require('../../../lib/utils')
const Files = require("../admin/files")
const fs = require('fs');

module.exports = {
    create(data, sessionId){

        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at,
                user_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso,
            sessionId
        ]

        return db.query(query, values)
    },
    all() {
        let query = `            
        SELECT recipes.*, chefs.name as chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.created_at DESC
            `
        return db.query(query)
    },
    recipeFiles(id) {
        return db.query(`
        SELECT recipe_files.*, files.path FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
        `, [id])
    },
    find(id) {
        return db.query(`
            SELECT recipes.*, chefs.id as chef_id, chefs.name as chef_name, files.path as images
            FROM recipe_files
            FULL JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1
            `, [id])
    
    },
    update(data) {
        const query = `UPDATE recipes SET chef_id=($1), title=($2), ingredients=($3), preparation=($4), information=($5) WHERE id = $6`
        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)
    },
    recipeDelete(id) {
        return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },

    async delete (data) {
        const createFile = await Files.create({
            name: data.file.filename,
            path: data.file.path
        });
        const fileId = createFile.rows[0].id


        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES (
                $1,
                $2
            )
        `;

        return db.query(query, [data.recipe_id, fileId]);
    },
    async recipeFileCreate (data) {
        const createFile = await Files.create({
            name: data.file.filename,
            path: data.file.path
        });
        const fileId = createFile.rows[0].id


        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES (
                $1,
                $2
            )
        `;

        return db.query(query, [data.recipe_id, fileId]);
    },
    async recipeFileDelete (data) {

        const values = [
            data.recipe_id,
            data.file_id
        ]

        let query = `
            DELETE FROM recipe_files
            WHERE recipe_id = $1 AND file_id = $2
        `;

        await db.query(query, values);

        query = `
            SELECT * FROM files WHERE id = $1
        `;

        const fileResults = await db.query(query, [values[1]]);
        const file = fileResults.rows[0];


        fs.unlinkSync(file.path);

        query = `
            DELETE FROM files
            WHERE id = $1
        `;

        return db.query(query, [values[1]]);
    },
    chefOptions() {
        return db.query(`SELECT * FROM chefs`)
    },
}