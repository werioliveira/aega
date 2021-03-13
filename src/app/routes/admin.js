const express = require('express')
const routes = express.Router()
const SiteController = require('../controllers/SiteController')
const session = require('../middlewares/session')

routes.use(session.isConnected)
routes.get('/notice',session.admin,SiteController.loginAdm)
routes.post('/notice',session.admin,SiteController.admEditor)

module.exports = routes