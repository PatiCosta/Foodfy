const Chefs = require('../../models/public/chefs')

module.exports = {
    async all(req, res) {
        let results = await Chefs.all(req.params.id)
        let chefs = results.rows

        let finalChefs = new Array()

        for (chef of chefs) {
            let avatar = chef.avatar
            if (avatar != null) {
                chef = {
                    ...chef,
                    avatar: `${req.protocol}://${req.headers.host}${avatar.replace("public","")}`
                }
            }
            finalChefs.push(chef)
        }

        return res.render("./public/chefs", {chefs: finalChefs})

    }
}