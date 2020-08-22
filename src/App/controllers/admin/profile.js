const User = require('../../models/admin/users')

module.exports = {
    async index(req, res) {
        const { error, success } = req.query
        const {sessionId: id} = req.session
        const user = await User.findOne({ where: {id}})

        return res.render('user/users/profile', { user, error, success })
    },
    async put(req, res){
        try {
            const {user} = req
            let { name, email } = req.body

            await User.update(user.id, {
                name,
                email
            })

            const success = 'Conta atualizada com sucesso'

            return res.redirect(`/admin/profile?success=${success}`)

        }catch(err) {
            console.error(err)
            const error = 'Ocorreu algum erro ao atualizar a conta. Por favor tente novamente.'
            return res.redirect(`/admin/profile?error=${error}`)
        }
    }
}