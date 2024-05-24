const ClarityDB = require("clarity-db");
const { SteganoDB } = require("stegano.db");
const pgp = require("pg-promise")();
const { Sequelize } = require("sequelize")
const { MongoClient } = require('mongodb');
const mysql = require('mysql');
class Database { 
    constructor(dbName) {
        this.clarityDB = new ClarityDB(`./structures/DB/NOSQL/JSON/${dbName}.json`, {
            backup: {
                enabled: true,
                folder: './db_backups/',
                interval: 3600000
            },
            preset: {
                hello: "world"
            }
        });
        this.steganoDB = new SteganoDB(`./structures/DB/NOSQL/Stegano/${dbName}.png`);
    }
    useClarityDB() {
        return this.clarityDB;
    }
    useSteganoDB() {
        return this.steganoDB;
    }
}


class Mongo {

    constructor(dbName) {
        this.url = 'mongodb://localhost:27017';
        this.client = new MongoClient(this.url);
        this.dbName = dbName;
    }

    async connect() {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.Logger.info(`Connected successfully to server`, `Success`)
        return;
    }
    async useMongo() {
        return this.db;
    }
}

class Pgp {
    constructor() {
        this.connectString = "";
    }

    async connect() {
        this.client = pgp(this.connectString);
    };
    async usePgp() {
        return this.client;
    }
}

class sequelize {

    constructor() {
        this.type = "sqlite" // sqlite , postgres , mysql , mariadb, mssql , db2 , snowflake , oracle 
        switch (type) {
            case "sqlite":
                this.sequelize = new Sequelize('database', 'username', 'password', {
                    host: 'localhost',
                    dialect: 'sqlite'
                })
                break;
            case "postgres":
                this.sequelize = new Sequelize('database', 'username', 'password', {
                    host: 'localhost',
                    dialect: 'postgres'
                })
                break;
            case "mysql":
                this.sequelize = new Sequelize('database', 'username', 'password', {
                    host: 'localhost',
                    dialect: 'mysql'
                })
                break;
            case "mariadb":
                this.sequelize = new Sequelize('database', 'username', 'password', {
                    host: 'localhost',
                    dialect: 'mariadb'
                })
                break;
            case "mssql":
                this.sequelize = new Sequelize('database', 'username', 'password', {
                    host: 'localhost',
                    dialect: 'mssql'
                })
                break;
            case "db2":
                this.sequelize = new Sequelize('database', 'username', 'password', {
                    host: 'localhost',
                    dialect: 'db2'
                })
                break;
            case "snowflake":
                this.sequelize = new Sequelize('database', 'username', 'password', {
                    host: 'localhost',
                    dialect: 'snowflake'
                })
                break;
            case "oracle":
                this.sequelize = new Sequelize('database', 'username', 'password', {
                    host: 'localhost',
                    dialect: 'oracle'
                })
                break;
            default:
                this.sequelize = new Sequelize('database', 'username', 'password', {
                    host: 'localhost',
                    dialect: 'sqlite'
                })
                break;
        }
    }
    async useSequelize() {
        return this.sequelize;
    }
}
class MySQL {
    constructor() {
        this.host = 'localhost';
        this.user = '';
        this.password = '';
        this.database = '';
    }
    async connect() {
        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password:  this.password,
            database: this.database
        });
        this.connection.connect(function (err) {
            this.Logger.info(`Connected successfully to server`, `Success`)
            this.Logger.info(`Connected successfully to database`, `Success`)
            this.Logger.info(`Connected successfully as Id ${this.connection.threadId}`, `Success`)
        });
        return;
    }
    async useMySQL() {
        return this.connection;
    }
}


module.exports = { Database, Mongo, Pgp, sequelize, MySQL }