const User = require('../models/UserModel');
const Ranking = require('../models/RankingModel');
module.exports = {
    async isConnected(req, res, next) {
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;
        const account_id = session.account_id;
        if (!account_id) {
            //return res.redirect('/?error=' + encodeURIComponent('NeedLogin'))
            return res.render('layout/index',{players,guilds, countPlayer, session, error:"Por Favor Efetue o Login"}); 
        }
        next();
    },
    async admin(req,res,next){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;
        if (session.webadmin != 9) {
            return res.render('main/painel',{players,guilds, countPlayer, session, error: "Conta não autorizada"})
        }
        next();            
    }
}