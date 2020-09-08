# Foodfy - Web App to explore and manage recipes. 
> Challenge from Launchbase Bootcamp at RocketSeat. 

# Features
- Search recipes
- Upload images to the recipes with Multer
- Dynamic content with Nunjucks
- Create fake recipes, chefs and users with Faker.js
- Create an user to manage recipes
- As an admin user, manage chefs and other users. Also, invite others to participate via e-mail
- Forgot your password? With nodemailer sent e-mails to reset 
- Messages are shown every time something goes wrong or right

# Techs used
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [NodeJS](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)
- [Express](https://expressjs.com/pt-br/)
- [Faker.js](https://github.com/marak/Faker.js/)
- [Multer](https://www.npmjs.com/package/multer)
- [Bcrypt.js](https://github.com/kelektiv/node.bcrypt.js/)
- [Connect PG Simple](https://github.com/voxpelli/node-connect-pg-simple)
- [Nodemailer](https://nodemailer.com/about/)

# Getting Started

You need to install these to run your project: [NodeJS and NPM](https://nodejs.org/en/), [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [PostgreSQL](https://www.postgresql.org/) and [Postbird](https://www.electronjs.org/apps/postbird)

**1. Clone this repository in your directory**

    git clone https://github.com/PatiCosta/foodfy.git

**2. Install all dependencies (you can check them in the packed-lock.json file)**

    npm install

**3. Changes in files**

    You have to change the db.js file (located in src/config) with your PostgreSQL settings
    You have to change the mailer.js file (located in src/lib) with yout Mailtrap settings

**4. Create the database**

    Just import the database.sql file into your postbird. Remember to create a new database with the name 'foodfy'

**5. Run Seeds.js**

    node seeds.js
    
**Obs.** To use an admin user, the e-mail is *admin@foodfy.com.br* and the password is *111*. To use a normal user, the e-mail is *user@foodfy.com.br* and the password is *111* as well.
    
**6. Start server**

    npm start

To go to the app, access your localhost:3000

# Status
Project finished! Made with love in 2020 <3
