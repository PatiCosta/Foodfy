const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./src/routes")
const methodOverride = require('method-override')
const session = require('./src/config/session')

const server = express()

// login admin
// admin patriicosouza@hotmail.com b80b6d49d030

server.use(session)
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

server.use(methodOverride('_method'))
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure("./src/App/views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(3000, function(){
    console.log("Server is running")
})