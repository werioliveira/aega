const User = require('../models/UserModel');
const Ranking = require('../models/RankingModel');
const loadContent = require('../utils/loadContent');

module.exports = {
    async postAccount(req, res, next) {

        let {players, guilds, countPlayer} = await loadContent.loadInfoRankings();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;        
        
        
        if(req.body.login === undefined || req.body.login === '' || req.body.login === null || !loadContent.validateLogin(req.body.login)) {
            return res.render('main/register',{players,guilds, countPlayer, session, error:"Informe o login"}); 
        }
        if(req.body.password === undefined || req.body.password === '' || req.body.password === null || !loadContent.validatePassword(req.body.password)) {
            return res.render('main/register',{players,guilds, countPlayer, session, error:"Informe a senha"}); 
        }
        if(req.body.password2 === undefined || req.body.password2 === '' || req.body.password2 === null || !loadContent.validatePassword(req.body.password)) {
            return res.render('main/register',{players,guilds, countPlayer, session, error:"Informe a confirmação de senha"}); 
        }
        if(req.body.email === undefined || req.body.email === '' || req.body.email === null || !loadContent.validatePassword(req.body.password)) {
            return res.render('main/register',{players,guilds, countPlayer, session, error:"Informe o email"});  
        }
        if(req.body.real_name === undefined || req.body.real_name === '' || req.body.real_name === null || !loadContent.validateName(req.body.real_name)) {
            return res.render('main/register',{players,guilds, countPlayer, session, error:"Informe o nome"});  
        }     
        if(req.body.social_id === undefined || req.body.social_id === '' || req.body.social_id === null || !loadContent.validateSocial(req.body.social_id)) {
            return res.render('main/register',{players,guilds, countPlayer, session, error:"Informe o codigo de personagem"});  
        }   
        if(req.body.password != req.body.password2)  
            return res.render('main/register',{players,guilds, countPlayer, session, error:"Senhas não coincidem"});  
        const account = await User.findByLogin(req.body.login)
        if (account)
            return res.render('main/register',{players,guilds, countPlayer, session, error:"Login em uso"}); 

        next();
    },
    async login(req,res,next){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;
        if(req.body.login === undefined || req.body.login === '' || req.body.login === null || !loadContent.validateLogin(req.body.login)) {
            return res.render('layout/index',{players,guilds, countPlayer, session, error:"Digite o login"});
        } 
        if(req.body.password === undefined || req.body.password === '' || req.body.password === null || !!loadContent.validatePassword(req.body.password)) {
            return res.render('layout/index',{players,guilds, countPlayer, session, error:"Digite a senha"});
        }   
        next();    
    }
}