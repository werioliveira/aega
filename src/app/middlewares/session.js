
module.exports = {
        async isConnected(req, res, next) {
        const account_id = req.session.account_id;
        if (!account_id) {
            return res.redirect('/?error=' + encodeURIComponent('NeedLogin'))
           // return res.render('layout/index',{error: "Por Favor Efetue o Login"})
        }
        next();
    }
}