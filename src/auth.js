const {sha1} = require('sha1');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../src/app/models/UserModel');

const users = [{
    _id: 1,
    username: 'adm',
    password: ''
}]

module.exports = function(passport){
    let user = User.findByLogin(users.username)

    passport.serializeUser((user,done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(()=>{
        try{
            const user = User.findByLogin(users.username)
            done(null, user)
        }catch(err){
            console.log(err)
            return done(err, null)
        }
    })
    passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password'
    }, 
    (username, password, done)=>{
        try{
            const user = findByLogin(username)
            if(!user) return done(null,false)
            var hash_bytes = sha1(sha1(password, {asBytes: true}),{asBytes: false});
            var result = "*"+hash_bytes.toUpperCase();
            if (result == user.password){
                done(null,user)
            }else{
                done(null,false)
            }

        }catch(err){
            console.log(err)
            done(err, false)
        }

    }))
}