const express = require('express');
const routes = express.Router();
const SiteController = require('../controllers/SiteController');
const session = require('../middlewares/session')

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
routes.get('/logout',SiteController.logout)

module.exports = routes