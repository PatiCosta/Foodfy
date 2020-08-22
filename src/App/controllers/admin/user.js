const User = require('../../models/admin/users')

const crypto = require('crypto')
const mailer = require('../../../lib/mailer')

module.exports = {
    async list(req, res) {
        const { error, success } = req.query
        let users = await User.list()
        users = users.rows

        return res.render('user/users/index', { users, error, success })
    },
    create(req, res) {
        try {
            const { error, success } = req.query
            return res.render('user/users/create', {
                error,
                success
            })
        } catch(err) {
            console.error(err)
            const error = 'Ocorreu um erro. Tente novamente'
            return res.redirect(`/admin/users?error=${error}`)
        }
    },
    async post(req, res) {
        try {
            let user = req.body

            // Create password
            const password = crypto.randomBytes(6).toString("hex")
            console.log(password)

            // Send password to email
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Bem vindo ao Foodfy!',
                html: `
                    <h2>Olá! Que bom que agora você faz parte do time foodfy :)</h2>
                    <p>Para entrar em nosso sistema, basta utilizar o link abaixo:</p>
                    <p>
                        <a href="http://localhost:3000/admin/login" target="_blank">
                        Fazer o login
                        </a>
                    </p>
                    <p>Sua senha é: ${password}. Para alterá-la, você pode clicar em Esqueci minha senha e seguir os passos para criar uma nova.</p>
                `,
            })

            user = {
                ...user,
                password
            }

            const userId = await User.create(user)

            const success = 'Usuário cadastrado com sucesso'
            return res.redirect(`/admin/users/${userId}?success=${success}`)

        } catch(err) {
            console.error(err)
            const error = 'Houve um erro na criação do usuário. Por favor tente novamente'
            return res.render('user/users/create', {
                error
            })
        }
    },
    async edit(req, res) {
        try {
            const { error, success } = req.query
            const id = req.params.id
            const user = await User.findOne({ where: {id}})

            return res.render('user/users/edit', { user, error, success })
        } catch(err) {
            console.error(err)
            const error = 'Ocorreu um erro. Tente novamente'
            return res.redirect(`/admin/users?error=${error}`)
        }
    },
    async put(req, res) {
        try {
            let userId = req.body.id

            if (!req.body.is_admin) {
                req.body = {
                    ...req.body,
                    is_admin: false
                }
            } else {
                req.body.is_admin = true
            }

            let { name, email, is_admin} = req.body

            await User.update(userId, {
                name,
                email,
                is_admin
            })

            return res.render('user/users/edit', {
                user: req.body,
                success: 'Conta atualizada com sucesso!'
            })

        } catch(err) {
            console.error(err)
            return res.render('user/users/edit', {
                error: "Algum erro aconteceu! Tente novamente"
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id)
            const success = "Usuário deletado com sucesso"
            return res.redirect(`/admin/users?success=${success}`)
        } catch(err) {
            console.error(err)
            return res.redirect(`/admin/users/${req.body.id}`, {
                user: req.body,
                error: "Erro ao tentar deletar a conta!"
            })
        }
    }
    
} 