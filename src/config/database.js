
const db = require('./db')
var instance = null;
class Database{

    constructor(){
        this.db = db;

    }

    static getInstance(){
        if(!instance){
            instance = new Database();
        }
        return instance;
    }


}
module.exports = Database;