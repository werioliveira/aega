//const mysql = require('mysql2');
const db = require('./db')
var instance = null;
class Database{
    //let instance = null;
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