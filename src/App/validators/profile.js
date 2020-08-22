const User = require('../models/admin/users')
const {compare} = require('bcryptjs')


async function update (req, res, next) {
    const { id, password } = req.body

    if(!password) return res.render('user/users/show', {
        user: req.body,
        error: "Coloque sua senha para atualizar seu cadastro"
    })

    const user = await User.findOne({ where: {id}})
    const passed = await compare(password, user.password)

    if(!passed) return res.render('user/users/show', {
        user: req.body,
        error: "Senha incorreta"
    })

    req.user = user

    next()
}

module.exports = {
    update,
}