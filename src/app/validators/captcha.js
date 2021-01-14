const User = require('../models/UserModel');
const Ranking = require('../models/RankingModel');
const request = require('request')
module.exports = {
    async captchaVerified(req, res, next) {
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;
        if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            //return res.redirect(401,'/register'); 
            return res.render('main/register',{players,guilds, countPlayer, session, error:"Captcha Incorreto"})
        }
        // Put your secret key here.
        var secretKey = process.env.SECRET_CAPTCHA;
        // req.connection.remoteAddress will provide IP address of connected user.
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        // Hitting GET request to the URL, Google will respond with success or error scenario.
        request(verificationUrl,function(error,response,body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) {
                return res.render('main/register',{players,guilds, countPlayer, session, error:"Erro na verificação do captcha"})
            }
        });
        next();
    }
}