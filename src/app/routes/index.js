const express = require('express');
const routes = express.Router();

const adminPage = require('./admin')
const mainPage = require('./main')
const userPage = require('./user')

routes.use(process.env.ROUTE_MAIN, mainPage)
routes.use(process.env.ROUTE_ADMIN,adminPage)
routes.use(process.env.ROUTE_USER,userPage)




module.exports = routes