const Ranking = require('../models/RankingModel');
async function loadInfoRankings(){
    let players = await Ranking.LoadRankPlayer();
    let guilds = await Ranking.LoadRankGuild();
    let countPlayer = await Ranking.OnlineCounter();
    return {players, guilds, countPlayer}
}
function validateEmail(email){ 
    var re = /^(([^<>()[]\\.,;:\s@\"]+(\.[^<>()[]\\.,;:\s@\"]+)*)|(\".+\"))@(([[0-9]{1,3}\‌​.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    return re.test(email); 
}
function validatePassword(password){ 
    var re = /^[a-z0-9 ]$/i; 
    return re.test(password); 
}
function validateLogin(login){ 
    var re = /^[a-z0-9 ]$/i; 
    return re.test(login); 
}
function validateName(name){ 
    var re = /^[a-z0-9 ]$/i; 
    return re.test(name); 
}
function validateSocial(social){ 
    var re = /^\d{7}$/; 
    return re.test(social); 
}
module.exports = {
    loadInfoRankings,
    validateEmail,
    validateLogin,
    validatePassword,
    validateSocial,
    validateName
};