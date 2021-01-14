const db = require('../../config/db');
var sha1 = require('sha1');

module.exports = {
    register(user){
        var hash_bytes = sha1(sha1(user.password, {asBytes: true}),{asBytes: false});
        var result = "*"+hash_bytes.toUpperCase();
        const query = `INSERT INTO account.account
        (
            login,
            password,
            real_name,
            email,
            social_id
        )
        VALUES
        ( ?, ?, ?, ?, ?)`;

        const values = [
            user.login,
            result,
            user.real_name,
            user.email,
            user.social_id
        ];


        return db.promise().query(query, values);
    },
    findByLogin(login) {
        return db.promise().query(`SELECT * FROM account.account WHERE login = '${login}'`);
    },
    findByEmail(email) {
        return db.promise().query(`SELECT * FROM account.account WHERE email = '${email}'`);
    },   
    findAccount(login,password){
        var hash_bytes = sha1(sha1(password, {asBytes: true}),{asBytes: false});
        var result = "*"+hash_bytes.toUpperCase();
        var sql = "SELECT * FROM account.account WHERE login = ? AND password = ?";
        var inserts = [login,result]
        sql = db.format(sql,inserts)
        return db.promise().query(sql)
    },
    updatePassword(login,password){
        var hash_bytes = sha1(sha1(password, {asBytes: true}),{asBytes: false});
        var result = "*"+hash_bytes.toUpperCase();
        const query = `UPDATE account.account SET
                password = ?
                WHERE login = ?`;

            const values = [
                result,
                login
            ];
        return db.promise().query(query, values)     
    },
    findSocialID(id){
        return db.promise().query(`SELECT social_id,email FROM account.account WHERE id = ${id}`)
    },
    safeboxPassword(id){
        return db.promise().query(`SELECT password FROM player.safebox WHERE account_id = ${id}`)
    },
    async selectAndUpdateSafeboxPassword(id){
        const safeboxPass = await db.promise().query(`SELECT * FROM player.safebox WHERE account_id = ${id}`);
        if (!safeboxPass) {
            return;
        } else {
                let safebox = Math.random().toString().slice(2,8);
                const query = `UPDATE player.safebox SET
                password = ?
                WHERE account_id = ?`;

                const values = [
                 safebox,
                    id
                ];
            return db.promise().query(query, values) 
        }
    },
    selectPlayer(id){
        return db.promise().query(`SELECT id, player.name,player.job from player.player where account_id =${id}`)
    },
    async unbugPlayer(id,idplayer){
        const player = await db.promise().query(`SELECT id FROM player.player WHERE account_id = ${id} and id = ${idplayer}`)
        if (!player){
            return
        }else{
            return db.promise().query(`UPDATE player.player SET exit_x = '876288', exit_y = '250466', exit_map_index = '43', x = '876288',y = '250466',map_index = '43' WHERE id = ${idplayer}`)
        }
    },
    async findSocialIdAndUpdate(id) {
        let social = Math.random().toString().slice(2,9);
        const user = await db.promise().query(`SELECT social_id,email FROM account.account WHERE id = ${id}`);
        if (!user) {
            return;
        } else {
            const query = `UPDATE account.account SET
                social_id = ?
                WHERE id = ?`;

            const values = [
                social,
                id
            ];

            return db.promise().query(query, values);
        }

    },
    async findByIdAndUpdate(account_id) {
        const user = await db.promise().query(`SELECT * FROM account.account WHERE id = ${account_id}`);
        if (!user) {
            return;
        } else {
            const query = `UPDATE account.account SET
                passlost_token = ?
                WHERE id = ?`;

            const values = [
                null,
                account_id
            ];

            return db.promise().query(query, values);
        }

    },
    async selectCode(login,code){
        
        return db.promise().query(`SELECT passlost_token FROM account.account WHERE login = '${login}' AND passlost_token = '${code}'`)
    },
    findNotices(){
        return db.promise().query(`SELECT * FROM web.notices`)
    },
    findNoticesById(id){
        return db.promise().query(`SELECT * FROM web.notices where id = '${id}'`)
    },
    addNotice(data){
        const query = `INSERT INTO web.notices
        (
            title,
            content,
            preview,
            subtitle
        )
        VALUES
        (?, ?, ?, ?)`;

        const values = [
            data.title,
            data.editor1,
            data.preview,
            data.subtitle
        ];  
        return db.promise().query(query, values)
    },
    findDownload(){
        return db.promise().query("SELECT * FROM web.links");
    }
        
}