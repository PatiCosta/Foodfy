const {hash} = require ('bcryptjs')
const faker = require('faker')

const { date } = require('./src/lib/utils')

const Users = require('./src/App/models/admin/users')
const Recipes = require('./src/App/models/admin/recipes')
const Files = require('./src/App/models/admin/files')
const Chefs = require('./src/App/models/admin/chefs')

let filesIds = []
let chefsIds = []
let usersIds = []

let totalFiles = 8
let totalChefs = 8
let totalRecipes = 10


async function createUsers() {
    try {
        const password = await hash('111', 8)

        const adminId = await Users.create({
            name: 'Admin',
            email: 'admin@foodfy.com.br',
            password,
            is_admin: true
        }) 

        usersIds.push(adminId)

        const notAdminId = await Users.create({
            name: 'Usuário',
            email: 'user@foodfy.com.br',
            password,
            is_admin: false
        })

        usersIds.push(notAdminId)
    } catch (error) {
        console.error(error);
    }
}

async function createChefFiles() {
    try {
        let files = []

        while(files.length < totalFiles) {
            files.push({
                name: faker.image.image(),
                path: `public/images/placeholder.png`
            })
        }

        const filesPromise = files.map(async file => {
            const results = await Files.create(file)
            const id = results.rows[0].id

            return id
        })

        filesIds = await Promise.all(filesPromise)
    } catch (error) {
        console.error(error);
    }
}

async function createChefs() {
    try {
        let chefs = []

        while(chefs.length < totalChefs) {
            chefs.push({
                name: faker.name.firstName(),
                file_id: filesIds[Math.floor(Math.random() * totalFiles)] 
            })
        }

        const chefsPromise = chefs.map( async chef => {
            const results = await Chefs.create(chef)
            const id = results.rows[0].id

            return id
        } )

        chefsIds = await Promise.all(chefsPromise)

    } catch (error) {
        console.error(error);
    }
}

async function createRecipes() {
    try {
        let recipes = []

        while(recipes.length < totalRecipes) {
            recipes.push({
                chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
                title: faker.name.title(),
                ingredients: [
                    'ingrediente 1',
                    'ingrediente 2',
                    'ingrediente 3'
                ],
                preparation: [
                    'preparação 1',
                    'preparação 2',
                    'preparação 3'
                ],
                information: faker.lorem.paragraphs(5,','),
                created_at: date(Date.now()).iso,
            })
        }

        const recipesPromise = recipes.map( async recipe => {
            const recipeResult = Recipes.create(recipe, usersIds[Math.floor(Math.random() * 2)])
            const recipe_id = (await recipeResult).rows[0].id

            const file = {
                filename: faker.image.image(),
                path: `public/images/placeholder.png`
            }

            await Recipes.recipeFileCreate({file, recipe_id})

            return recipe_id
        })

        await Promise.all(recipesPromise)
        
    } catch (error) {
        console.error(error);
    }
}

async function init() {
    await createUsers()
    await createChefFiles()
    await createChefs()
    await createRecipes()
}

init()