const { login } = require('../controllers/SiteController');
const User = require('../models/UserModel');

module.exports = {
    async postAccount(req, res, next) {
        if(req.body.login === undefined || req.body.login === '' || req.body.login === null) {
            return res.redirect(401,'/register'); 
        }
        if(req.body.password === undefined || req.body.password === '' || req.body.password === null) {
            return res.redirect(401,'/register'); 
        }
        if(req.body.password2 === undefined || req.body.password2 === '' || req.body.password2 === null) {
            return res.redirect(401,'/register'); 
        }
        if(req.body.email === undefined || req.body.email === '' || req.body.email === null) {
            return res.redirect(401,'/register'); 
        }
        if(req.body.real_name === undefined || req.body.real_name === '' || req.body.real_name === null) {
            return res.redirect(401,'/register'); 
        }     
        if(req.body.social_id === undefined || req.body.social_id === '' || req.body.social_id === null) {
            return res.redirect(401,'/register'); 
        }   
        if(req.body.password != req.body.password2)  
            return res.redirect(401,'/register'); 
        const account = await User.findByLogin(req.body.login)
        if (account)
            return res.redirect(401,'/register');

        next();
    },
    async login(req,res,next){
        if(req.body.login === undefined || req.body.login === '' || req.body.login === null) {
            return res.redirect(401,'/'); 
        } 
        if(req.body.password === undefined || req.body.password === '' || req.body.password === null) {
            return res.redirect(401,'/'); 
        }   
        next();    
    }
}