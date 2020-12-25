const Ranking = require('../models/RankingModel');
const User = require('../models/UserModel');
const mailer = require('../../config/mailer');
const sha1 = require('sha1')

module.exports = {
    async index(req, res) {
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        let notices = await User.findNotices();
        notices = notices[0]
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;

        return res.render('layout/index',{players,guilds, countPlayer, session, notices});
    },
    async notices(req,res){
        let id = req.params.id
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        if(!id){
            return res.redirect('/')
        }
        let notices = await User.findNoticesById(id);
        if(notices[0][0] == null)
            return res.redirect('/')
        notices = notices[0][0] 
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;     
        return res.render('main/notices-page',{players,guilds, countPlayer, session, notices});
    },
    async loginAdm(req,res){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;  
        return res.render('adm/index',{players,guilds, countPlayer, session});
    },
    async admEditor(req,res){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;  
        const {editor1, title, subtitle, preview} = req.body
        if(!editor || !title || !subtitle || !preview){
            return res.render('adm/index',{players,guilds, countPlayer, session});
        }
        const notice = {
            editor1,
            title,
            subtitle,
            preview,
        }
        await User.addNotice(notice)
        return res.render('adm/index',{players,guilds, countPlayer, session});
    },
    async lostPass(req, res) {
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;

        return res.render('main/lost-password',{players,guilds, countPlayer, session});
    },
    async lostPassPost(req,res){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        let ip = req.connection.remoteAddress
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;
        let token = Math.random().toString().slice(2,12);
        let {login,email} = req.body;
        let id_account = await User.findByLogin(login)
        if(id_account[0][0].email != email)
            return res.render('main/lost-password',{players,guilds, countPlayer, session, error: "Erro de email de recuperação"});
        id_account = id_account[0][0].id
        await User.findByIdAndUpdate(id_account,{
            passlost_token: token,
        })
        try{
            const info = await mailer.transport.sendMail({
                to: email,
                from:  process.env.EMAIL,
                subject: "Gerenciamento de Conta",
                html: `<h1>Recuperar minha senha</h1><p class="input-label">Por favor, não compartilhe sua senha com ninguém.</p><br><br><br><div style="background: #E2E2E2;margin: 0px auto;width: 600px;padding-bottom: 20px;height:auto;font-family: \'Meiryo\', Osaka, Arial, sans-serif;font-size: 12px;overflow: hidden;"><br><br><div style="width: 540px;background: #efefef;height: auto;margin:0px auto;margin-top: 30px;"><h2 style="font-size: 14px;font-weight: bold;color: #545454;padding: 5px;padding-left: 20px;margin: 0px;margin-bottom: -5px;">Recuperação de senha</h2><hr><div style="padding:20px;padding-top:10px;"><br><table style="width:100%;font-size: 12px;"><tbody><tr style="background: #dedede;height: 30px;"><td style="text-align: right;font-weight: bold;width: 50%;padding-right: 20px;">Codigo de recuperação : </td><td style="padding-left:20px;">${token}</td></tr><tr style="background: #F2F2F2;height: 30px;"><td style="text-align: right;font-weight: bold;width: 50%;padding-right: 20px;">IP : </td><td style="padding-left:20px;">${ip}</td></tr></tbody></table></div></div><br></div>`,
            },
            
             (err) => {

            })
        }catch(error){
            console.log(error)
            return res.redirect('/lost-pass'); 
        } 
        return res.render('main/lost-password-code',{players,guilds, countPlayer, session});
    },
    async lostCodePost(req,res){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        let {login,cod} = req.body;
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let token = Math.random().toString().slice(2,12);
        let account = await User.findByLogin(login)
        let email = account[0][0].email
        let ip = req.connection.remoteAddress
        let session = req.session;
        if(account){
            let code = await User.selectCode(login,cod)
            if(!code){
                return res.render('main/lost-password-code',{players,guilds, countPlayer, session, error:"Codigo ou conta invalida(o)"});
            }
            await User.updatePassword(login,token)
            try{
                const info = await mailer.transport.sendMail({
                    to: email,
                    subject: "Gerenciamento de Conta",
                    from:  process.env.EMAIL,
                    html: `<h1>Alterar minha senha atual</h1><p class="input-label">Por favor, não compartilhe sua senha com ninguém.</p><br><br><br><div style="background: #E2E2E2;margin: 0px auto;width: 600px;padding-bottom: 20px;height:auto;font-family: \'Meiryo\', Osaka, Arial, sans-serif;font-size: 12px;overflow: hidden;"><br><br><div style="width: 540px;background: #efefef;height: auto;margin:0px auto;margin-top: 30px;"><h2 style="font-size: 14px;font-weight: bold;color: #545454;padding: 5px;padding-left: 20px;margin: 0px;margin-bottom: -5px;">Mudança de senha</h2><hr><div style="padding:20px;padding-top:10px;"><br><table style="width:100%;font-size: 12px;"><tbody><tr style="background: #dedede;height: 30px;"><td style="text-align: right;font-weight: bold;width: 50%;padding-right: 20px;">Nova Senha : </td><td style="padding-left:20px;">${token}</td></tr><tr style="background: #F2F2F2;height: 30px;"><td style="text-align: right;font-weight: bold;width: 50%;padding-right: 20px;">IP : </td><td style="padding-left:20px;">${ip}</td></tr></tbody></table></div></div><br></div>`,
                },
                
                 (err) => {

                })
            }catch(error){
                return res.render('layout/index',{players,guilds, countPlayer, session, error: "Não é possível enviar o email com a senha"})
            } 
            await User.findByIdAndUpdate(account[0][0].id)
        }else{
            return res.redirect('/lost-pass'); 
        }
        return res.render('layout/index',{players,guilds, countPlayer, session, success: "Senha resetada e enviada ao email"})
    },
    async lostCode(req,res){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;  

        return res.render('main/lost-password-code',{players,guilds, countPlayer, session})

    },
    async download(req,res){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        let links = await User.findDownload()
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;
        links = links[0][0]

        return res.render('main/download',{players,guilds, countPlayer, session, links});
    },
    async painel(req,res){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;

        return res.render('main/painel',{players,guilds, countPlayer, session});
    },
    async login(req, res){
        var username = req.body.login;
        var password = req.body.password;

        if (username && password) {
            let account = await User.findAccount(username,password);
            
                if (account[0].length == 0) {
                    return res.render('layout/index',{players,guilds, countPlayer, session, error: "Login ou senha incorretos"})

                } else {
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.account_id = account[0][0].id
                    req.session.cash = account[0][0].coins
                    req.session.email = account[0][0].email
                    req.session.webadmin = account[0][0].web_admin
                    res.redirect('/');  
                }			
        }    
        else{
            return res.render('layout/index',{players,guilds, countPlayer, session, error: "Não é possível verificar o login"})
        }  
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    },
    async resetPassword(req,res){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;
        
        return res.render('main/reset-password.njk',{players,guilds, countPlayer, session})
    },
    async resetPasswordPost(req, res){
        let session = req.session;
        let email = session.email   
        let oldpassword = req.body.password
        let newPassword = req.body.newPassword
        let check = await User.findAccount(session.username,oldpassword) 
        check = check[0][0]
        let ip = req.connection.remoteAddress
        if (!check)
            return res.redirect('/reset-password'); 

        let updated = await User.updatePassword(check.login, newPassword)  
        if (!updated)
            return res.redirect('/reset-password');      
    
        try{
            const info = await mailer.transport.sendMail({
                to: email,
                subject: "Gerenciamento de Conta",
                from:  process.env.EMAIL,
                html: `<h1>Alterar minha senha atual</h1><p class="input-label">Por favor, não compartilhe sua senha com ninguém.</p><br><br><br><div style="background: #E2E2E2;margin: 0px auto;width: 600px;padding-bottom: 20px;height:auto;font-family: \'Meiryo\', Osaka, Arial, sans-serif;font-size: 12px;overflow: hidden;"><br><br><div style="width: 540px;background: #efefef;height: auto;margin:0px auto;margin-top: 30px;"><h2 style="font-size: 14px;font-weight: bold;color: #545454;padding: 5px;padding-left: 20px;margin: 0px;margin-bottom: -5px;">Mudança de senha</h2><hr><div style="padding:20px;padding-top:10px;"><br><table style="width:100%;font-size: 12px;"><tbody><tr style="background: #dedede;height: 30px;"><td style="text-align: right;font-weight: bold;width: 50%;padding-right: 20px;">Nova Senha : </td><td style="padding-left:20px;">${newPassword}</td></tr><tr style="background: #F2F2F2;height: 30px;"><td style="text-align: right;font-weight: bold;width: 50%;padding-right: 20px;">IP : </td><td style="padding-left:20px;">${ip}</td></tr></tbody></table></div></div><br></div>`,
            },
            
             (err) => {

            })
        }catch(error){
            return res.redirect('/reset-password'); 
        } 
        return res.redirect('/reset-password');        
    },
    async socialId(req, res){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;
        let resetSocial = await User.findSocialID(session.account_id)
        let email = resetSocial[0][0].email
        

        return res.render('main/social-id',{players,guilds, countPlayer, session,email});        
    },
    async socialIDPost(req, res){
        let session = req.session;
        await User.findSocialIdAndUpdate(session.account_id)
        let email = session.email
        let social_id = await User.findSocialID(session.account_id)
        social_id = social_id[0][0].social_id
        let ip = req.connection.remoteAddress
        try{
            const info = await mailer.transport.sendMail({
                to: email,
                subject: "Gerenciamento de Conta",
                from:  process.env.EMAIL,
                html: `<h1>Código de exclusão de personagem</h1><p class="input-label">Por favor, não compartilhe seu código com ninguém.</p> <div style="width: 400px;margin: 0px auto;"><table style="width: 100%;background: #C8C8C8;"><tbody><tr style="background: #F2F2F2;height: 30px;"><td style="text-align: right;font-weight: bold;width: 50%;padding-right: 20px;">Senha do Personagem: </td><td style="padding-left:20px;">${social_id}</td></tr><tr style="background:#dedede;height:30px"><td style="text-align:right;font-weight:bold;width:50%;padding-right:20px">IP : </td><td style="padding-left:20px">${ip}</td></tr></tbody></table></div>`,
            },
            
             (err) => {
            })
        }catch(error){
            return res.redirect('/reset-social'); 
        }
        return res.redirect('/reset-social'); 
    },
    async register(req, res) {
        let session = req.session;
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count

        return res.render('main/register',{players,guilds, countPlayer, session});
    },
    async safebox(req,res){
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let session = req.session;
        return res.render('main/safebox-reset',{players,guilds, countPlayer, session});
    },
    async safeboxResetPost(req,res){
        let session = req.session;
        await User.selectAndUpdateSafeboxPassword(session.account_id)
        let pass = await User.safeboxPassword(session.account_id)
        pass = pass[0][0].password
        let ip = req.connection.remoteAddress
        try{
            const info = await mailer.transport.sendMail({
                to: session.email,
                subject: "Gerenciamento de Conta",
                from:  process.env.EMAIL,
                html: `<html><div style="width: 400px;margin: 0px auto;"><table style="width: 100%;background: #C8C8C8;"><tbody><tr style="background: #F2F2F2;height: 30px;"><td style="text-align: right;font-weight: bold;width: 50%;padding-right: 20px;">Senha do Armazem : </td><td style="padding-left:20px;">${pass}</td></tr><tr style="background:#dedede;height:30px"><td style="text-align:right;font-weight:bold;width:50%;padding-right:20px">IP : </td><td style="padding-left:20px">${ip}</td></tr></tbody></table></div></html>`,
            },
            
             (err) => {
                
            })
        }catch(error){
            console.log(error)
            return res.redirect('/safebox-reset'); 
        }
        return res.redirect('/safebox-reset'); 
    },
    async playerUnbug(req,res){
        let session = req.session;
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count
        let chars = await User.selectPlayer(session.account_id)
        chars = chars[0]
        if(req.params.id){
            for (const ids in chars) {
                if (Object.hasOwnProperty.call(chars, ids)) {
                    const element = chars[ids];
                    if(element.id == req.params.id){
                        let char = await User.unbugPlayer(session.account_id,req.params.id)
                    }
                }
            }
            return res.render('main/player-unbug',{players,guilds, countPlayer, session, chars});
        }else{
            return res.render('main/player-unbug',{players,guilds, countPlayer, session, chars});
        }
        
    },
    async rankingPlayerAll(req,res){
        let session = req.session;
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        
        countPlayer = countPlayer[0][0].count
        try {
            let page = parseInt(req.params.page);
            if (page < 1 || !page)
                page = 1;
            let users = await Ranking.loadPlayersAll(page);
            let numPages = users.numPages
            users = users.result[0]
            
            
            return res.render('main/ranking-players',{players,guilds, countPlayer, session, users, numPages});
          } catch(e){

          }
    },
    async rankingGuilds(req,res){
        let session = req.session;
        let players = await Ranking.LoadRankPlayer();
        let guilds = await Ranking.LoadRankGuild();
        let countPlayer = await Ranking.OnlineCounter();
        players = players[0];
        guilds = guilds[0];
        countPlayer = countPlayer[0][0].count  
        let guilds2 = await Ranking.loadGuilds()
        guilds2 = guilds2[0]
        return res.render('main/ranking-guilds',{players,guilds, countPlayer, session, guilds2});
    },
}