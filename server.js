const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./src/routes")
const server = express()
const methodOverride = require('method-override')

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