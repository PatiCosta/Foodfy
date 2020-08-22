
function onlyUsers(req, res, next) {
    if(!req.session.sessionId) return res.redirect('/admin/login')

    next()
}

function onlyAdminChefs(req, res, next) {
    if( req.session.isAdmin == false) {
        return res.redirect('/admin/chefs')
    }

    next()
}

function onlyAdminUsers(req, res, next) {
    if( req.session.isAdmin == false) {
        return res.redirect('/admin/profile')
    }

    next()
}

function isLoggedRedirect(req, res, next) {
    if (req.session.sessionId && req.session.isAdmin == true) return res.redirect('/admin/users')

    if (req.session.sessionId && req.session.isAdmin == false) return res.redirect('/admin/profile')

    next()
}

function onlyOtherAdmin(req, res, next) {
    if (req.session.sessionId == req.body.id) return res.redirect('/admin/users')

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirect,
    onlyAdminChefs,
    onlyAdminUsers,
    onlyOtherAdmin
}