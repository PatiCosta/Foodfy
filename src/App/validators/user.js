const User = require('../models/admin/users')

async function post (req, res, next) {
    const {email} = req.body
    const user = await User.findOne({ 
        where: {email}
    })
        
    if (user) return res.render('user/users/create', {
        error: 'Usuário já cadastrado',
        user: req.body
    })

    next()
}



module.exports = {
    post,
}