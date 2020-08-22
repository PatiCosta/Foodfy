const crypto = require('crypto')
const User = require('../../models/admin/users')
const mailer = require('../../../lib/mailer')

const {hash} = require('bcryptjs')

module.exports = {
    loginForm(req, res) {
        const { success, error } = req.query
        return res.render('session/index', {success, error})
    },
    login(req, res) {
        try {
            req.session.sessionId = req.user.id
            req.session.isAdmin = req.user.is_admin

            return res.redirect('/admin/recipes')

        } catch(err) {
            console.error(err)
            const error = 'Ocorreu um erro ao fazer o login. Por favor tente novamente'
            return res.redirect(`/admin/login?error=${error}`)
        }
    },
    logout(req, res) {
        try {
            req.session.destroy()
            return res.redirect('/admin/login')
        } catch(err) {
            console.error(err)
            const error = 'Ocorreu um erro ao fazer o logout. Por favor tente novamente'
            return res.redirect(`/admin/recipes?error=${error}`)
        }
    },
    forgotForm(req, res) {
        const {error, success} = req.query
        return res.render('session/forgot', {
            error,
            success
        })
    },
    async forgot(req, res) {
        const user = req.user

        try {

            // token
            const token = crypto.randomBytes(20).toString("hex")

            // create an token expire
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // send and email with recuperation link
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy',
                subject: 'Recuperação de senha',
                html: `
                <h2>Perdeu a chave?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/admin/password-reset?token=${token}" target="_blank">Recuperar senha</a>
                </p>
                `
            })

            // advise user that we sent the email

            return res.render("session/forgot", {
                success: "Verifique seu email para resetar sua senha!"
            })

        } catch(err) {
            console.error(err)

            return res.render("session/forgot", {
                error: "Ocorreu um erro, por favor tente novamente"
            })
        }
    },
    resetForm(req, res) {
        const { error, success } = req.query
        return res.render('session/reset', {
            token: req.query.token,
            success,
            error
        })
    },
    async reset(req, res) {

        const { password, token } = req.body
        const user = req.user

        try {
            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            return res.render('session/index', {
                user: req.body,
                success: "Senha atualizada! Faça seu login"
            })


        } catch(err) {
            console.error(err)

            return res.render("session/reset", {
                user: req.body,
                token,
                error: "Ocorreu um erro, por favor tente novamente."
            })
        }
    }

}