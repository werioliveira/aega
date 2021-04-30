const { query } = require('../../config/db');
const db = require('../../config/db');
const { getInstance } = require('../../config/database');
let newdatabase = getInstance();
module.exports = {
    
    LoadRankPlayer() {
        
        
        //newdatabase.getInstance()
        return newdatabase.db.promise().query(`SELECT * FROM player.player WHERE name not like '[%]%' ORDER BY level DESC,playtime DESC LIMIT 5`);
       // return db.promise().query(`SELECT * FROM player.player WHERE name not like '[%]%' ORDER BY level DESC,playtime DESC LIMIT 5`);
    },
    LoadRankGuild(){
        return newdatabase.db.promise().query(`SELECT name,level,win FROM player.guild ORDER BY level DESC,win DESC LIMIT 10`);
    },
    OnlineCounter(){
        return newdatabase.db.promise().query("SELECT COUNT(id) as count FROM player.player WHERE DATE_SUB(NOW(), INTERVAL 60 MINUTE) < last_play;")
    },
    
				
    async loadPlayersAll(page){
        var numPerPage = 25;
        var skip = (page-1) * numPerPage; 
        var limit = skip + ',' + numPerPage; // Here we compute the LIMIT parameter for MySQL query
        const player = await newdatabase.db.promise().query('SELECT count(*) as numRows FROM player.player')
            if(!player) {
                console.log("error: ", err);
                return (err, null);
            }else{
                //console.log(player[0][0])
                var numRows = player[0][0].numRows;
                var numPages = Math.ceil(numRows / numPerPage);
                //return db.promise().query(`SELECT player.player.name as name, player.player.job,player.player.level,player.player.last_play,player.player.exp,player.guild.name as guild,player.player.playtime,player.player_index.empire FROM player.player LEFT JOIN player.guild_member ON player.id = guild_member.pid LEFT JOIN player.guild ON guild_member.guild_id = guild.id INNER JOIN player.player_index ON player.account_id = player.player_index.id WHERE player.name NOT LIKE '[%' ORDER BY player.level DESC , player.playtime DESC LIMIT 20"`)
                const result = await newdatabase.db.promise().query(`SELECT player.player.name as name, player.player.job,player.player.level,player.player.last_play,player.player.exp,player.guild.name as guild,player.player.playtime,player.player_index.empire FROM player.player LEFT JOIN player.guild_member ON player.id = guild_member.pid LEFT JOIN player.guild ON guild_member.guild_id = guild.id INNER JOIN player.player_index ON player.account_id = player.player_index.id WHERE player.name NOT LIKE '[%' ORDER BY player.level DESC , player.playtime DESC LIMIT `+limit)
                    if(!result) {
                        console.log("error: ");
                        return(null);
                    }else{
                        return{numPages,result};
                    }           
            }
    },
    async loadGuilds(){

        return newdatabase.db.promise().query(`SELECT player.guild.name as guild, player.guild.win,player.guild.ladder_point,player.player.name as player,player.player_index.empire as reino FROM player.guild LEFT JOIN player.player ON player.guild.master = player.id LEFT JOIN player.player_index ON player.player.account_id = player_index.id ORDER BY player.guild.ladder_point DESC limit 20`)  
				
    }
}