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
    constructor(connectionString) {
        this.connectionString = connectionString;
    }

    usePgp() {
        if (!this.db) {
            this.db = pgp(this.connectionString);
            console.log("Connected to the database successfully.");
        }
        return this.db;
    }
}

class SequelizeConfig {
    constructor(type = "sqlite", database = 'database', username = 'username', password = 'password', host = 'localhost') {
        this.type = type;
        this.database = database;
        this.username = username;
        this.password = password;
        this.host = host;

        switch (this.type) {
            case "sqlite":
                this.sequelize = new Sequelize(this.database, this.username, this.password, {
                    host: this.host,
                    dialect: 'sqlite'
                });
                break;
            case "postgres":
                this.sequelize = new Sequelize(this.database, this.username, this.password, {
                    host: this.host,
                    dialect: 'postgres'
                });
                break;
            case "mysql":
                this.sequelize = new Sequelize(this.database, this.username, this.password, {
                    host: this.host,
                    dialect: 'mysql'
                });
                break;
            case "mariadb":
                this.sequelize = new Sequelize(this.database, this.username, this.password, {
                    host: this.host,
                    dialect: 'mariadb'
                });
                break;
            case "mssql":
                this.sequelize = new Sequelize(this.database, this.username, this.password, {
                    host: this.host,
                    dialect: 'mssql'
                });
                break;
            case "db2":
                this.sequelize = new Sequelize(this.database, this.username, this.password, {
                    host: this.host,
                    dialect: 'db2'
                });
                break;
            case "snowflake":
                this.sequelize = new Sequelize(this.database, this.username, this.password, {
                    host: this.host,
                    dialect: 'snowflake'
                });
                break;
            case "oracle":
                this.sequelize = new Sequelize(this.database, this.username, this.password, {
                    host: this.host,
                    dialect: 'oracle'
                });
                break;
            default:
                throw new Error(`Unsupported database type: ${this.type}`);
        }
    }

    async useSequelize() {
        this.sequelize.authenticate()
        console.log("[Database Authentication] Using Sequelize");
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


module.exports = { Database, Mongo, Pgp, SequelizeConfig, MySQL }