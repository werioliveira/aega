const express = require('express');
const routes = express.Router();
const account = require('./app/validators/account')
const captcha = require('./app/validators/captcha')
const session = require('./app/middlewares/session')

const SiteController = require('./app/controllers/SiteController')

routes.get('/', SiteController.index)
routes.post('/',account.login,SiteController.login)
routes.get('/download', SiteController.download)
routes.get('/register', SiteController.register);
routes.post('/register', captcha.captchaVerified,account.postAccount,SiteController.registerPost)
routes.get('/ranking-guilds', SiteController.rankingGuilds)
routes.get('/ranking-players', SiteController.rankingPlayerAll)


routes.use(session.isConnected)
routes.get('/painel',SiteController.painel)

routes.get('/reset-social',SiteController.socialId)
routes.post('/reset-social',SiteController.socialIDPost)
routes.get('/reset-password',SiteController.resetPassword)
routes.post('/reset-password',SiteController.resetPasswordPost)
routes.get('/safebox-reset',SiteController.safebox)
routes.post('/safebox-reset',SiteController.safeboxResetPost)
routes.get('/player-unbug',SiteController.playerUnbug)
routes.get('/player-unbug/:id',SiteController.playerUnbug)
//routes.get('/ranking-players/:page',SiteController.rankingPlayerAll)
routes.get('/logout',SiteController.logout)

routes.get('/lost-pass',SiteController.index)


module.exports = routes