const express = require('express');
const routes = express.Router();
const SiteController = require('../controllers/SiteController');
const account = require('../validators/account');
const captcha = require('../validators/captcha')

routes.get('/', SiteController.index)
routes.post('/',account.login,SiteController.login)
routes.get('/download', SiteController.download)
routes.get('/register', SiteController.register);
routes.post('/register', captcha.captchaVerified,account.postAccount)
routes.get('/ranking-guilds', SiteController.rankingGuilds)
routes.get('/ranking-players', SiteController.rankingPlayerAll)
routes.get('/lost-pass',SiteController.lostPass)
routes.post('/lost-pass',SiteController.lostPassPost)
routes.get('/lost-code',SiteController.lostCode)
routes.post('/lost-code',SiteController.lostCodePost)
routes.get('/notices/:id',SiteController.notices)

module.exports = routes