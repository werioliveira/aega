const User = require('../models/UserModel');
const Ranking = require('../models/RankingModel');
module.exports = {
    login(req, res, next) {
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;
        const { login, password } = req.body;

        if (!login) {
            return res.render('layout/index',{players,guilds, countPlayer, session, error: "Não é possível verificar o login"})
        }
        if (!password) {
            return res.render('layout/index',{players,guilds, countPlayer, session, error: "Não é possível verificar a senha"})
        }

        next();
    },

}