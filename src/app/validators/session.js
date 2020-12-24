module.exports = {
    login(req, res, next) {

        const { login, password } = req.body;

        if (!login) {
            return res.render('layout/index',{error: "Não é possível verificar o login"})
        }
        if (!password) {
            return res.render('layout/index',{error: "Não é possível verificar a senha"})
        }

        next();
    },
}